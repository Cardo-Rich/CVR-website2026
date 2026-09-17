/* Rich-text editor for Journal article bodies, used by the inline admin
   layer's blog modal. A contentEditable surface with a toolbar, built on the
   browser's editing commands rather than a library so that the article HTML
   the site already has (p.lede, div.callout, a.inline, blockquote, lists)
   round-trips untouched: the editor never normalises markup it did not write.

   What it offers: block styles (paragraph, lede, heading, subheading, quote,
   callout), bold / italic / underline / strikethrough, bullet and numbered
   lists, link / unlink, left / centre alignment, a horizontal rule, clear
   formatting, undo / redo, and an HTML source view. Colour and font-size
   pickers are left out on purpose: the Journal's type system is fixed by the
   site styles. */

export interface RichEditor { wrap: HTMLElement; get: () => string }

const ALLOWED_TAGS = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'blockquote', 'br', 'div', 'hr', 'img', 'figure', 'figcaption']);
// Removed with their contents, never unwrapped.
const DROPPED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'template', 'noscript']);
const ALLOWED_CLASSES = new Set(['lede', 'callout', 'eyebrow', 'inline']);
const BLOCK = /^(P|H2|H3|BLOCKQUOTE|LI)$/;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

// Keep only the tags, classes and attributes the site's prose styles know
// about. Unknown tags are unwrapped (their text survives); plain divs the
// browser inserts on Enter become paragraphs; alignment survives as the one
// allowed inline style.
export function sanitizeBody(html: string): string {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const walk = (parent: ParentNode) => {
    for (const child of Array.from(parent.children)) {
      const tag = child.tagName.toLowerCase();
      if (DROPPED_TAGS.has(tag)) { child.remove(); continue; }
      if (!ALLOWED_TAGS.has(tag)) { walk(child); child.replaceWith(...Array.from(child.childNodes)); continue; }
      if (tag === 'div' && !child.classList.contains('callout')) {
        const p = document.createElement('p');
        p.append(...Array.from(child.childNodes));
        child.replaceWith(p);
        walk(p);
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name;
        if (name === 'href' && tag === 'a') continue;
        if ((name === 'src' || name === 'alt') && tag === 'img') continue;
        if (name === 'class') {
          const keep = attr.value.split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
          if (keep.length) child.setAttribute('class', keep.join(' ')); else child.removeAttribute('class');
          continue;
        }
        if (name === 'style') {
          const m = /text-align:\s*(left|center|right)/i.exec(attr.value);
          if (m && m[1].toLowerCase() !== 'left') child.setAttribute('style', `text-align:${m[1].toLowerCase()}`); else child.removeAttribute('style');
          continue;
        }
        child.removeAttribute(name);
      }
      if (tag === 'a') {
        const href = child.getAttribute('href') || '';
        if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) child.removeAttribute('href');
        child.classList.add('inline');
      }
      walk(child);
    }
  };
  walk(tpl.content);
  return tpl.innerHTML.replace(/^\s+|\s+$/g, '');
}

export function richEditor(initialHtml: string): RichEditor {
  const area = document.createElement('div');
  area.className = 'cadm-rte__area';
  area.contentEditable = 'true';
  area.spellcheck = true;
  area.innerHTML = initialHtml;

  const src = document.createElement('textarea');
  src.className = 'cadm-rte__src';
  src.hidden = true;
  src.spellcheck = false;

  const bar = document.createElement('div');
  bar.className = 'cadm-rte__bar';
  const wrap = document.createElement('div');
  wrap.className = 'cadm-rte';
  wrap.append(bar, area, src);

  let srcMode = false;
  const exec = (cmd: string, value?: string) => { area.focus(); document.execCommand(cmd, false, value); refresh(); };
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch { /* older engines */ }

  // ---- selection helpers ----
  const within = (node: Node | null): node is HTMLElement => !!node && node !== area && area.contains(node);
  function selectionNode(): Node | null {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const n = sel.getRangeAt(0).startContainer;
    return area.contains(n) ? n : null;
  }
  function blockOf(): HTMLElement | null {
    let n: Node | null = selectionNode();
    while (within(n)) { if (n instanceof HTMLElement && BLOCK.test(n.tagName)) return n; n = n.parentNode; }
    return null;
  }
  function closest(sel: string): HTMLElement | null {
    let n: Node | null = selectionNode();
    while (within(n)) { if (n instanceof HTMLElement && n.matches(sel)) return n; n = n.parentNode; }
    return null;
  }

  // ---- block styles ----
  const styleSel = document.createElement('select');
  styleSel.title = 'Paragraph style';
  for (const [v, label] of [['p', 'Paragraph'], ['lede', 'Lede (opening)'], ['h2', 'Heading'], ['h3', 'Subheading'], ['blockquote', 'Quote'], ['callout', 'Callout box']]) {
    const o = document.createElement('option'); o.value = v; o.textContent = label; styleSel.append(o);
  }
  styleSel.addEventListener('change', () => { applyStyle(styleSel.value); area.focus(); });

  function applyStyle(v: string) {
    if (v === 'callout') { toggleCallout(); return; }
    if (v === 'lede') { exec('formatBlock', 'p'); blockOf()?.classList.add('lede'); return; }
    exec('formatBlock', v);
    if (v === 'p') blockOf()?.classList.remove('lede');
  }
  function toggleCallout() {
    const existing = closest('.callout');
    if (existing) {
      // Unwrap: the eyebrow label goes back to a plain paragraph.
      const eyebrow = existing.querySelector('.eyebrow');
      if (eyebrow) { eyebrow.classList.remove('eyebrow'); if (!eyebrow.className) eyebrow.removeAttribute('class'); }
      existing.replaceWith(...Array.from(existing.childNodes));
      refresh();
      return;
    }
    const block = blockOf();
    const box = document.createElement('div');
    box.className = 'callout';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'The Cardo view';
    box.append(eyebrow);
    if (block && block.tagName !== 'LI') { block.replaceWith(box); box.append(block); }
    else { const p = document.createElement('p'); p.innerHTML = '<br>'; box.append(p); area.append(box); }
    refresh();
  }

  // ---- links ----
  function link() {
    const anchor = closest('a');
    const url = prompt('Link URL', anchor?.getAttribute('href') || 'https://');
    if (url === null) return;
    if (!url.trim()) { exec('unlink'); return; }
    const sel = window.getSelection();
    if (sel && sel.isCollapsed && !anchor) {
      exec('insertHTML', `<a class="inline" href="${escapeHtml(url)}">${escapeHtml(url)}</a>`);
      return;
    }
    exec('createLink', url);
    area.querySelectorAll('a').forEach((a) => a.classList.add('inline'));
  }

  // ---- source view ----
  function toggleSource() {
    srcMode = !srcMode;
    if (srcMode) {
      src.value = area.innerHTML.replace(/<\/(p|h2|h3|ul|ol|li|blockquote|div|figure)>/g, '$&\n');
      area.hidden = true; src.hidden = false; src.focus();
    } else {
      area.innerHTML = src.value;
      src.hidden = true; area.hidden = false; area.focus();
    }
    bar.querySelectorAll<HTMLButtonElement>('button, select').forEach((b) => { if (b !== srcBtn) b.disabled = srcMode; });
    srcBtn.classList.toggle('is-on', srcMode);
  }

  // ---- toolbar ----
  function btn(label: string, title: string, onClick: () => void, key?: string): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cadm-rte__btn'; b.textContent = label; b.title = title;
    if (key) b.dataset.state = key;
    b.addEventListener('mousedown', (e) => e.preventDefault()); // keep the selection
    b.addEventListener('click', onClick);
    return b;
  }
  const sep = () => { const s = document.createElement('span'); s.className = 'cadm-rte__sep'; return s; };
  const srcBtn = btn('HTML', 'Edit the HTML source', toggleSource);
  bar.append(
    styleSel, sep(),
    btn('B', 'Bold (Ctrl+B)', () => exec('bold'), 'bold'),
    btn('I', 'Italic (Ctrl+I)', () => exec('italic'), 'italic'),
    btn('U', 'Underline (Ctrl+U)', () => exec('underline'), 'underline'),
    btn('S', 'Strikethrough', () => exec('strikeThrough'), 'strikeThrough'),
    sep(),
    btn('• List', 'Bulleted list', () => exec('insertUnorderedList'), 'insertUnorderedList'),
    btn('1. List', 'Numbered list', () => exec('insertOrderedList'), 'insertOrderedList'),
    sep(),
    btn('Link', 'Insert or edit a link', link),
    btn('Unlink', 'Remove the link', () => exec('unlink')),
    sep(),
    btn('Left', 'Align left', () => exec('justifyLeft'), 'justifyLeft'),
    btn('Center', 'Align centre', () => exec('justifyCenter'), 'justifyCenter'),
    btn('Rule', 'Insert a horizontal rule', () => exec('insertHorizontalRule')),
    btn('Clear', 'Remove inline formatting', () => exec('removeFormat')),
    sep(),
    btn('Undo', 'Undo (Ctrl+Z)', () => exec('undo')),
    btn('Redo', 'Redo (Ctrl+Shift+Z)', () => exec('redo')),
    sep(),
    srcBtn,
  );
  bar.querySelector('select')!.addEventListener('mousedown', (e) => e.stopPropagation());

  // Reflect the caret's formatting in the toolbar.
  function refresh() {
    if (srcMode) return;
    bar.querySelectorAll<HTMLButtonElement>('button[data-state]').forEach((b) => {
      let on = false;
      try { on = document.queryCommandState(b.dataset.state!); } catch { /* unsupported */ }
      b.classList.toggle('is-on', on);
    });
    const block = blockOf();
    const inCallout = !!closest('.callout');
    styleSel.value = inCallout ? 'callout'
      : !block ? 'p'
      : block.tagName === 'P' ? (block.classList.contains('lede') ? 'lede' : 'p')
      : block.tagName === 'LI' ? 'p'
      : block.tagName.toLowerCase();
  }
  document.addEventListener('selectionchange', () => { if (area.contains(document.activeElement)) refresh(); });
  area.addEventListener('keyup', refresh);
  area.addEventListener('mouseup', refresh);

  // Paste as clean HTML (or paragraphs from plain text), never as the source
  // application's markup.
  area.addEventListener('paste', (e) => {
    const html = e.clipboardData?.getData('text/html') || '';
    const text = e.clipboardData?.getData('text/plain') || '';
    if (!html && !text) return;
    e.preventDefault();
    const clean = html ? sanitizeBody(html) : text.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
    exec('insertHTML', clean);
  });

  return { wrap, get: () => sanitizeBody(srcMode ? src.value : area.innerHTML) };
}
