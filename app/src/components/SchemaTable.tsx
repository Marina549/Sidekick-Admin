import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AI_DESCRIPTIONS, FIELD_TYPES, cloneTables, normType, type Table } from '../data';
import { ImgIcon } from './Icon';
import { Button } from './pds';
import { Select } from './Select';
import { asset } from '../asset';

export type SchemaChange =
  | { type: 'add'; table: string; field: string }
  | { type: 'edit' }
  | { type: 'delete'; field: string; prev: Table[] };

interface Props {
  tables: Table[];
  editable?: boolean;
  onChange?: (tables: Table[], info: SchemaChange) => void;
  emptyTitle?: string;
  emptyText?: string;
}

const typeOptions = FIELD_TYPES.map(t => ({ label: t, value: t }));
const humanize = (n: string) => { const s = n.replace(/[_-]+/g, ' ').trim(); return s.charAt(0).toUpperCase() + s.slice(1); };

/**
 * Field / Description table used on the Data & schema step, Edit entity, both review screens and
 * expanded dashboard rows. Editable mode adds inline description editing, "Generate with AI",
 * "Add field" and delete.
 */
export function SchemaTable({ tables, editable = false, onChange, emptyTitle = 'No tables mapped yet', emptyText = '' }: Props) {
  // f === -1 means "adding a new field to table t"
  const [edit, setEdit] = useState<{ t: number; f: number } | null>(null);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('varchar');
  const [nameError, setNameError] = useState('');
  const [generating, setGenerating] = useState(false);
  const genTimer = useRef(0);
  useEffect(() => () => clearTimeout(genTimer.current), []);

  const cancel = () => { clearTimeout(genTimer.current); setEdit(null); setText(''); setName(''); setType('varchar'); setGenerating(false); setNameError(''); };
  const start = (t: number, f: number, initial = '') => { cancel(); setEdit({ t, f }); setText(initial); setType(normType(tables[t].fields[f].type)); };

  const save = () => {
    if (!edit || !text.trim()) return;
    const next = cloneTables(tables);
    if (edit.f === -1) {
      const n = name.trim();
      if (!n) { setNameError('Give the field a name.'); return; }
      if (next[edit.t].fields.some(x => x.name === n)) { setNameError('That field already exists in this table.'); return; }
      next[edit.t].fields.push({ name: n, type, desc: text.trim() });
      onChange?.(next, { type: 'add', table: next[edit.t].name, field: n });
    } else {
      next[edit.t].fields[edit.f].desc = text.trim();
      next[edit.t].fields[edit.f].type = type;
      onChange?.(next, { type: 'edit' });
    }
    cancel();
  };

  const generate = () => {
    if (!edit) return;
    const n = edit.f === -1 ? name.trim() : tables[edit.t].fields[edit.f].name;
    if (!n) return;
    setGenerating(true);
    genTimer.current = window.setTimeout(() => { setGenerating(false); setText(AI_DESCRIPTIONS[n] || humanize(n) + ' for this entity'); }, 1200);
  };

  const del = (t: number, f: number) => {
    const prev = cloneTables(tables);
    const next = cloneTables(tables);
    const removed = next[t].fields.splice(f, 1)[0];
    if (edit && edit.t === t) cancel();
    onChange?.(next, { type: 'delete', field: removed.name, prev });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  };

  const editorActions = (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="outlined" size="small" className="text-m-sb" onClick={cancel}>Cancel</Button>
      <Button variant="filled" size="small" className="text-m-sb" disabled={generating || !text.trim()} onClick={save}>Save</Button>
    </div>
  );

  return (
    <div role="table" aria-label="Schema annotation" className="sk-schema" data-r="st-root">
      <div role="row" className="sk-schema__row sk-schema__head" data-r="st-hrow">
        <span role="columnheader">Field</span>
        <span role="columnheader">Data Type</span>
        <span role="columnheader">Description</span>
        <span />
      </div>
      {tables.length === 0 && (
        <div className="sk-schema__empty">
          <img src={asset('assets/ill-no-tables.png')} alt="" width={104} height={80} style={{ display: 'block', objectFit: 'contain' }} />
          <span className="sk-schema__empty-title">{emptyTitle}</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{emptyText}</span>
        </div>
      )}
      {tables.map((t, ti) => {
        const adding = editable && edit?.t === ti && edit.f === -1;
        return (
          <div key={t.name} role="rowgroup" aria-label={t.name} style={{ borderTop: ti > 0 ? '1px solid #E5E4E3' : 'none', marginTop: ti > 0 ? 8 : 0 }}>
            <div role="row" className="sk-schema__table-name">
              <span role="cell">{t.name}</span>
            </div>
            {t.fields.map((f, fi) => {
              const editing = editable && edit?.t === ti && edit.f === fi;
              const hasDesc = !!f.desc?.trim();
              if (editing) {
                return (
                  <div key={f.name} role="row" className="sk-schema__editor" data-r="st-edit">
                    <span role="cell" className="sk-schema__name" style={{ paddingTop: 8 }}>{f.name}</span>
                    <div role="cell" style={{ minWidth: 0 }}>
                      <Select size="small" value={type} options={typeOptions} onChange={setType} ariaLabel={'Data type for ' + f.name} />
                    </div>
                    <div role="cell" className="sk-schema__editor-cell">
                      <div className="sk-schema__editor-line">
                        <input type="text" className="sk-schema__input" aria-label={'Description for ' + f.name} value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey} autoFocus disabled={generating} placeholder="Add description" />
                        {editorActions}
                      </div>
                      <Button variant="outlined" size="small" className="text-m-sb" disabled={generating} onClick={generate} style={{ width: 'auto' }}>{generating ? 'Generating…' : 'Generate with AI'}</Button>
                    </div>
                  </div>
                );
              }
              if (editable && !hasDesc) {
                return (
                  <div key={f.name} role="row" className="sk-schema__row" data-r="st-row">
                    <span role="cell" className="sk-schema__name" data-r="st-name">{f.name}</span>
                    <span role="cell" className="sk-schema__type" data-r="st-type">{normType(f.type)}</span>
                    <div role="cell" data-r="st-desc" style={{ paddingRight: 16 }}>
                      <button type="button" className="sk-schema__add-desc" onClick={() => start(ti, fi, f.desc)} aria-label={'Add description for ' + f.name}>Add description</button>
                    </div>
                    <div className="sk-schema__actions" data-r="st-act">
                      <button type="button" className="sk-icon-btn sk-icon-btn--navy" aria-label={'Delete field ' + f.name} onClick={() => del(ti, fi)}><ImgIcon src="c/trash_outlined_16-navy.svg" size={16} /></button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={f.name} role="row" className="sk-schema__row" data-r="st-row">
                  <span role="cell" className="sk-schema__name" data-r="st-name">{f.name}</span>
                  <span role="cell" className="sk-schema__type" data-r="st-type">{normType(f.type)}</span>
                  <span role="cell" data-r="st-desc" style={{ paddingRight: 16 }}>{f.desc}</span>
                  <div className="sk-schema__actions" data-r="st-act">
                    {editable && (
                      <>
                        <button type="button" className="sk-icon-btn sk-icon-btn--navy" aria-label={'Edit ' + f.name} onClick={() => start(ti, fi, f.desc)}><ImgIcon src="c/edit_outlined_16-navy.svg" size={16} /></button>
                        <button type="button" className="sk-icon-btn sk-icon-btn--navy" aria-label={'Delete field ' + f.name} onClick={() => del(ti, fi)}><ImgIcon src="c/trash_outlined_16-navy.svg" size={16} /></button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {adding && (
              <div role="row" className="sk-schema__editor" data-r="st-edit">
                <div role="cell" style={{ minWidth: 0 }}>
                  <input type="text" className="sk-schema__input" style={{ width: '100%', maxWidth: 'none', minWidth: 0 }} aria-label="New field name" value={name} onChange={e => { setName(e.target.value); setNameError(''); }} onKeyDown={onKey} autoFocus placeholder="Field name" />
                  {nameError && <span style={{ display: 'block', fontSize: 12, lineHeight: '16px', color: '#B00000', paddingTop: 8 }}>{nameError}</span>}
                </div>
                <div role="cell" style={{ minWidth: 0 }}>
                  <Select size="small" value={type} options={typeOptions} onChange={setType} ariaLabel="New field data type" />
                </div>
                <div role="cell" className="sk-schema__editor-cell">
                  <div className="sk-schema__editor-line">
                    <input type="text" className="sk-schema__input" aria-label="New field description" value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey} disabled={generating} placeholder="Add description" />
                    {editorActions}
                  </div>
                  <Button variant="outlined" size="small" className="text-m-sb" disabled={generating || !name.trim()} onClick={generate} style={{ width: 'auto' }}>{generating ? 'Generating…' : 'Generate with AI'}</Button>
                </div>
              </div>
            )}
            {editable && (
              <div className="sk-schema__add-row">
                <button type="button" className="sk-link" onClick={() => { cancel(); setEdit({ t: ti, f: -1 }); }} aria-label={'Add field to ' + t.name}>
                  <ImgIcon src="c/plus_outlined_24-blue.svg" size={16} />
                  <span>Add field</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
