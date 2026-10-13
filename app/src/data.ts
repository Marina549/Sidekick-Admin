// Seed data, constants and pure helpers for Sidekick Admin.
// Everything lives in memory; there is no backend yet.

export type UserId = 'priya' | 'gary';
export interface User {
  id: UserId;
  name: string;
  first: string;
  initials: string;
  canApprove: boolean;
  role: string;
}

export interface Field { name: string; type?: string; desc: string }
export interface Table { name: string; fields: Field[] }

export type FileCatKey = 'prompts' | 'kb' | 'thresholds' | 'evals' | 'md';
export interface FileRec {
  id: string;
  name: string;
  size: number;
  ext: string;
  cat: FileCatKey;
  status: 'uploading' | 'done';
  progress?: number;
  by: string;
  at: number;
  url?: string;
  content?: string;
  fresh?: boolean;
  editedAt?: number;
  editedBy?: string;
}

export type EntityStatus = 'published' | 'pending' | 'changes' | 'draft';
export interface Entity {
  id: string;
  category: string;
  name: string;
  source: string;
  tables: Table[];
  files: FileRec[];
  status: EntityStatus;
  updatedAt: number;
  step?: Step;
  submittedBy?: string;
  submittedById?: UserId;
  submittedAt?: number;
  verb?: Verb;
  /** Reviewer's "Request changes" comment, while status is 'changes'. */
  comment?: string;
  commentBy?: string;
  commentAt?: number;
  /** draftKey() of the entity when changes were requested; resubmitting needs at least one change. */
  revBase?: string;
  /** The feedback a resubmission answered, shown to the approver. */
  lastFeedback?: { comment: string; by: string; at: number };
  approvedBy?: string;
  approvedAt?: number;
}

export type Step = 1 | 2 | 3;
export type Verb = 'submitted' | 'updated' | 'resubmitted';
export const VERB_LABEL: Record<Verb, string> = { submitted: 'Submitted', updated: 'Updated', resubmitted: 'Resubmitted' };

/** Working copy used by the New entity wizard. */
export interface Draft {
  category: string;
  entity: string;
  source: string;
  tables: Table[];
  files: FileRec[];
}

/** Working copy used by Edit entity. Files aren't editable there. */
export interface EditDraft {
  category: string;
  entity: string;
  source: string;
  tables: Table[];
  comment: string;
  commentBy: string;
}

export interface Notification {
  id: string;
  entityId: string;
  /** 'approvers' = everyone who can approve; otherwise one user (the submitter, for "changes"). */
  to: 'approvers' | UserId;
  kind: 'review' | 'changes';
  comment: string;
  by: string;
  verb: Verb;
  entity: string;
  category: string;
  at: number;
  read: boolean;
}

export const USERS: Record<UserId, User> = {
  priya: { id: 'priya', name: 'Priya Sethi', first: 'Priya', initials: 'PS', canApprove: false, role: 'Can submit' },
  gary: { id: 'gary', name: 'Gary Spark', first: 'Gary', initials: 'GS', canApprove: true, role: 'Can submit and approve' },
};

export const CATEGORIES = ['OTT', 'COE', 'Flash availability', 'OTH'];

export const ENTITY_OPTIONS: Record<string, string[]> = {
  'OTT': ['On-time tilling', 'Stage-by compliance', 'Tilling exceptions', 'Late order recovery'],
  'COE': ['Store COE score', 'Pick rate by store', 'Substitution acceptance'],
  'Flash availability': ['Flash item availability', 'Out-of-stock alerts'],
  'OTH': ['Handoff wait time', 'Curbside arrivals'],
};

export const SOURCES: Record<string, string[]> = {
  'Pulse': ['ott_orders', 'ott_oss_Entitys', 'coe-daily', 'fa-flash', 'oth_summary'],
  'Snowflake': ['order_events', 'store_daily_kpis'],
  'BigQuery': ['picking_sessions', 'substitutions'],
};

const TABLE_FIELDS: Record<string, [string, string, string][]> = {
  'ott_orders': [['order-id', 'varchar', 'Unique order identifier'], ['tilled_at', 'varchar', 'Timestamp the order was tilled'], ['on_time_flag', 'integer', '']],
  'ott_oss_Entitys': [['late_count', 'integer', 'Orders tilled after stage-by time'], ['missed_count', 'integer', 'Orders never tilled']],
  'coe-daily': [['store_id', 'varchar', 'Store number'], ['pick_rate', 'float', 'Items picked per labor hour'], ['coe_score', 'integer', '']],
  'fa-flash': [['item_id', 'varchar', 'Item UPC'], ['flash_available', 'integer', '1 when the item can be flashed to customers'], ['updated_at', 'varchar', '']],
  'oth_summary': [['store_id', 'varchar', 'Store number'], ['handoff_count', 'integer', 'Orders handed off to customers'], ['avg_wait_min', 'double', '']],
  'order_events': [['event_id', 'varchar', 'Unique event identifier'], ['order-id', 'varchar', 'Unique order identifier'], ['event_type', 'varchar', '']],
  'store_daily_kpis': [['store_id', 'varchar', 'Store number'], ['business_date', 'varchar', 'Calendar day the KPIs cover'], ['orders_per_hour', 'double', 'Orders completed per labor hour']],
  'picking_sessions': [['session_id', 'varchar', 'Unique picking session identifier'], ['picker_id', 'varchar', 'Associate who ran the session'], ['session_minutes', 'integer', '']],
  'substitutions': [['order-id', 'varchar', 'Unique order identifier'], ['item_id', 'varchar', 'Original item UPC'], ['sub_accepted', 'integer', '']],
};

/** Descriptions "Generate with AI" returns, and that seeded entities already have. */
export const AI_DESCRIPTIONS: Record<string, string> = {
  on_time_flag: '1 when tilled before stage-by time',
  coe_score: 'Composite center-of-excellence score for the store, 0–100',
  updated_at: 'Timestamp the flash status was last refreshed',
  avg_wait_min: 'Average customer wait at handoff, in minutes',
  event_type: 'Order lifecycle event, e.g. picked, staged, handed off',
  session_minutes: 'Minutes from first scan to last scan in the session',
  sub_accepted: '1 when the customer accepted the substitution',
};

export const fieldsFor = (table: string, fill: boolean): Field[] =>
  (TABLE_FIELDS[table] || []).map(([name, type, desc]) => ({ name, type, desc: desc || (fill ? AI_DESCRIPTIONS[name] || '' : '') }));

export const FIELD_TYPES = ['varchar', 'integer', 'float', 'double'];
// Earlier versions used friendlier type names; data saved in a browser may still have them.
const LEGACY_TYPES: Record<string, string> = { string: 'varchar', decimal: 'float', boolean: 'integer', date: 'varchar', timestamp: 'varchar' };
export const normType = (t?: string) => {
  const k = (t || '').toLowerCase();
  return FIELD_TYPES.includes(k) ? k : LEGACY_TYPES[k] || 'varchar';
};
/** Shown in the Entity dropdown before a category is picked. */
export const ALL_ENTITY_NAMES = Object.values(ENTITY_OPTIONS).flat();

export const ENTITY_DESC: Record<string, string> = {
  'On-time tilling': 'Tracks orders tilled before stage-by time',
  'Stage-by compliance': 'Tracks stage-by compliance by store',
  'Tilling exceptions': 'Monitors late and missed tilling',
  'Late order recovery': 'Follows late orders through recovery',
  'Store COE score': 'Overall store COE performance',
  'Pick rate by store': 'Items picked per labor hour, by store',
  'Substitution acceptance': 'How often customers accept substitutions',
  'Flash item availability': 'Which items can be flashed to customers',
  'Out-of-stock alerts': 'Items flagged out of stock during picking',
  'Handoff wait time': 'Customer wait time at handoff',
  'Curbside arrivals': 'Customer arrivals for curbside pickup',
};

export const STATUS: Record<EntityStatus, { label: string; bg: string; border: string; fg: string }> = {
  published: { label: 'Active', bg: '#EAF5F0', border: '#97D0B9', fg: '#04633C' },
  pending: { label: 'Pending review', bg: '#FDF3D9', border: '#F8B775', fg: '#906700' },
  changes: { label: 'Changes requested', bg: '#FDECEC', border: '#F0A3A3', fg: '#B00000' },
  draft: { label: 'Draft', bg: '#F1F0EE', border: '#C2C1C0', fg: '#4B4B49' },
};

export const ACCEPT = ['txt', 'md'];
/** Files that can be previewed and edited as text. */
export const TEXT_EXT = ['txt', 'md'];
export const MAX_BYTES = 10 * 1024 * 1024;

export interface FileCat { key: FileCatKey; title: string; desc: string; accept: string[] }
export const FILE_CATS: FileCat[] = [
  { key: 'prompts', title: 'Prompt Templates', desc: 'Prompts Sidekick can run for this entity.', accept: ACCEPT },
  { key: 'kb', title: 'KB Articles', desc: 'Reference articles that give Sidekick background.', accept: ACCEPT },
  { key: 'thresholds', title: 'Thresholds', desc: 'Target values and limits used to judge results.', accept: ACCEPT },
  { key: 'evals', title: 'Evals', desc: 'Questions and expected answers used to test Sidekick.', accept: ACCEPT },
  { key: 'md', title: 'MD Files', desc: 'Markdown files with extra instructions and context.', accept: ['md'] },
];
export const CAT_BY_KEY = Object.fromEntries(FILE_CATS.map(c => [c.key, c])) as Record<FileCatKey, FileCat>;

export const STEP_LABELS = ['Data & schema', 'Prompts & evals', 'Review & submit'];

// ---- helpers ----

export const uid = (prefix: string) => prefix + Math.random().toString(36).slice(2);
export const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();
export const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const fmtDateTime = (ts: number) => fmtDate(ts) + ', ' + new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const plural = (n: number, word: string, many = word + 's') => n + ' ' + (n === 1 ? word : many);
export const fieldCount = (tables: Table[]) => tables.reduce((a, t) => a + t.fields.length, 0);
export const sizeText = (b: number) => b >= 1024 * 1024 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
export const ago = (ts: number, now = Date.now()) => {
  const m = Math.floor((now - ts) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return m + ' min ago';
  const h = Math.floor(m / 60);
  return h + (h === 1 ? ' hour ago' : ' hours ago');
};
/** Snapshot of a draft's saveable content, used to tell whether it changed since it was opened. */
export const draftKey = (d: Draft | null) => d
  ? JSON.stringify([d.category, d.entity, d.source, d.tables, d.files.filter(x => x.status === 'done').map(x => [x.id, x.content || '', x.cat])])
  : '';
export const emptyDraft = (): Draft => ({ category: '', entity: '', source: '', tables: [], files: [] });
export const cloneTables = (tables: Table[]): Table[] => tables.map(t => ({ ...t, fields: t.fields.map(f => ({ ...f })) }));
/** An entity as a wizard draft (the shape draftKey() compares). */
export const entityDraft = (e: Entity): Draft => ({
  category: e.category, entity: e.name, source: e.source === '—' ? '' : e.source, tables: e.tables, files: e.files || [],
});
export const toEditDraft = (e: Entity): EditDraft => ({
  category: e.category, entity: e.name, source: e.source, tables: cloneTables(e.tables),
  comment: e.comment || '', commentBy: e.commentBy || '',
});

/** What's still missing before the Data & schema step is complete; '' when done. */
export function step1Missing(f: { category: string; entity: string; source: string; tables: Table[] }) {
  if (!f.category || !f.entity || !f.source) return 'Select a category, entity and source to continue.';
  if (!f.tables.length) return 'Add at least one table to continue.';
  if (f.tables.some(t => t.fields.some(x => !(x.desc || '').trim()))) return 'Add a description for every field to continue.';
  if (!fieldCount(f.tables)) return 'Add at least one field to continue.';
  return '';
}

/** What's still missing before the Prompts & evals step is complete; '' when done. */
export function step2Missing(f: { files: FileRec[] }) {
  if (f.files.some(x => x.status === 'uploading')) return 'Hang on, still uploading…';
  if (!f.files.some(x => x.status === 'done')) return 'Upload at least one file to continue.';
  return '';
}

// ---- seed ----

const md = (title: string, lines: string[]) => '# ' + title + '\n\n' + lines.join('\n');
const D = (s: string) => Date.parse(s + 'T10:00:00');

const seedFile = (name: string, kb: number, content: string): FileRec => ({
  id: uid('f'), name, size: kb * 1024, ext: extOf(name), cat: name.includes('eval') ? 'evals' : 'prompts',
  by: 'Priya Sethi', at: Date.parse('2026-09-05T10:00:00'), status: 'done', content,
});

const SEED_UPDATED: Record<string, string> = { e1: '2026-09-10', e2: '2026-08-28', e3: '2026-09-12', e4: '2026-09-02', e5: '2026-09-18', e6: '2026-08-21' };
const seed = (id: string, category: string, name: string, source: string, tables: string[], files: FileRec[]): Entity => ({
  id, category, name, source, files, status: 'published', approvedBy: 'Gary Spark',
  tables: tables.map(t => ({ name: t, fields: fieldsFor(t, true) })),
  updatedAt: Date.parse(SEED_UPDATED[id] + 'T12:00:00'),
});

let sfN = 0;
const sf = (cat: FileCatKey, name: string, kb: number, by: string, date: string, lines: string[]): FileRec => {
  const ext = extOf(name);
  const title = name.slice(0, name.lastIndexOf('.')).split('_').join(' ');
  return {
    id: 'sf' + (++sfN), name, size: Math.round(kb * 1024), ext, cat, status: 'done', by, at: D(date),
    content: ext === 'txt' ? title + '\n\n' + lines.join('\n') : md(title, lines),
  };
};

const LATE_ORDER_FILES: FileRec[] = [
  sf('prompts', 'late_order_recovery_prompts.md', 24, 'Priya Sethi', '2026-09-29', ['- Which stores recovered the most late orders last week?', '- How many late orders at store 1234 were recovered yesterday?']),
  sf('prompts', 'recovery_followup_prompts.txt', 14, 'Priya Sethi', '2026-09-29', ['- What should a store do when an order is running late?', '- Which late orders still need a follow-up call?']),
  sf('prompts', 'store_manager_prompt_templates.md', 31, 'Gary Spark', '2026-09-24', ['- Show late order recovery for my store this week.', '- Compare my store with the district on recovered orders.']),
  sf('kb', 'late_order_playbook.md', 48, 'Gary Spark', '2026-09-22', ['A late order is any order handed off after its promised window.', 'Stores should contact the customer before the window closes.']),
  sf('kb', 'recovery_sla_overview.txt', 22, 'Priya Sethi', '2026-09-22', ['Overview of how recovered orders are counted for each store.']),
  sf('evals', 'late_order_recovery_evals.md', 18, 'Priya Sethi', '2026-10-01', ['1. Answer cites the ott_orders table.', '2. Recovery rate is reported as a percentage with one decimal.']),
  sf('evals', 'recovery_golden_answers.txt', 16, 'Priya Sethi', '2026-10-01', ['Expected answers for the recovery prompts, one per question.']),
  sf('evals', 'edge_case_evals.md', 9, 'Marcus Lee', '2026-10-02', ['1. Store with zero late orders returns 0 and says so.', '2. Closed stores are excluded from the answer.']),
  sf('evals', 'store_level_evals_q3.md', 27, 'Gary Spark', '2026-09-30', ['Store-level checks for Q3.']),
  sf('evals', 'recovery_sla_checks.md', 12, 'Priya Sethi', '2026-09-29', ['1. Answer names the store and the business date.']),
  sf('evals', 'negative_cases.md', 7, 'Priya Sethi', '2026-09-26', ['1. Questions about other banners are declined.']),
  sf('evals', 'regression_suite_v1.txt', 19, 'Gary Spark', '2026-09-24', ['Regression checks carried over from the first release.']),
  sf('md', 'sidekick_context.md', 6, 'Gary Spark', '2026-09-30', ['Answer late order questions with the store number and the business date.']),
];

export const SEED_ENTITIES: Entity[] = [
  seed('e1', 'OTT', 'Stage-by compliance', 'Pulse', ['ott_orders'], [
    seedFile('stage_by_prompts.md', 26, md('Stage-by compliance prompts', ['- How many orders missed stage-by at store 1234 yesterday?', '- Which stores had the lowest stage-by compliance this week?'])),
    seedFile('stage_by_evals.md', 18, md('Stage-by compliance evals', ['1. Answer cites the ott_orders table.', '2. Compliance is reported as a percentage with one decimal.'])),
  ]),
  seed('e2', 'OTT', 'Tilling exceptions', 'Pulse', ['ott_oss_Entitys'], [seedFile('tilling_exceptions_prompts.md', 12, md('Tilling exceptions prompts', ['- How many orders were never tilled last Sunday?']))]),
  seed('e3', 'COE', 'Store COE score', 'Pulse', ['coe-daily'], [seedFile('coe_score_evals.md', 22, md('Store COE score evals', ['1. Score is between 0 and 100.', '2. Answer names the store and the date.']))]),
  seed('e4', 'COE', 'Pick rate by store', 'Snowflake', ['store_daily_kpis'], [seedFile('pick_rate_prompts.md', 9, md('Pick rate prompts', ['- What was the pick rate at store 0456 last week?']))]),
  seed('e5', 'Flash availability', 'Flash item availability', 'Pulse', ['fa-flash'], [seedFile('flash_prompts.md', 14, md('Flash availability prompts', ['- Which items can be flashed at store 2210 right now?']))]),
  seed('e6', 'OTH', 'Handoff wait time', 'Pulse', ['oth_summary'], [seedFile('handoff_evals.md', 17, md('Handoff wait time evals', ['1. Wait time is reported in minutes.', '2. Answer compares against the 5-minute target.']))]),
  {
    id: 'd1', category: 'OTT', name: 'Late order recovery', source: 'Pulse', status: 'draft', step: 2, updatedAt: D('2026-10-05'),
    tables: ['ott_orders', 'ott_oss_Entitys'].map(t => ({ name: t, fields: fieldsFor(t, true) })),
    files: LATE_ORDER_FILES,
  },
];
