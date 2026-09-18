// Ask GitHub Actions to rebuild and deploy the site. Article pages are static,
// so a new post, a draft preview, or a removed article needs a build before it
// shows; publishing an edit to an existing article does not (the page hydrates
// from /api/content), but a rebuild keeps the baked HTML current too.
//
// deploy.yml runs under a concurrency group, so rapid requests collapse into
// at most one running plus one queued build. The debounce here just avoids
// hammering the GitHub API when an editor saves several times in a row.
import type { Firestore } from 'firebase-admin/firestore';

export const DEPLOY_REPO = 'Cardo-Rich/CVR-website2026';
export const DEPLOY_WORKFLOW = 'deploy.yml';
export const DEPLOY_REF = 'main';
const DEBOUNCE_MS = 45_000;

export type DeployResult = 'triggered' | 'debounced' | 'disabled' | 'failed';

export async function requestDeploy(db: Firestore, token: string, reason: string, opts: { hostingOnly?: boolean } = {}): Promise<DeployResult> {
  if (!token || token === 'unset') {
    console.warn('requestDeploy: GITHUB_DEPLOY_TOKEN is not set; the site will rebuild on the next scheduled refresh instead.', { reason });
    return 'disabled';
  }
  const marker = db.doc('config/deploy');
  const last = Date.parse(((await marker.get()).data()?.lastRequestedAt as string) || '') || 0;
  if (Date.now() - last < DEBOUNCE_MS) return 'debounced';

  const r = await fetch(`https://api.github.com/repos/${DEPLOY_REPO}/actions/workflows/${DEPLOY_WORKFLOW}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: DEPLOY_REF, inputs: { hosting_only: opts.hostingOnly ? 'true' : 'false', reason: reason.slice(0, 120) } }),
  });
  if (r.status !== 204) {
    console.error('requestDeploy: GitHub returned', r.status, await r.text().catch(() => ''));
    return 'failed';
  }
  await marker.set({ lastRequestedAt: new Date().toISOString(), reason }, { merge: true });
  return 'triggered';
}
