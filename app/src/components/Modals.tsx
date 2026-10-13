import type { CSSProperties, ReactNode } from 'react';
import { CAT_BY_KEY, TEXT_EXT, fmtDate, fmtDateTime, sizeText } from '../data';
import { useAdmin } from '../store';
import { ImgIcon } from './Icon';
import { Button, Modal, ModalClose } from './pds';

// Dialog padding: 32px above the title (the PDS header adds space-50) and 48px below the buttons.
const LARGE: CSSProperties = { paddingTop: 'calc(32px - var(--pds-global-space-50))', paddingBottom: 48 };
const MEDIUM: CSSProperties = { ...LARGE, paddingLeft: 8, paddingRight: 8 };

export function Modals() {
  const { s } = useAdmin();
  return (
    <>
      {s.preview && <PreviewModal />}
      {s.removing && <RemoveFileModal />}
      {s.changes && <RequestChangesModal />}
      {s.discardAsk && <DiscardModal />}
      {s.deleting && <DeleteEntityModal />}
      {s.newCat && <NewCategoryModal />}
    </>
  );
}

/** Medium modal with a title, close X and a body. */
function SimpleModal({ label, title, onClose, children, zIndex }: { label: string; title: string; onClose: () => void; children: ReactNode; zIndex?: number }) {
  return (
    <Modal size="medium" aria-label={label} style={MEDIUM} zIndex={zIndex}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sk-modal-head">
          <h3 className="sk-modal-title">{title}</h3>
          <ModalClose onClick={onClose} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
      </div>
    </Modal>
  );
}

const Actions = ({ children }: { children: ReactNode }) => <div className="sk-modal-actions" data-r="modal-actions">{children}</div>;
const Slot = ({ min, children }: { min: number; children: ReactNode }) => <div style={{ display: 'flex', minWidth: min }}>{children}</div>;

function PreviewModal() {
  const { s, set, download, liveFile, editDirty, tryClosePreview, cancelEditFile, saveEditFile } = useAdmin();
  const f = liveFile()!;
  const ext = f.ext || (f.name.split('.').pop() || '').toLowerCase();
  const isText = TEXT_EXT.includes(ext);
  const isPdf = ext === 'pdf' && !!f.url;
  const editing = s.editing;
  const text = editing || isPdf ? '' : f.content != null ? (f.content || ' ') : isText ? 'Loading preview…' : '';
  const none = !editing && !isPdf && f.content == null && !isText ? `Preview isn't available for .${ext} files. Download the file to view it.` : '';
  // Text files opened from the wizard can be edited in place.
  const canEdit = s.previewEditable && !editing && isText && f.content != null;
  const meta = CAT_BY_KEY[f.cat].title + ' · ' + sizeText(f.size) + ' · '
    + (f.editedAt ? 'Last edited ' + fmtDateTime(f.editedAt) + ' by ' + f.editedBy : 'Uploaded ' + fmtDate(f.at) + ' by ' + (f.by || '—'));

  return (
    <Modal size="large" aria-label={f.name} style={LARGE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="sk-modal-head">
          <h3 className="sk-modal-title">{f.name}</h3>
          <ModalClose onClick={tryClosePreview} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: -8, minHeight: 24, flexWrap: 'wrap' }}>
          <p style={{ margin: 0, flex: '1 1 320px', minWidth: 0, fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>{meta}</p>
          {canEdit && (
            <button type="button" className="sk-link" onClick={() => set({ editing: true, editText: f.content || '' })} aria-label={'Edit ' + f.name}>
              <ImgIcon src="c/edit_outlined_24-blue.svg" size={20} />
              <span>Edit</span>
            </button>
          )}
          {editing && <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#004488' }}>Editing</span>}
        </div>
        {isPdf && <iframe data-r="modal-scroll" src={f.url} title={f.name} style={{ width: '100%', height: 480, border: '1px solid #E5E4E3', borderRadius: 8 }} />}
        {editing && (
          <textarea
            data-r="modal-scroll"
            className="sk-file-editor"
            value={s.editText}
            onChange={e => set({ editText: e.target.value })}
            autoFocus
            aria-label={'Contents of ' + f.name}
            spellCheck={false}
          />
        )}
        {text && (
          <pre data-r="modal-scroll" style={{ margin: 0, maxHeight: 480, overflow: 'auto', padding: 24, background: '#FAF9F8', borderRadius: 8, fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, lineHeight: '24px', color: '#1F1E1E', whiteSpace: 'pre-wrap' }}>{text}</pre>
        )}
        {none && <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#4B4B49' }}>{none}</p>}
        {editing ? (
          <Actions>
            <Slot min={120}><Button variant="outlined" size="medium" className="text-m-sb" onClick={cancelEditFile}>Cancel</Button></Slot>
            <Slot min={160}><Button variant="filled" size="medium" className="text-m-sb" disabled={!editDirty()} onClick={saveEditFile}>Save changes</Button></Slot>
          </Actions>
        ) : (
          <Actions>
            <Slot min={144}><Button variant="outlined" size="medium" className="text-m-sb" onClick={() => download(f)}>Download</Button></Slot>
            <Slot min={120}><Button variant="filled" size="medium" className="text-m-sb" onClick={tryClosePreview}>Close</Button></Slot>
          </Actions>
        )}
      </div>
    </Modal>
  );
}

function DiscardModal() {
  const { s, set, confirmDiscard } = useAdmin();
  const keep = () => set({ discardAsk: null });
  return (
    <SimpleModal label="Discard unsaved changes" title="Discard unsaved changes?" onClose={keep} zIndex={95}>
      <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#1F1E1E', overflowWrap: 'anywhere' }}>
        Your edits to <strong>{s.preview?.name}</strong> haven’t been saved. If you leave now, they’ll be lost.
      </p>
      <Actions>
        <Slot min={144}><Button variant="outlined" size="medium" className="text-m-sb" onClick={keep}>Keep editing</Button></Slot>
        <Slot min={176}><Button variant="filled" size="medium" className="text-m-sb" onClick={confirmDiscard}>Discard changes</Button></Slot>
      </Actions>
    </SimpleModal>
  );
}

function DeleteEntityModal() {
  const { s, set, confirmDelete } = useAdmin();
  const cancel = () => set({ deleting: null });
  return (
    <SimpleModal label="Delete entity" title="Delete entity?" onClose={cancel}>
      <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#1F1E1E', overflowWrap: 'anywhere' }}>
        <strong>{s.deleting?.name}</strong> will be permanently deleted from the Entity dashboard, along with its schema and files.
      </p>
      <Actions>
        <Slot min={120}><Button variant="outlined" size="medium" className="text-m-sb" onClick={cancel}>Cancel</Button></Slot>
        <Slot min={160}><Button variant="filled" size="medium" className="text-m-sb" onClick={confirmDelete}>Delete entity</Button></Slot>
      </Actions>
    </SimpleModal>
  );
}

function NewCategoryModal() {
  const { s, set, createCat } = useAdmin();
  const nc = s.newCat!;
  const close = () => set({ newCat: null });
  return (
    <SimpleModal label="Create new category" title="Create new category" onClose={close}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="new-cat-name" className="sk-label">Category name</label>
        <input
          id="new-cat-name"
          type="text"
          value={nc.text}
          onChange={e => set({ newCat: { text: e.target.value, error: '' } })}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); createCat(); } }}
          autoFocus
          maxLength={40}
          aria-invalid={!!nc.error || undefined}
          aria-describedby="new-cat-help"
          placeholder="e.g. Fulfillment speed"
          style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 10, border: nc.error ? '1.5px solid #B00000' : '1px solid #7D7C7C', fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, lineHeight: '24px', color: '#1F1E1E', outline: 'none' }}
        />
        <span id="new-cat-help" style={{ fontSize: 12, lineHeight: '16px', color: nc.error ? '#B00000' : '#6E6E6D' }}>
          {nc.error || 'It will be selected for this entity and added to the Category list.'}
        </span>
      </div>
      <Actions>
        <Slot min={120}><Button variant="outlined" size="medium" className="text-m-sb" onClick={close}>Cancel</Button></Slot>
        <Slot min={176}><Button variant="filled" size="medium" className="text-m-sb" onClick={createCat}>Create category</Button></Slot>
      </Actions>
    </SimpleModal>
  );
}

function RemoveFileModal() {
  const { s, set, confirmRemove } = useAdmin();
  const r = s.removing!;
  const cancel = () => set({ removing: null });
  return (
    <SimpleModal label="Remove file" title="Remove this file?" onClose={cancel}>
      <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#1F1E1E', overflowWrap: 'anywhere' }}>
        <strong>{r.name}</strong> will be permanently removed from <strong>{CAT_BY_KEY[r.cat].title}</strong>. This can’t be undone.
      </p>
      <Actions>
        <Slot min={120}><Button variant="outlined" size="medium" className="text-m-sb" onClick={cancel}>Cancel</Button></Slot>
        <Slot min={144}><Button variant="filled" size="medium" className="text-m-sb" onClick={confirmRemove}>Remove file</Button></Slot>
      </Actions>
    </SimpleModal>
  );
}

function RequestChangesModal() {
  const { s, set, decide } = useAdmin();
  const ch = s.changes!;
  const ent = s.entities.find(e => e.id === s.reviewId);
  const close = () => set({ changes: null });
  const send = () => {
    const t = ch.text.trim();
    if (!t) { set({ changes: { text: ch.text, error: true } }); return; }
    decide(false, t);
  };

  return (
    <SimpleModal label="Request changes" title="Request changes" onClose={close}>
      <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#1F1E1E' }}>
        Tell {(ent?.submittedBy || '').split(' ')[0]} what to fix in <strong>{ent?.name}</strong>. It stays unpublished until it's resubmitted and approved.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="changes-comment" className="sk-label">Comment</label>
        <textarea
          id="changes-comment"
          value={ch.text}
          onChange={e => set({ changes: { text: e.target.value, error: false } })}
          autoFocus
          rows={4}
          aria-invalid={ch.error || undefined}
          aria-describedby="changes-help"
          placeholder="e.g. Add a description for on_time_flag that explains the stage-by window"
          style={{ width: '100%', padding: 16, borderRadius: 10, border: ch.error ? '1.5px solid #B00000' : '1px solid #7D7C7C', fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, lineHeight: '24px', color: '#1F1E1E', resize: 'vertical' }}
        />
        <span id="changes-help" style={{ fontSize: 12, lineHeight: '16px', color: ch.error ? '#B00000' : '#6E6E6D' }}>
          {ch.error ? 'Add a comment so the submitter knows what to fix.' : 'Required'}
        </span>
      </div>
      <Actions>
        <Slot min={120}><Button variant="outlined" size="medium" className="text-m-sb" onClick={close}>Cancel</Button></Slot>
        <Slot min={184}><Button variant="filled" size="medium" className="text-m-sb" onClick={send}>Request changes</Button></Slot>
      </Actions>
    </SimpleModal>
  );
}
