import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { beforeAll, afterAll, it, describe } from 'vitest';

let env: RulesTestEnvironment;
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'cardo-rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
afterAll(() => env.cleanup());

describe('firestore rules', () => {
  it('admin can write an article', async () => {
    const db = env.authenticatedContext('u1', { admin: true }).firestore();
    await assertSucceeds(setDoc(doc(db, 'articles/a1'), { slug: 'x', status: 'draft' }));
  });
  it('non-admin cannot write an article', async () => {
    const db = env.authenticatedContext('u2', {}).firestore();
    await assertFails(setDoc(doc(db, 'articles/a2'), { slug: 'y' }));
  });
  it('anonymous cannot read articles', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'articles/a1')));
  });
  it('nobody can client-write properties', async () => {
    const db = env.authenticatedContext('u1', { admin: true }).firestore();
    await assertFails(setDoc(doc(db, 'properties/p1'), { name: 'Villa' }));
  });
});
