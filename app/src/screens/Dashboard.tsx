import type { MouseEvent } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImgIcon } from '../components/Icon';
import { Button } from '../components/pds';
import { SchemaTable } from '../components/SchemaTable';
import { Select } from '../components/Select';
import { CATEGORIES, ENTITY_DESC, SOURCES, STATUS, fieldCount, fmtDate, type Entity, type EntityStatus } from '../data';
import { useAdmin } from '../store';

const STATUS_FILTERS = [{ label: 'All statuses', value: '' }, ...(Object.keys(STATUS) as EntityStatus[]).map(k => ({ label: STATUS[k].label, value: k }))];
const CATEGORY_FILTERS = [{ label: 'All categories', value: '' }, ...CATEGORIES.map(c => ({ label: c, value: c }))];
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
  const groups = CATEGORIES.map(c => ({ name: c, list: filtered.filter(e => e.category === c) })).filter(g => g.list.length);

  return (
    <section data-screen-label="Entity dashboard" className="sk-dash">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Breadcrumbs />
        <div className="sk-title-row">
          <h1 className="sk-h1">Entity dashboard</h1>
          <img src="/assets/ill-entity-dashboard.png" alt="" width={144} height={76} className="sk-title-ill" />
        </div>
      </div>

      <div className="sk-dash__card">
        <div className="sk-dash__head">
          <h2 className="sk-dash__title">Entities</h2>
          <div style={{ display: 'flex', width: 240, flexShrink: 0 }}>
            <Button variant="filled" size="large" className="text-l-sb" onClick={startNew}>Add new entity</Button>
          </div>
        </div>

        {groups.length > 0 ? (
          <>
            <div role="search" className="sk-dash__filters">
              <label style={{ flex: 1, minWidth: 0 }}>
                <span className="sk-visually-hidden">Search entities</span>
                <input type="search" className="sk-text-input" style={{ width: '100%' }} value={s.search} onChange={e => set({ search: e.target.value })} placeholder="Search entities by name or description" />
              </label>
              <Select size="small" value={s.fCat} options={CATEGORY_FILTERS} onChange={v => set({ fCat: v })} ariaLabel="Filter by category" style={{ width: 160, flexShrink: 0 }} />
              <Select size="small" value={s.fStatus} options={STATUS_FILTERS} onChange={v => set({ fStatus: v })} ariaLabel="Filter by status" style={{ width: 176, flexShrink: 0 }} />
              <Select size="small" value={s.fSrc} options={SOURCE_FILTERS} onChange={v => set({ fSrc: v })} ariaLabel="Filter by source" style={{ width: 144, flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {groups.map(g => (
                <section key={g.name} aria-label={g.name} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 className="sk-dash__group">{g.name}</h3>
                  <div role="table" aria-label={g.name + ' entities'} className="sk-etable">
                    <div role="row" className="sk-etable__grid sk-etable__head">
                      <span role="columnheader">Entity</span>
                      <span role="columnheader">Source</span>
                      <span role="columnheader">Tables</span>
                      <span role="columnheader">Fields</span>
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
  // Approvers can open a pending submission straight from its tag.
  const reviewable = e.status === 'pending' && me.canApprove;
  const stop = (fn: () => void) => (ev: MouseEvent) => { ev.stopPropagation(); fn(); };
  const toggle = stop(() => set(x => ({ expanded: { ...x.expanded, [e.id]: !x.expanded[e.id] } })));

  return (
    <div role="rowgroup" style={{ borderTop: first ? 'none' : '1px solid #F1F0EE' }}>
      <div role="row" className={'sk-etable__grid sk-etable__row' + (open ? ' is-open' : '')} onClick={toggle}>
        <div role="cell" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <button type="button" className="sk-etable__name" onClick={toggle} aria-expanded={open} aria-label={e.name + (open ? ', collapse details' : ', expand details')}>{e.name}</button>
          {desc && <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{desc}</span>}
        </div>
        <span role="cell" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{e.source}</span>
        <span role="cell">{e.tables.length}</span>
        <span role="cell">{fieldCount(e.tables)}</span>
        <div role="cell" style={{ display: 'flex', minWidth: 0 }}>
          {reviewable ? (
            <button type="button" className="sk-tag" title="Review submission" aria-label={'Pending approval — review ' + e.name} onClick={stop(() => openReview(e.id))} style={{ background: st.bg, border: '1px solid ' + st.border, color: st.fg }}>{st.label}</button>
          ) : (
            <span className="sk-tag" style={{ background: st.bg, border: '1px solid ' + st.border, color: st.fg }}>{st.label}</span>
          )}
        </div>
        <span role="cell" style={{ minWidth: 0 }}>{fmtDate(e.updatedAt)}</span>
        <div role="cell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="sk-link" style={{ padding: '8px 0' }} onClick={stop(() => editEntity(e))} aria-label={'Edit ' + e.name}>
            <ImgIcon src="c/edit_outlined_16-blue.svg" size={16} />
            <span>Edit</span>
          </button>
          <button type="button" className="sk-icon-btn" onClick={toggle} aria-expanded={open} aria-label={(open ? 'Collapse ' : 'Expand ') + e.name}>
            <ImgIcon src="c/chevron_down_outlined_24-dark.svg" size={24} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
          </button>
        </div>
      </div>
      {open && (
        <div className="sk-etable__details">
          {e.status === 'changes' && e.comment && (
            <div role="note" className="sk-note sk-note--error" style={{ marginBottom: 8 }}>
              <span><strong>{e.commentBy} requested changes:</strong> {e.comment}</span>
            </div>
          )}
          <h4 className="sk-etable__details-title">Schema annotation</h4>
          {e.tables.length > 0
            ? <SchemaTable tables={e.tables} />
            : <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>No tables mapped yet. Edit the draft to add them.</span>}
        </div>
      )}
    </div>
  );
}
