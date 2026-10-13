import { useRef, useState, type DragEvent } from 'react';
import { MaskIcon } from '../../components/Icon';
import { Button, ProgressBar } from '../../components/pds';
import { FILE_CATS, fmtDate, fmtDateTime, plural, sizeText, type FileCat, type FileCatKey, type FileRec } from '../../data';
import { useAdmin } from '../../store';

const VISIBLE_FILES = 5;
const byNewest = (a: FileRec, b: FileRec) => (b.at || 0) - (a.at || 0);
const byText = (f: FileRec) => f.editedAt ? 'Edited by ' + f.editedBy : 'Uploaded by ' + (f.by || '—');

/** Prompts & evals step: five collapsible categories, each with its own drop zone and file list. */
export function PromptsEvals() {
  const { s, addFiles } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const pickFor = useRef<FileCatKey>('prompts');
  const files = s.draft?.files || [];

  const nDone = files.filter(f => f.status === 'done').length;
  const nUploading = files.filter(f => f.status === 'uploading').length;
  const nCovered = FILE_CATS.filter(c => files.some(f => f.cat === c.key && f.status === 'done')).length;
  const status = nDone
    ? plural(nDone, 'file') + ' in ' + nCovered + ' of ' + FILE_CATS.length + ' categories' + (nUploading ? ' · uploading ' + nUploading : '')
    : nUploading ? 'Uploading…' : '';

  const browse = (cat: FileCat) => {
    pickFor.current = cat.key;
    const el = input.current;
    if (el) { el.accept = cat.accept.map(e => '.' + e).join(','); el.click(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px 32px', flexWrap: 'wrap' }}>
        <h2 className="sk-h2">Prompts &amp; evals</h2>
        <span role="status" style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{status}</span>
      </div>
      <input
        ref={input}
        type="file"
        multiple
        aria-label="Upload files"
        tabIndex={-1}
        style={{ display: 'none' }}
        onChange={e => { addFiles(pickFor.current, e.target.files); e.target.value = ''; }}
      />
      {FILE_CATS.map(c => (
        <CategorySection key={c.key} cat={c} files={files.filter(f => f.cat === c.key).sort(byNewest)} onBrowse={() => browse(c)} />
      ))}
    </div>
  );
}

function CategorySection({ cat, files, onBrowse }: { cat: FileCat; files: FileRec[]; onBrowse: () => void }) {
  const { s, set, addFiles, dismissError } = useAdmin();
  const [dragOver, setDragOver] = useState(false);
  const open = !s.collapsed[cat.key];
  const showAll = !!s.showAll[cat.key];
  const has = files.length > 0;
  const nDone = files.filter(f => f.status === 'done').length;
  const shown = showAll ? files : files.slice(0, VISIBLE_FILES);
  const hidden = files.length - shown.length;
  const errors = s.uploadErrors[cat.key] || [];
  const ids = { head: 'cat-head-' + cat.key, body: 'cat-body-' + cat.key };
  // Touch screens can't drag files in, so the zone just invites an upload.
  const touch = window.matchMedia?.('(hover: none)').matches;
  const zoneTitle = dragOver ? 'Drop to upload to ' + cat.title
    : touch ? (has ? 'Add more files' : 'Upload files')
    : has ? 'Drag and drop more files here' : 'Drag and drop files here';

  // Dragging files over a collapsed category opens it.
  const onDragOver = (e: DragEvent) => {
    if (!Array.from(e.dataTransfer.types || []).includes('Files')) return;
    e.preventDefault();
    if (!dragOver) setDragOver(true);
    if (!open) set(x => ({ collapsed: { ...x.collapsed, [cat.key]: false } }));
  };

  return (
    <section
      id={'cat-' + cat.key}
      aria-labelledby={ids.head}
      style={{ scrollMarginTop: 120 }}
      onDragOver={onDragOver}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
      onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(cat.key, e.dataTransfer.files); }}
    >
      <h3 style={{ margin: '0 0 16px' }}>
        <button
          id={ids.head}
          type="button"
          className="sk-cat__toggle"
          onClick={() => set(x => ({ collapsed: { ...x.collapsed, [cat.key]: !x.collapsed[cat.key] } }))}
          aria-expanded={open}
          aria-controls={ids.body}
        >
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#262524' }}>{cat.title}</span>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{cat.desc}</span>
          </span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49', whiteSpace: 'nowrap' }}>{nDone ? plural(nDone, 'file') : 'No files'}</span>
          <MaskIcon name="chevronDown" size={24} style={{ color: '#4B4B49', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
        </button>
      </h3>
      {open && (
        <div id={ids.body} className="sk-cat__body" data-r="cat-body">
          {has && (
            <>
              <div role="table" aria-label={cat.title + ' files'} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div role="row" className="sk-files__grid sk-files__head" data-r="file-hrow">
                  <span role="columnheader">File name</span>
                  <span role="columnheader">Size</span>
                  <span role="columnheader">Last updated</span>
                  <span role="columnheader" className="sk-visually-hidden">Actions</span>
                </div>
                {shown.map(f => <FileRow key={f.id} file={f} />)}
              </div>
              {files.length > VISIBLE_FILES && (
                <button type="button" className="sk-link" style={{ alignSelf: 'flex-start', padding: '4px 0', lineHeight: '20px' }} onClick={() => set(x => ({ showAll: { ...x.showAll, [cat.key]: !x.showAll[cat.key] } }))}>
                  {showAll ? 'Show fewer files' : 'Show ' + plural(hidden, 'more file', 'more files')}
                </button>
              )}
            </>
          )}
          <div className="sk-upload" style={{ padding: has ? '16px 24px' : 24, background: dragOver ? '#EBF3F9' : '#FFFFFF' }}>
            {!has && (
              <span aria-hidden="true" className="sk-upload__icon"><MaskIcon name="upload" size={24} /></span>
            )}
            <span style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#1F1E1E' }}>
                {zoneTitle}
              </span>
              <span style={{ fontSize: 12, lineHeight: '16px', color: '#6E6E6D' }}>
                {(cat.accept.length === 1 ? '.' + cat.accept[0] + ' files only' : '.txt or .md files') + ' · up to 10 MB each'}
              </span>
            </span>
            <div data-r="zone-btn" style={{ display: 'flex', width: 128, flexShrink: 0 }}>
              <Button variant="outlined" size="small" className="text-s-sb" aria-label={'Browse files for ' + cat.title} onClick={onBrowse}>Browse files</Button>
            </div>
          </div>
          {errors.length > 0 && (
            <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {errors.map(er => (
                <div key={er.id} className="sk-upload-error">
                  <MaskIcon name="info" size={16} style={{ marginTop: 2 }} />
                  <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}><strong>{er.name}</strong> couldn’t be uploaded. {er.msg}</span>
                  <button type="button" className="sk-upload-error__dismiss" onClick={() => dismissError(cat.key, er.id)} aria-label={'Dismiss error for ' + er.name} title="Dismiss">
                    <MaskIcon name="close" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function FileRow({ file: f }: { file: FileRec }) {
  const { s, set, download, cancelUpload, openPreview } = useAdmin();
  const done = f.status === 'done';
  const fresh = done && !!f.fresh;
  const menuOpen = s.fileMenu === f.id;
  const remove = () => set({ fileMenu: null, removing: { id: f.id, name: f.name, cat: f.cat } });
  return (
    <div role="row" data-r="file-row" className="sk-files__grid sk-files__row" style={{ background: fresh ? '#FAF9F8' : undefined }}>
      <div role="cell" data-r="fc-name" style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <MaskIcon name="file" size={24} style={{ color: '#6E6E6D' }} />
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span title={f.name} className="sk-files__name">{f.name}</span>
          {fresh && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, lineHeight: '16px', color: '#4B4B49' }}>
              <MaskIcon name="check" size={12} />
              Uploaded
            </span>
          )}
        </span>
      </div>
      {done ? (
        <>
          <div role="cell" data-r="fc-size" style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49', whiteSpace: 'nowrap' }}>{sizeText(f.size)}</div>
          <div role="cell" data-r="fc-date" style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, lineHeight: '20px', color: '#1F1E1E', whiteSpace: 'nowrap' }}>{f.editedAt ? fmtDateTime(f.editedAt) : fmtDate(f.at)}</span>
            <span title={byText(f)} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, lineHeight: '16px', color: '#6E6E6D' }}>{byText(f)}</span>
          </div>
        </>
      ) : (
        <div role="cell" data-r="fc-prog" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}><ProgressBar value={f.progress || 0} size="small" aria-label={'Uploading ' + f.name} /></div>
          <span style={{ width: 40, textAlign: 'right', fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{(f.progress || 0) + '%'}</span>
        </div>
      )}
      <div role="cell" data-r="fc-act" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
        {done ? (
          <>
            <div data-r="file-icons" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button type="button" className="sk-icon-btn" onClick={() => openPreview(f, true)} aria-label={'Preview ' + f.name} title="Preview"><MaskIcon name="eye" size={20} /></button>
              <button type="button" className="sk-icon-btn" onClick={() => download(f)} aria-label={'Download ' + f.name} title="Download"><MaskIcon name="download" size={20} /></button>
              <button type="button" className="sk-icon-btn" onClick={remove} aria-label={'Remove ' + f.name} title="Remove"><MaskIcon name="trash" size={20} /></button>
            </div>
            {/* Phones get one "⋯" menu instead of three icons. */}
            <div data-r="file-more" data-pop="filemenu" style={{ position: 'relative' }}>
              <button type="button" className="sk-more-btn" onClick={() => set(st => ({ fileMenu: st.fileMenu === f.id ? null : f.id }))} aria-label={'More actions for ' + f.name} aria-haspopup="menu" aria-expanded={menuOpen}>
                <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
              </button>
              {menuOpen && (
                <div role="menu" aria-label={'More actions for ' + f.name} className="sk-more-menu">
                  <button type="button" role="menuitem" onClick={() => { set({ fileMenu: null }); openPreview(f, true); }}>Preview</button>
                  <button type="button" role="menuitem" onClick={() => { set({ fileMenu: null }); download(f); }}>Download</button>
                  <button type="button" role="menuitem" onClick={remove}>Remove</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button type="button" className="sk-icon-btn sk-icon-btn--neutral" onClick={() => cancelUpload(f.id)} aria-label={'Cancel upload of ' + f.name} title="Cancel upload"><MaskIcon name="close" size={20} /></button>
        )}
      </div>
    </div>
  );
}

