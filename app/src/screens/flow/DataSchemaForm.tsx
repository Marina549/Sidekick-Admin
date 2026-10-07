import { useState } from 'react';
import { ImgIcon } from '../../components/Icon';
import { SchemaTable } from '../../components/SchemaTable';
import { Select } from '../../components/Select';
import { CATEGORIES, ENTITY_OPTIONS, SOURCES, emptyDraft } from '../../data';
import { useAdmin } from '../../store';

const CATEGORY_OPTS = CATEGORIES.map(c => ({ label: c, value: c }));
const SOURCE_OPTS = Object.keys(SOURCES).map(c => ({ label: c, value: c }));

/** Data & schema step of the wizard; also the whole Edit entity form. */
export function DataSchemaForm() {
  const { s, set, toast, patchForm, addTable, removeTable } = useAdmin();
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const isEdit = s.screen === 'edit';
  const f = (isEdit ? s.editDraft : s.draft) || emptyDraft();
  const review = isEdit ? s.editDraft : null;

  // Each entity can only be added once; the one being edited/drafted stays selectable.
  const selfId = isEdit ? s.editId : s.draftId;
  const taken = s.entities.filter(e => e.id !== selfId).map(e => e.name);
  const entityOpts = (ENTITY_OPTIONS[f.category] || []).map(n => ({ label: n, value: n, disabled: taken.includes(n), meta: taken.includes(n) ? 'Already added' : '' }));
  const srcTables = SOURCES[f.source] || [];
  const added = f.tables.map(t => t.name);

  return (
    <div className="sk-panel" style={{ gap: 32 }}>
      <h2 className="sk-h2">Data &amp; schema</h2>
      {review?.comment && (
        <div role="note" className="sk-note sk-note--error">
          <ImgIcon src="c/info_outlined_24-red.svg" size={24} />
          <span><strong>{review.commentBy} requested changes:</strong> {review.comment}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 560px', display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 32px' }}>
            <div className="sk-field">
              <label htmlFor="sel-category" className="sk-label">Category</label>
              <Select id="sel-category" value={f.category} placeholder="Select Category" options={CATEGORY_OPTS} disabled={isEdit} ariaLabel="Category"
                onChange={v => { if (v !== f.category) patchForm({ category: v, entity: '' }); }} />
            </div>
            <div className="sk-field">
              <label htmlFor="sel-entity" className="sk-label">Entity</label>
              <Select id="sel-entity" value={f.entity} placeholder="Select entity" options={entityOpts} disabled={!f.category} ariaLabel="Entity"
                onChange={v => patchForm({ entity: v })} />
            </div>
            <div className="sk-field">
              <label htmlFor="sel-source" className="sk-label">Data source</label>
              <Select id="sel-source" value={f.source} placeholder="Select data source" options={SOURCE_OPTS} ariaLabel="Data source"
                onChange={v => { if (v !== f.source) patchForm({ source: v, tables: [] }); }} />
            </div>
          </div>

          <div className="sk-field">
            <span id="tables-label" className="sk-label">Tables</span>
            <div
              role="list"
              aria-labelledby="tables-label"
              className="sk-dropzone"
              style={{ background: dragOver ? '#EBF3F9' : '#FAF9F8', justifyContent: f.tables.length ? 'flex-start' : 'center' }}
              onDragOver={e => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setDragging(null); addTable(e.dataTransfer.getData('text/plain')); }}
            >
              {f.tables.map(t => (
                <div key={t.name} role="listitem" className="sk-chip">
                  <ImgIcon src="c/drag_handle_outlined_24-grey.svg" size={16} />
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, lineHeight: '24px', color: '#1F1E1E' }}>{t.name}</span>
                  <button type="button" className="sk-icon-btn" onClick={() => removeTable(t.name)} aria-label={'Remove ' + t.name}>
                    <ImgIcon src="c/close_outlined_24-grey.svg" size={16} />
                  </button>
                </div>
              ))}
              <span style={{ fontSize: 12, lineHeight: '16px', color: '#6E6E6D', padding: f.tables.length ? '0 16px' : 0 }}>Drag tables from the panel on the right</span>
            </div>
          </div>

          <div className="sk-field">
            <span className="sk-label">Schema annotation</span>
            <SchemaTable
              tables={f.tables}
              editable
              emptyTitle="No tables mapped yet"
              emptyText="Description will auto populate as you select a table"
              onChange={(tables, info) => {
                patchForm({ tables });
                if (info.type === 'delete') {
                  toast('Removed ' + info.field + '.', 'info', [{ label: 'Undo', onClick: () => { patchForm({ tables: info.prev }); set({ toast: null }); } }]);
                }
              }}
            />
          </div>
        </div>

        <aside aria-label="Data sources" className="sk-sources">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#262524' }}>Data sources</span>
            {!f.source && <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>No data sources selected</span>}
          </div>
          {f.source && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#6E6E6D' }}>{f.source}</span>
              <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {srcTables.map(name => {
                  const isAdded = added.includes(name);
                  const isDragging = dragging === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="listitem"
                      className="sk-source-table"
                      draggable={!isAdded}
                      onDragStart={e => { e.dataTransfer.setData('text/plain', name); e.dataTransfer.effectAllowed = 'copy'; setDragging(name); }}
                      onDragEnd={() => { setDragging(null); setDragOver(false); }}
                      onClick={() => { if (!isAdded) addTable(name); }}
                      aria-disabled={isAdded || undefined}
                      aria-label={isAdded ? name + ', already added' : 'Add ' + name + ' to tables'}
                      style={{
                        border: isDragging ? '1px solid #004488' : '1px solid transparent',
                        boxShadow: isDragging ? 'inset 4px 0 0 #004488' : 'none',
                        cursor: isAdded ? 'default' : 'grab',
                        opacity: isAdded ? 0.5 : 1,
                      }}
                    >
                      <ImgIcon src="c/drag_handle_outlined_24-grey.svg" size={16} />
                      <span style={{ flex: 1, textAlign: 'left', fontSize: 14, lineHeight: '24px', color: '#1F1E1E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
