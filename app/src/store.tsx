// App state and actions. Mirrors the behaviour of the design prototype: everything is in memory
// and resets on reload.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CATEGORIES, CAT_BY_KEY, SEED_ENTITIES, SOURCES, TEXT_EXT, USERS, draftKey, emptyDraft, entityDraft, extOf, fieldsFor, toEditDraft, uid, MAX_BYTES,
  type Draft, type EditDraft, type Entity, type FileCatKey, type FileRec, type Notification, type Step, type UserId, type Verb,
} from './data';
import type { ToastAction, ToastTone } from './components/pds';

export type Screen = 'home' | 'dashboard' | 'wizard' | 'edit' | 'review' | 'success';
export interface UploadError { id: string; name: string; msg: string }

export interface State {
  user: UserId;
  screen: Screen;
  navOpen: boolean;
  entities: Entity[];
  notifications: Notification[];
  // dashboard
  search: string;
  fCat: string;
  fStatus: string;
  fSrc: string;
  expanded: Record<string, boolean>;
  categories: string[];
  newCat: { text: string; error: string } | null;
  deleting: { id: string; name: string } | null;
  // new entity wizard
  draft: Draft | null;
  draftId: string | null;
  /** draftKey() of the draft when it was opened; "Save as draft" shows once it differs. */
  draftBase: string;
  /** Set in "Make changes" mode: the Changes requested entity being revised in the wizard. */
  resubmitId: string | null;
  /** The reviewer's comment shown at the top of "Make changes". */
  feedback: { comment: string; by: string; at: number } | null;
  /** draftKey() when changes were requested; Submit needs at least one change from it. */
  revBase: string;
  step: Step;
  submitting: boolean;
  // edit entity
  editId: string | null;
  editDraft: EditDraft | null;
  editOriginal: string;
  // review submission
  reviewId: string | null;
  approving: boolean;
  changes: { text: string; error: boolean } | null;
  // prompts & evals
  collapsed: Partial<Record<FileCatKey, boolean>>;
  showAll: Partial<Record<FileCatKey, boolean>>;
  sumExpanded: Partial<Record<FileCatKey, boolean>>;
  uploadErrors: Partial<Record<FileCatKey, UploadError[]>>;
  removing: { id: string; name: string; cat: FileCatKey } | null;
  preview: FileRec | null;
  /** Preview opened from the wizard, where text files can be edited in place. */
  previewEditable: boolean;
  editing: boolean;
  editText: string;
  /** Unsaved file edits: ask before closing the preview or cancelling the edit. */
  discardAsk: 'close' | 'cancel' | null;
  fileMenu: string | null;
  // chrome
  drawerOpen: boolean;
  bellOpen: boolean;
  userOpen: boolean;
  toast: { message: string; tone: ToastTone; actions: ToastAction[] } | null;
}

// Entities, notifications, the signed-in user and categories persist in this browser (and sync across tabs).
const STORE_KEY = 'sidekick-admin-state-v1';
type Saved = Pick<State, 'entities'> & Partial<Pick<State, 'notifications' | 'user' | 'categories'>>;

function readStore(): Saved | null {
  try {
    const o = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!o || !Array.isArray(o.entities)) return null;
    const out: Saved = { entities: o.entities };
    if (Array.isArray(o.notifications)) out.notifications = o.notifications;
    if (o.user && o.user in USERS) out.user = o.user;
    if (Array.isArray(o.categories) && o.categories.length) out.categories = o.categories;
    return out;
  } catch {
    return null;
  }
}

function writeStore(s: State) {
  // Object URLs of uploaded files don't survive a reload, so only the text content is kept.
  const entities = s.entities.map(e => ({ ...e, files: e.files.map(({ url: _url, ...rest }) => rest) }));
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ entities, notifications: s.notifications, user: s.user, categories: s.categories }));
  } catch { /* storage full or disabled: keep working in memory */ }
}

/**
 * The design opens on an empty Entity dashboard, or on what was saved last time.
 * ?sample replaces that with example entities; the parameter is then dropped so a reload keeps your changes.
 */
function startingData(): Saved {
  const params = new URLSearchParams(location.search);
  if (params.has('sample')) {
    params.delete('sample');
    const q = params.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    return { entities: SEED_ENTITIES, notifications: [] };
  }
  return readStore() || { entities: [] };
}

const initialState: State = {
  user: 'priya', screen: 'dashboard', navOpen: false,
  entities: [], notifications: [],
  search: '', fCat: '', fStatus: '', fSrc: '', expanded: {},
  categories: [...CATEGORIES], newCat: null, deleting: null,
  draft: null, draftId: null, draftBase: '', step: 1, submitting: false,
  resubmitId: null, feedback: null, revBase: '',
  editId: null, editDraft: null, editOriginal: '',
  reviewId: null, approving: false, changes: null,
  collapsed: {}, showAll: {}, sumExpanded: {}, uploadErrors: {}, removing: null, preview: null,
  previewEditable: false, editing: false, editText: '', discardAsk: null, fileMenu: null,
  drawerOpen: false, bellOpen: false, userOpen: false, toast: null,
};

type Patch = Partial<State> | ((s: State) => Partial<State> | null);

function useAdminStore() {
  const [state, setState] = useState<State>(() => ({ ...initialState, ...startingData() }));
  const ref = useRef(state);
  ref.current = state;
  const [now, setNow] = useState(() => Date.now());
  const timers = useRef({ toast: 0, uploads: {} as Record<string, number>, done: [] as { name: string; cat: string }[] });

  const set = (p: Patch) => setState(s => {
    const next = typeof p === 'function' ? p(s) : p;
    return next ? { ...s, ...next } : s;
  });

  const me = USERS[state.user];

  const toast = (message: string, tone: ToastTone = 'positive', actions: ToastAction[] = []) => {
    clearTimeout(timers.current.toast);
    set({ toast: { message, tone, actions } });
    timers.current.toast = window.setTimeout(() => set({ toast: null }), actions.length ? 8000 : 5000);
  };

  /**
   * Navigate. Leaving the wizard keeps the work as a Draft row once a category and entity are picked,
   * unless `noSave` (the draft was just saved or deleted explicitly).
   */
  const go = (screen: Screen, extra: Partial<State> = {}, { noSave = false } = {}) => {
    const s = ref.current;
    const d = s.draft;
    const leavingWizard = s.screen === 'wizard' && screen !== 'wizard';
    let saved: Entity | null = null;
    let revised: Entity | null = null;
    if (!noSave && leavingWizard && s.resubmitId && d) {
      // Leaving "Make changes" keeps the edits on the entity (still Changes requested), not as a draft.
      const prev = s.entities.find(e => e.id === s.resubmitId);
      if (prev && draftKey(d) !== draftKey(entityDraft(prev))) {
        revised = { ...prev, category: d.category, name: d.entity, source: d.source || '—', tables: d.tables, files: d.files.filter(x => x.status === 'done'), updatedAt: Date.now() };
      }
    } else if (!noSave && leavingWizard && d && d.category && d.entity) {
      saved = {
        id: s.draftId || 'd' + Date.now(), category: d.category, name: d.entity, source: d.source || '—',
        tables: d.tables, files: d.files.filter(x => x.status === 'done'), status: 'draft', step: s.step, updatedAt: Date.now(),
      };
    }
    if (s.screen !== screen) extra = { preview: null, editing: false, discardAsk: null, ...extra };
    if (screen === 'wizard' && extra.draft) extra = { ...extra, draftBase: draftKey(extra.draft) };
    set(st => ({
      screen, bellOpen: false, userOpen: false, drawerOpen: false, fileMenu: null,
      ...(leavingWizard ? { draft: null, draftId: null, step: 1 as Step, resubmitId: null, feedback: null, revBase: '' } : {}),
      ...(saved ? { entities: [saved, ...st.entities.filter(e => e.id !== saved!.id)] } : {}),
      ...(revised ? { entities: st.entities.map(e => e.id === revised!.id ? revised! : e) } : {}),
      ...extra,
    }));
    if (saved) toast('Draft saved to Entities.', 'info');
    if (revised) toast('Your changes to ' + revised.name + ' are saved. Submit for review when you’re ready.', 'info');
    window.scrollTo(0, 0);
  };

  // ---- data & schema form (shared by the wizard and Edit entity) ----
  const formKey = () => (ref.current.screen === 'edit' ? 'editDraft' : 'draft') as 'editDraft' | 'draft';
  const patchForm = (p: Partial<Draft & EditDraft>) => {
    const k = formKey();
    set(s => ({ [k]: { ...(s[k] || emptyDraft()), ...p } }) as Partial<State>);
  };
  const currentForm = () => ref.current[formKey()] || emptyDraft();
  const addTable = (name: string) => {
    const f = currentForm();
    if (!name || f.tables.some(t => t.name === name) || !(SOURCES[f.source] || []).includes(name)) return;
    patchForm({ tables: [...f.tables, { name, fields: fieldsFor(name, false) }] });
  };
  const removeTable = (name: string) => patchForm({ tables: currentForm().tables.filter(t => t.name !== name) });

  // ---- prompts & evals files ----
  const updateFile = (id: string, p: Partial<FileRec>) =>
    set(s => s.draft ? { draft: { ...s.draft, files: s.draft.files.map(f => f.id === id ? { ...f, ...p } : f) } } : null);
  const dropFile = (id: string) =>
    set(s => s.draft ? { draft: { ...s.draft, files: s.draft.files.filter(x => x.id !== id) } } : null);

  const flushUploads = () => {
    const t = timers.current;
    if (Object.keys(t.uploads).length || !t.done.length) return;
    const u = t.done; t.done = [];
    const cats = [...new Set(u.map(x => x.cat))];
    toast(u.length === 1 ? 'Uploaded ' + u[0].name + ' to ' + u[0].cat + '.' : 'Uploaded ' + u.length + ' files' + (cats.length === 1 ? ' to ' + cats[0] : '') + '.');
  };

  // Uploads are simulated with a progress timer; the file itself stays in the browser as an object URL.
  const startUpload = (rec: FileRec) => {
    let p = 0;
    timers.current.uploads[rec.id] = window.setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 12);
      if (p < 100) { updateFile(rec.id, { progress: Math.round(p) }); return; }
      clearInterval(timers.current.uploads[rec.id]);
      delete timers.current.uploads[rec.id];
      updateFile(rec.id, { status: 'done', progress: 100, fresh: true });
      window.setTimeout(() => updateFile(rec.id, { fresh: false }), 4000);
      timers.current.done.push({ name: rec.name, cat: CAT_BY_KEY[rec.cat].title });
      flushUploads();
    }, 240);
  };

  const addFiles = (catKey: FileCatKey, list: FileList | File[] | null) => {
    const cat = CAT_BY_KEY[catKey];
    const picked = Array.from(list || []);
    if (!picked.length) return;
    const taken = new Set((ref.current.draft?.files || []).filter(f => f.cat === catKey).map(f => f.name.toLowerCase()));
    const recs: FileRec[] = [];
    const errs: UploadError[] = [];
    for (const file of picked) {
      const ext = extOf(file.name);
      let msg = '';
      if (!cat.accept.includes(ext)) msg = cat.accept.length === 1 ? 'Only .' + cat.accept[0] + ' files can be added to ' + cat.title + '.' : 'Only .txt and .md files are supported.';
      else if (file.size > MAX_BYTES) msg = 'File is larger than 10 MB.';
      else if (taken.has(file.name.toLowerCase())) msg = 'A file with this name is already in ' + cat.title + '.';
      if (msg) { errs.push({ id: uid('ue'), name: file.name, msg }); continue; }
      taken.add(file.name.toLowerCase());
      const rec: FileRec = { id: uid('f'), name: file.name, size: file.size, ext, cat: catKey, status: 'uploading', progress: 0, by: me.name, at: Date.now(), url: URL.createObjectURL(file) };
      if (TEXT_EXT.includes(ext)) file.text().then(t => updateFile(rec.id, { content: t }));
      recs.push(rec);
    }
    set(s => ({
      draft: { ...(s.draft || emptyDraft()), files: [...recs, ...(s.draft?.files || [])] },
      uploadErrors: { ...s.uploadErrors, [catKey]: errs },
      collapsed: { ...s.collapsed, [catKey]: false },
      showAll: { ...s.showAll, [catKey]: false },
    }));
    recs.forEach(startUpload);
  };

  const cancelUpload = (id: string) => {
    clearInterval(timers.current.uploads[id]);
    delete timers.current.uploads[id];
    dropFile(id);
    flushUploads();
  };

  const confirmRemove = () => {
    const r = ref.current.removing;
    if (!r) return;
    dropFile(r.id);
    set({ removing: null });
    toast('Removed ' + r.name + ' from ' + CAT_BY_KEY[r.cat].title + '.', 'info');
  };

  const download = (f: FileRec) => {
    const a = document.createElement('a');
    a.href = f.url || URL.createObjectURL(new Blob([f.content || ''], { type: f.ext === 'md' ? 'text/markdown' : 'text/plain' }));
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---- file preview & in-place editing ----
  const openPreview = (f: FileRec, editable: boolean) => set({ preview: f, previewEditable: editable, editing: false, editText: '', discardAsk: null });
  /** The previewed file as it is now in the draft (it may have been edited since the preview opened). */
  const liveFile = (st = ref.current) => (st.preview && st.draft?.files.find(x => x.id === st.preview!.id)) || st.preview;
  const editDirty = (st = ref.current) => { const f = liveFile(st); return !!(st.editing && f && st.editText !== (f.content || '')); };
  const tryClosePreview = () => { if (editDirty()) set({ discardAsk: 'close' }); else set({ preview: null, editing: false, editText: '' }); };
  const cancelEditFile = () => { if (editDirty()) set({ discardAsk: 'cancel' }); else set({ editing: false, editText: '' }); };
  const confirmDiscard = () => set(st => ({ discardAsk: null, editing: false, editText: '', ...(st.discardAsk === 'close' ? { preview: null } : {}) }));
  const saveEditFile = () => {
    const f = liveFile();
    if (!f || !editDirty()) return;
    const text = ref.current.editText;
    const patch: Partial<FileRec> = { content: text, size: new Blob([text]).size, editedAt: Date.now(), editedBy: me.name, url: undefined };
    updateFile(f.id, patch);
    set({ preview: { ...f, ...patch }, editing: false, editText: '' });
    toast('Saved changes to ' + f.name + '.');
  };

  // ---- drafts, delete, categories ----
  const saveDraft = () => {
    const s = ref.current;
    const d = s.draft;
    if (!d) return;
    const id = s.draftId || 'd' + Date.now();
    const prev = s.entities.find(e => e.id === id);
    const rec: Entity = {
      ...(prev || {}), id, category: d.category, name: d.entity, source: d.source || '—', tables: d.tables,
      files: d.files.filter(x => x.status === 'done'), status: 'draft', step: s.step, updatedAt: Date.now(),
    };
    set(st => ({ entities: [rec, ...st.entities.filter(e => e.id !== id)] }));
    go('dashboard', {}, { noSave: true });
    toast('Saved ' + (rec.name || 'Untitled entity') + ' as a draft.');
  };

  const askDelete = () => {
    const s = ref.current;
    const id = s.screen === 'edit' ? s.editId : s.draftId;
    const e = s.entities.find(x => x.id === id);
    if (e) set({ deleting: { id: e.id, name: e.name || 'Untitled entity' } });
  };
  const confirmDelete = () => {
    const del = ref.current.deleting;
    if (!del) return;
    set(s => ({ entities: s.entities.filter(e => e.id !== del.id), notifications: s.notifications.filter(n => n.entityId !== del.id), deleting: null }));
    go('dashboard', { editDraft: null, editId: null, draft: null, draftId: null, step: 1 }, { noSave: true });
    toast('Deleted ' + del.name + '.');
  };

  /** "Create new category" from the Category dropdown: adds it to the list and selects it. */
  const createCat = () => {
    const nc = ref.current.newCat;
    if (!nc) return;
    const name = nc.text.trim().replace(/\s+/g, ' ');
    if (!name) { set({ newCat: { ...nc, error: 'Enter a category name.' } }); return; }
    const dup = ref.current.categories.find(c => c.toLowerCase() === name.toLowerCase());
    if (dup) { set({ newCat: { ...nc, error: 'A category named “' + dup + '” already exists.' } }); return; }
    set(s => ({ categories: [...s.categories, name], newCat: null }));
    patchForm(ref.current.screen === 'edit' ? { category: name } : { category: name, entity: '' });
    toast('Created category ' + name + '.');
  };

  /** From Review & submit: jump back to Prompts & evals with a category open and in view. */
  const goCat = (key: FileCatKey) => {
    set(s => ({ step: 2 as Step, collapsed: { ...s.collapsed, [key]: false } }));
    window.setTimeout(() => {
      const el = document.getElementById('cat-' + key);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 128, behavior: 'smooth' });
    }, 60);
  };

  // ---- submit / approve ----
  /** Approvers hear about submissions; a submitter hears when changes are requested. */
  const notify = (entity: Entity, verb: Verb, { to = 'approvers' as Notification['to'], kind = 'review' as Notification['kind'], comment = '' } = {}) => {
    const n: Notification = { id: uid('n'), entityId: entity.id, to, kind, comment, by: me.name, verb, entity: entity.name, category: entity.category, at: Date.now(), read: false };
    set(s => ({ notifications: [n, ...s.notifications.filter(x => !(x.entityId === entity.id && x.to === to))] }));
  };
  const readChangesNotifs = (id: string) => (s: State) => ({ notifications: s.notifications.map(n => n.entityId === id && n.kind === 'changes' ? { ...n, read: true } : n) });
  const submitterId = (e: Entity) => e.submittedById || Object.values(USERS).find(u => u.name === e.submittedBy)?.id;

  /** "Make changes": reopen a Changes requested entity in the wizard on Review & submit, with the feedback on top. */
  const startRevision = (e: Entity) => {
    go('wizard', {
      draft: JSON.parse(JSON.stringify(entityDraft(e))), draftId: null, step: 3,
      resubmitId: e.id, revBase: e.revBase || draftKey(entityDraft(e)),
      feedback: { comment: e.comment || '', by: e.commentBy || 'The reviewer', at: e.commentAt || e.updatedAt },
    });
  };

  const submit = () => {
    const d = ref.current.draft;
    if (!d) return;
    set({ submitting: true });
    const resubmitId = ref.current.resubmitId;
    if (resubmitId) {
      window.setTimeout(() => {
        const prev = ref.current.entities.find(e => e.id === resubmitId);
        if (!prev) { set({ submitting: false }); return; }
        const ent: Entity = {
          ...prev, category: d.category, name: d.entity, source: d.source, tables: d.tables, files: d.files.filter(x => x.status === 'done'),
          status: 'pending', verb: 'resubmitted', submittedBy: me.name, submittedById: me.id, submittedAt: Date.now(), updatedAt: Date.now(),
          lastFeedback: { comment: prev.comment || '', by: prev.commentBy || '', at: prev.commentAt || 0 }, comment: '', commentBy: '', revBase: '',
        };
        set(s => ({
          ...readChangesNotifs(resubmitId)(s),
          entities: s.entities.map(e => e.id === resubmitId ? ent : e),
          draft: null, draftId: null, step: 1 as Step, submitting: false, screen: 'success', resubmitId: null, feedback: null, revBase: '',
        }));
        notify(ent, 'resubmitted');
        window.scrollTo(0, 0);
      }, 900);
      return;
    }
    window.setTimeout(() => {
      const ent: Entity = {
        id: 'e' + Date.now(), category: d.category, name: d.entity, source: d.source, tables: d.tables,
        files: d.files.filter(x => x.status === 'done'), status: 'pending',
        submittedBy: me.name, submittedById: me.id, submittedAt: Date.now(), updatedAt: Date.now(), verb: 'submitted',
      };
      set(s => ({ entities: [ent, ...s.entities.filter(e => e.id !== s.draftId)], draft: null, draftId: null, step: 1 as Step, submitting: false, screen: 'success' }));
      notify(ent, 'submitted');
      window.scrollTo(0, 0);
    }, 900);
  };

  const saveEdit = () => {
    const s = ref.current;
    const d = s.editDraft;
    const orig = s.entities.find(e => e.id === s.editId);
    if (!d || !orig) return;
    const verb: Verb = orig.status === 'changes' ? 'resubmitted' : 'updated';
    const saved: Entity = {
      ...orig, category: d.category, name: d.entity, source: d.source, tables: d.tables, status: 'pending', comment: '', commentBy: '',
      submittedBy: me.name, submittedById: me.id, submittedAt: Date.now(), updatedAt: Date.now(), verb,
    };
    set(st => ({ ...readChangesNotifs(saved.id)(st), entities: st.entities.map(e => e.id === saved.id ? saved : e) }));
    notify(saved, verb);
    toast(verb === 'resubmitted' ? 'Resubmitted ' + saved.name + ' for review. Approvers have been notified.' : 'Changes to ' + saved.name + ' sent for approval.');
    go('dashboard', { editDraft: null, editId: null });
  };

  const decide = (approved: boolean, comment = '') => {
    const id = ref.current.reviewId;
    const ent = ref.current.entities.find(e => e.id === id);
    if (!ent) return;
    set(s => ({
      entities: s.entities.map(e => e.id !== id ? e : approved
        ? { ...e, status: 'published', comment: '', commentBy: '', approvedBy: me.name, approvedAt: Date.now(), updatedAt: Date.now() }
        : { ...e, status: 'changes', comment, commentBy: me.name, commentAt: Date.now(), revBase: draftKey(entityDraft(e)), updatedAt: Date.now() }),
      notifications: s.notifications.map(n => n.entityId === id && n.kind !== 'changes' ? { ...n, read: true } : n),
      changes: null, approving: false,
    }));
    const toId = submitterId(ent);
    if (!approved && toId) notify(ent, ent.verb || 'submitted', { to: toId, kind: 'changes', comment });
    go('dashboard', { reviewId: null });
    toast(approved ? ent.name + ' is approved and live in Sidekick.' : 'Changes requested on ' + ent.name + '. ' + (ent.submittedBy || 'The submitter') + ' has been notified.');
  };

  const approve = () => {
    set({ approving: true });
    window.setTimeout(() => decide(true), 700);
  };

  const openReview = (id: string) => {
    set(s => ({ notifications: s.notifications.map(n => n.entityId === id && n.kind !== 'changes' ? { ...n, read: true } : n) }));
    go('review', { reviewId: id });
  };

  /**
   * Dashboard "Edit" (and the submitter's "changes requested" notification): Changes requested opens
   * "Make changes", drafts reopen in the wizard on the step they were left on, others open Edit entity.
   */
  const editEntity = (e: Entity) => {
    set(readChangesNotifs(e.id));
    if (e.status === 'changes') startRevision(e);
    else if (e.status === 'draft') go('wizard', { draft: entityDraft(e), draftId: e.id, step: e.step || 1 });
    else {
      const ed = toEditDraft(e);
      go('edit', { editId: e.id, editDraft: ed, editOriginal: JSON.stringify(ed) });
    }
  };

  const startNew = () => go('wizard', {
    draft: emptyDraft(), draftId: null, step: 1,
    collapsed: {}, showAll: {}, sumExpanded: {}, uploadErrors: {},
  });

  // Close popovers on outside click, Escape closes the top-most layer, and "x min ago" stays fresh.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const s = ref.current;
      const pop = (e.target as Element).closest?.('[data-pop]') as HTMLElement | null;
      const kind = pop?.dataset.pop || '';
      if (s.fileMenu && kind !== 'filemenu') set({ fileMenu: null });
      if (!s.bellOpen && !s.userOpen) return;
      if (kind !== 'bell' && kind !== 'user') set({ bellOpen: false, userOpen: false });
      else if (kind === 'bell' && s.userOpen) set({ userOpen: false });
      else if (kind === 'user' && s.bellOpen) set({ bellOpen: false });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const s = ref.current;
      if (s.drawerOpen) { set({ drawerOpen: false }); return; }
      if (s.fileMenu) { set({ fileMenu: null }); return; }
      if (s.discardAsk) set({ discardAsk: null });
      else if (s.newCat) set({ newCat: null });
      else if (s.deleting) set({ deleting: null });
      else if (s.removing) set({ removing: null });
      else if (s.preview) tryClosePreview();
      else if (s.changes) set({ changes: null });
      else if (s.bellOpen || s.userOpen) set({ bellOpen: false, userOpen: false });
    };
    // The drawer is the < 1024px navigation; close it if the window grows past that.
    const onResize = () => { if (ref.current.drawerOpen && window.innerWidth >= 1024) set({ drawerOpen: false }); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const tick = window.setInterval(() => setNow(Date.now()), 30000);
    // Another tab saved changes: pick them up.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORE_KEY) return;
      const o = readStore();
      if (o) set(o);
    };
    window.addEventListener('storage', onStorage);
    const t = timers.current;
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('storage', onStorage);
      clearInterval(tick);
      clearTimeout(t.toast);
      Object.values(t.uploads).forEach(clearInterval);
    };
  }, []);

  useEffect(() => { writeStore(state); }, [state.entities, state.notifications, state.user, state.categories]);

  return {
    s: state, me, now, set, go, toast,
    patchForm, addTable, removeTable,
    addFiles, cancelUpload, confirmRemove, download, goCat,
    dismissError: (cat: FileCatKey, id: string) => set(s => ({ uploadErrors: { ...s.uploadErrors, [cat]: (s.uploadErrors[cat] || []).filter(x => x.id !== id) } })),
    submit, saveEdit, decide, approve, openReview, editEntity, startNew,
    openPreview, liveFile, editDirty, tryClosePreview, cancelEditFile, confirmDiscard, saveEditFile,
    saveDraft, askDelete, confirmDelete, createCat,
  };
}

export type Admin = ReturnType<typeof useAdminStore>;
const AdminContext = createContext<Admin | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  return <AdminContext.Provider value={useAdminStore()}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
