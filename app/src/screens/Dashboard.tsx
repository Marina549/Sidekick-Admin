import type { MouseEvent } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImgIcon } from '../components/Icon';
import { Button } from '../components/pds';
import { SchemaTable } from '../components/SchemaTable';
import { Select } from '../components/Select';
import { ENTITY_DESC, SOURCES, STATUS, STEP_LABELS, fieldCount, fmtDate, type Entity, type EntityStatus } from '../data';
import { useAdmin } from '../store';
import { asset } from '../asset';

const STATUS_FILTERS = [{ label: 'All statuses', value: '' }, ...(Object.keys(STATUS) as EntityStatus[]).map(k => ({ label: STATUS[k].label, value: k }))];
const SOURCE_FILTERS = [{ label: 'All sources', value: '' }, ...Object.keys(SOURCES).map(c => ({ label: c, value: c }))];

function matches(e: Entity, q: string) {
  if (!q) return true;
  const hay = [e.name, ENTITY_DESC[e.name] || '', e.category, e.source, ...e.tables.map(t => t.name), ...e.tables.flatMap(t => t.fields.map(x => x.name + ' ' + x.desc))].join(' ').toLowerCase();
  return hay.includes(q);
}

export function Dashboard() {
  const { s, set, startNew } = useAdmin();
  const q = s.search.trim().toLowerCase();
  const filtered = s.entities.filter(e =>
    (!s.fCat || e.category === s.fCat) && (!s.fStatus || e.status === s.fStatus) && (!s.fSrc || e.source === s.fSrc) && matches(e, q));
  // Drafts saved before a category was picked go under "Uncategorized".
  const groupCats = [...s.categories, ...(s.entities.some(e => !e.category) ? [''] : [])];
  const groups = groupCats.map(c => ({ name: c || 'Uncategorized', list: filtered.filter(e => (e.category || '') === c) })).filter(g => g.list.length);
  const categoryFilters = [{ label: 'All categories', value: '' }, ...s.categories.map(c => ({ label: c, value: c }))];

  return (
    <section data-screen-label="Entity dashboard" className="sk-dash" data-r="page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Breadcrumbs />
        <div className="sk-title-row">
          <h1 className="sk-h1">Entity dashboard</h1>
          <img src={asset('assets/ill-entity-dashboard-v3.png')} data-r="page-ill" alt="" width={104} height={76} style={{ display: 'block', width: 121, height: 77, objectFit: 'contain' }} />
        </div>
      </div>

      <div className="sk-dash__card" data-r="card">
        <div className="sk-dash__head" data-r="ent-head">
          <h2 className="sk-dash__title">Entities</h2>
          <div style={{ display: 'flex', width: 240, flexShrink: 0 }}>
            <Button variant="filled" size="large" className="text-l-sb" onClick={startNew}>Add new entity</Button>
          </div>
        </div>

        {s.entities.length === 0 ? (
          <div role="status" className="sk-dash__none">
            <img src={asset('assets/ill-no-tables.png')} alt="" width={104} height={80} style={{ display: 'block', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 20, lineHeight: '30px', color: '#6E6E6D' }}>No entities yet</span>
            <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49', textWrap: 'pretty' }}>Entities you create will show up here.</span>
          </div>
        ) : groups.length > 0 ? (
          <>
            <div role="search" className="sk-dash__filters" data-r="filters">
              <input type="search" aria-label="Search entities" className="sk-text-input" style={{ width: '100%' }} value={s.search} onChange={e => set({ search: e.target.value })} placeholder="Search entities by name or description" />
              <Select size="small" value={s.fCat} options={categoryFilters} onChange={v => set({ fCat: v })} ariaLabel="Filter by category" style={{ width: 160, flexShrink: 0 }} />
              <Select size="small" value={s.fStatus} options={STATUS_FILTERS} onChange={v => set({ fStatus: v })} ariaLabel="Filter by status" style={{ width: 176, flexShrink: 0 }} />
              <Select size="small" value={s.fSrc} options={SOURCE_FILTERS} onChange={v => set({ fSrc: v })} ariaLabel="Filter by source" style={{ width: 144, flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {groups.map(g => (
                <section key={g.name} aria-label={g.name} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 className="sk-dash__group">{g.name}</h3>
                  <div role="table" aria-label={g.name + ' entities'} className="sk-etable">
                    <div role="row" className="sk-etable__grid sk-etable__head" data-r="ent-hrow">
                      <span role="columnheader">Entity</span>
                      <span role="columnheader">Source</span>
                      <span role="columnheader" data-r="col-tables">Tables</span>
                      <span role="columnheader" data-r="col-fields">Fields</span>
                      <span role="columnheader">Status</span>
                      <span role="columnheader">Last updated</span>
                      <span role="columnheader" className="sk-visually-hidden">Actions</span>
                    </div>
                    {g.list.map((e, i) => <EntityRow key={e.id} entity={e} first={i === 0} />)}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div role="status" className="sk-dash__empty">
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: '30px', color: '#262524' }}>No entities match that search</span>
            <span style={{ fontSize: 16, lineHeight: '24px', color: '#4B4B49' }}>Try another name or description, or clear your filters.</span>
            <button type="button" className="sk-link" style={{ fontSize: 16, textDecoration: 'underline' }} onClick={() => set({ search: '', fCat: '', fStatus: '', fSrc: '' })}>Clear search and filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

function EntityRow({ entity: e, first }: { entity: Entity; first: boolean }) {
  const { s, me, set, editEntity, openReview } = useAdmin();
  const open = !!s.expanded[e.id];
  const st = STATUS[e.status];
  const desc = ENTITY_DESC[e.name];
  // Approvers review a pending submission instead of editing it.
  const reviewable = e.status === 'pending' && me.canApprove;
  const stop = (fn: () => void) => (ev: MouseEvent) => { ev.stopPropagation(); fn(); };
  const toggle = stop(() => set(x => ({ expanded: { ...x.expanded, [e.id]: !x.expanded[e.id] } })));
  const isDraft = e.status === 'draft';
  const name = e.name || 'Untitled entity';
  const approved = e.status === 'published' && e.approvedBy ? 'Approved by ' + e.approvedBy + (e.approvedAt ? ' on ' + fmtDate(e.approvedAt) : '') : '';

  return (
    <div role="rowgroup" style={{ borderTop: first ? 'none' : '1px solid #F1F0EE' }}>
      <div role="row" data-r="ent-row" className={'sk-etable__grid sk-etable__row' + (open ? ' is-open' : '')} onClick={toggle}>
        <div role="cell" data-r="c-name" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <button type="button" className="sk-etable__name" onClick={toggle} aria-expanded={open} aria-label={name + (open ? ', collapse details' : ', expand details')}>{name}</button>
          {desc && <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{desc}</span>}
          {isDraft && (
            <span style={{ fontSize: 12, lineHeight: '16px', color: '#6E6E6D' }}>Step {e.step || 1} of 3 · {STEP_LABELS[(e.step || 1) - 1]}</span>
          )}
        </div>
        <span role="cell" data-r="c-src" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{e.source}</span>
        <span role="cell" data-r="col-tables">{e.tables.length}</span>
        <span role="cell" data-r="col-fields">{fieldCount(e.tables)}</span>
        <div role="cell" data-r="c-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 0 }}>
          <span className="sk-tag" style={{ background: st.bg, border: '1px solid ' + st.border, color: st.fg }}>{st.label}</span>
        </div>
        <span role="cell" data-r="c-upd" style={{ minWidth: 0 }}>{fmtDate(e.updatedAt)}</span>
        <div role="cell" data-r="c-act" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          {reviewable ? (
            <button type="button" className="sk-link" style={{ padding: '8px 0' }} onClick={stop(() => openReview(e.id))} aria-label={'Review ' + name}>
              <span>Review</span>
            </button>
          ) : (
            <button type="button" className="sk-link" style={{ padding: '8px 0' }} onClick={stop(() => editEntity(e))} aria-label={(isDraft ? 'Continue editing ' : 'Edit ') + name}>
              <ImgIcon src="c/edit_outlined_16-blue.svg" size={16} />
              <span>Edit</span>
            </button>
          )}
          <button type="button" className="sk-icon-btn" onClick={toggle} aria-expanded={open} aria-label={(open ? 'Collapse ' : 'Expand ') + name}>
            <ImgIcon src="c/chevron_down_outlined_24-dark.svg" size={24} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
          </button>
        </div>
      </div>
      {open && (
        <div className="sk-etable__details" data-r="ent-detail">
          {e.status === 'changes' && e.comment && (
            <div role="note" className="sk-note sk-note--error" style={{ marginBottom: 8 }}>
              <span><strong>{e.commentBy} requested changes:</strong> {e.comment}</span>
            </div>
          )}
          {approved && <span style={{ paddingBottom: 8, fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{approved}</span>}
          <h4 className="sk-etable__details-title">Schema annotation</h4>
          {e.tables.length > 0
            ? <SchemaTable tables={e.tables} />
            : <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>No tables mapped yet. Edit the draft to add them.</span>}
        </div>
      )}
    </div>
  );
}
