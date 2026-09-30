/**
 * A wiki page's earlier versions, and reading one version against another.
 *
 * Every page keeps a full snapshot of its sections at each revision, so a
 * proposed or accepted change can always be shown against exactly what it
 * replaced — including for a page that has only ever had one version.
 */
import { store } from './store.js';

/** Every revision of a page, oldest first. @param {string} pageId */
export function revisionsOf(pageId) {
  return store().revisionsByPage.get(pageId) ?? [];
}

/** The revision a page currently reads as, or null for an unknown page. */
export function currentRevision(pageId) {
  const all = revisionsOf(pageId);
  return all.length ? all[all.length - 1] : null;
}

/** The revision immediately before the given one, or null if it is the first. */
export function previousRevision(pageId, revisionId) {
  const all = revisionsOf(pageId);
  const i = all.findIndex((r) => r.id === revisionId);
  return i > 0 ? all[i - 1] : null;
}

/**
 * One version read against another, section by section.
 *
 * @param {import('./types.js').WikiSection[]} before
 * @param {import('./types.js').WikiSection[]} after
 * @returns {{sectionId: string, heading: string,
 *            status: 'added'|'removed'|'changed'|'unchanged',
 *            before: string|null, after: string|null}[]}
 */
export function diffSections(before, after) {
  const beforeById = new Map((before ?? []).map((s) => [s.id, s]));
  const afterById = new Map((after ?? []).map((s) => [s.id, s]));
  const ids = [...new Set([...beforeById.keys(), ...afterById.keys()])];

  return ids.map((id) => {
    const b = beforeById.get(id);
    const a = afterById.get(id);
    if (!b) return { sectionId: id, heading: a.heading, status: 'added', before: null, after: a.body };
    if (!a) return { sectionId: id, heading: b.heading, status: 'removed', before: b.body, after: null };
    const changed = b.body !== a.body || b.heading !== a.heading;
    return {
      sectionId: id,
      heading: a.heading,
      status: changed ? 'changed' : 'unchanged',
      before: b.body,
      after: a.body,
    };
  });
}

/**
 * What one revision changed about the page.
 * The first revision of a page reads as every section added.
 *
 * @param {string} pageId
 * @param {string} revisionId
 */
export function changesIn(pageId, revisionId) {
  const all = revisionsOf(pageId);
  const revision = all.find((r) => r.id === revisionId);
  if (!revision) return null;
  const previous = previousRevision(pageId, revisionId);
  return {
    revision,
    previous,
    sections: diffSections(previous?.sections ?? [], revision.sections),
  };
}
