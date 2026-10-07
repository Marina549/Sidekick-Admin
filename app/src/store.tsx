// App state and actions. Mirrors the behaviour of the design prototype: everything is in memory
// and resets on reload.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CAT_BY_KEY, SEED_ENTITIES, SOURCES, USERS, emptyDraft, extOf, fieldsFor, toEditDraft, uid, MAX_BYTES,
  type Draft, type EditDraft, type Entity, type FileCatKey, type FileRec, type Notification, type Step, type UserId,
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
  // new entity wizard
  draft: Draft | null;
  draftId: string | null;
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
  // chrome
  bellOpen: boolean;
  userOpen: boolean;
  toast: { message: string; tone: ToastTone; actions: ToastAction[] } | null;
}

const initialState: State = {
  user: 'priya', screen: 'home', navOpen: false,
  entities: SEED_ENTITIES, notifications: [],
  search: '', fCat: '', fStatus: '', fSrc: '', expanded: {},
  draft: null, draftId: null, step: 1, submitting: false,
  editId: null, editDraft: null, editOriginal: '',
  reviewId: null, approving: false, changes: null,
  collapsed: {}, showAll: {}, sumExpanded: {}, uploadErrors: {}, removing: null, preview: null,
  bellOpen: false, userOpen: false, toast: null,
};

type Patch = Partial<State> | ((s: State) => Partial<State> | null);

function useAdminStore() {
  const [state, setState] = useState(initialState);
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

  /** Navigate. Leaving the wizard keeps the work as a Draft row once a category and entity are picked. */
  const go = (screen: Screen, extra: Partial<State> = {}) => {
    const s = ref.current;
    const d = s.draft;
    const leavingWizard = s.screen === 'wizard' && screen !== 'wizard';
    let saved: Entity | null = null;
    if (leavingWizard && d && d.category && d.entity) {
      saved = {
        id: s.draftId || 'd' + Date.now(), category: d.category, name: d.entity, source: d.source || '—',
        tables: d.tables, files: d.files.filter(x => x.status === 'done'), status: 'draft', step: s.step, updatedAt: Date.now(),
      };
    }
    set(st => ({
      screen, bellOpen: false, userOpen: false,
      ...(leavingWizard ? { draft: null, draftId: null, step: 1 as Step } : {}),
      ...(saved ? { entities: [saved, ...st.entities.filter(e => e.id !== saved!.id)] } : {}),
      ...extra,
    }));
    if (saved) toast('Draft saved to Entities.', 'info');
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
      if (!cat.accept.includes(ext)) msg = cat.accept.length === 1 ? 'Only .' + cat.accept[0] + ' files can be added to ' + cat.title + '.' : 'Unsupported file type. Use ' + cat.accept.map(e => '.' + e).join(', ') + '.';
      else if (file.size > MAX_BYTES) msg = 'File is larger than 10 MB.';
      else if (taken.has(file.name.toLowerCase())) msg = 'A file with this name is already in ' + cat.title + '.';
      if (msg) { errs.push({ id: uid('ue'), name: file.name, msg }); continue; }
      taken.add(file.name.toLowerCase());
      const rec: FileRec = { id: uid('f'), name: file.name, size: file.size, ext, cat: catKey, status: 'uploading', progress: 0, by: me.name, at: Date.now(), url: URL.createObjectURL(file) };
      if (ext === 'md') file.text().then(t => updateFile(rec.id, { content: t }));
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
    a.href = f.url || URL.createObjectURL(new Blob([f.content || ''], { type: 'text/markdown' }));
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
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
  const notify = (entity: Entity, verb: 'submitted' | 'updated') => {
    const n: Notification = { id: 'n' + Date.now(), entityId: entity.id, by: me.name, verb, entity: entity.name, category: entity.category, at: Date.now(), read: false };
    set(s => ({ notifications: [n, ...s.notifications.filter(x => x.entityId !== entity.id)] }));
  };

  const submit = () => {
    const d = ref.current.draft;
    if (!d) return;
    set({ submitting: true });
    window.setTimeout(() => {
      const ent: Entity = {
        id: 'e' + Date.now(), category: d.category, name: d.entity, source: d.source, tables: d.tables,
        files: d.files.filter(x => x.status === 'done'), status: 'pending',
        submittedBy: me.name, submittedAt: Date.now(), updatedAt: Date.now(), verb: 'submitted',
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
    const saved: Entity = {
      ...orig, name: d.entity, source: d.source, tables: d.tables, status: 'pending', comment: '', commentBy: '',
      submittedBy: me.name, submittedAt: Date.now(), updatedAt: Date.now(), verb: 'updated',
    };
    set(st => ({ entities: st.entities.map(e => e.id === saved.id ? saved : e) }));
    notify(saved, 'updated');
    toast('Changes to ' + saved.name + ' sent for approval.');
    go('dashboard', { editDraft: null, editId: null });
  };

  const decide = (approved: boolean, comment = '') => {
    const id = ref.current.reviewId;
    const ent = ref.current.entities.find(e => e.id === id);
    if (!ent) return;
    set(s => ({
      entities: s.entities.map(e => e.id !== id ? e : approved
        ? { ...e, status: 'published', comment: '', commentBy: '', updatedAt: Date.now() }
        : { ...e, status: 'changes', comment, commentBy: me.name, updatedAt: Date.now() }),
      notifications: s.notifications.map(n => n.entityId === id ? { ...n, read: true } : n),
      changes: null, approving: false,
    }));
    go('dashboard', { reviewId: null });
    toast(approved ? ent.name + ' is approved and live in Sidekick.' : 'Changes requested on ' + ent.name + '.');
  };

  const approve = () => {
    set({ approving: true });
    window.setTimeout(() => decide(true), 700);
  };

  const openReview = (id: string) => {
    set(s => ({ notifications: s.notifications.map(n => n.entityId === id ? { ...n, read: true } : n) }));
    go('review', { reviewId: id });
  };

  /** Dashboard "Edit": drafts reopen in the wizard on the step they were left on. */
  const editEntity = (e: Entity) => {
    if (e.status === 'draft') {
      go('wizard', {
        draft: { category: e.category, entity: e.name, source: e.source === '—' ? '' : e.source, tables: e.tables, files: e.files || [] },
        draftId: e.id, step: e.step || 1,
      });
    } else {
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
      if (!s.bellOpen && !s.userOpen) return;
      const pop = (e.target as Element).closest?.('[data-pop]') as HTMLElement | null;
      if (!pop) set({ bellOpen: false, userOpen: false });
      else if (pop.dataset.pop === 'bell' && s.userOpen) set({ userOpen: false });
      else if (pop.dataset.pop === 'user' && s.bellOpen) set({ bellOpen: false });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const s = ref.current;
      if (s.removing) set({ removing: null });
      else if (s.preview) set({ preview: null });
      else if (s.changes) set({ changes: null });
      else if (s.bellOpen || s.userOpen) set({ bellOpen: false, userOpen: false });
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    const tick = window.setInterval(() => setNow(Date.now()), 30000);
    const t = timers.current;
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      clearInterval(tick);
      clearTimeout(t.toast);
      Object.values(t.uploads).forEach(clearInterval);
    };
  }, []);

  return {
    s: state, me, now, set, go, toast,
    patchForm, addTable, removeTable,
    addFiles, cancelUpload, confirmRemove, download, goCat,
    dismissError: (cat: FileCatKey, id: string) => set(s => ({ uploadErrors: { ...s.uploadErrors, [cat]: (s.uploadErrors[cat] || []).filter(x => x.id !== id) } })),
    submit, saveEdit, decide, approve, openReview, editEntity, startNew,
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
