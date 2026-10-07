import type { CSSProperties } from 'react';
import { CAT_BY_KEY, fmtDate, sizeText } from '../data';
import { useAdmin } from '../store';
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
    </>
  );
}

function PreviewModal() {
  const { s, set, download } = useAdmin();
  const f = s.preview!;
  const close = () => set({ preview: null });
  const ext = f.ext || (f.name.split('.').pop() || '').toLowerCase();
  const isPdf = ext === 'pdf' && !!f.url;
  const text = isPdf ? '' : f.content ?? (ext === 'md' ? 'Loading preview…' : '');
  const none = !isPdf && f.content == null && ext !== 'md' ? `Preview isn't available for .${ext} files. Download the file to view it.` : '';

  return (
    <Modal size="large" aria-label={f.name} style={LARGE}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="sk-modal-head">
          <h3 className="sk-modal-title">{f.name}</h3>
          <ModalClose onClick={close} />
        </div>
        <p style={{ margin: '-8px 0 0', fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>
          {CAT_BY_KEY[f.cat].title} · {sizeText(f.size)} · Uploaded {fmtDate(f.at)} by {f.by || '—'}
        </p>
        {isPdf && <iframe src={f.url} title={f.name} style={{ width: '100%', height: 480, border: '1px solid #E5E4E3', borderRadius: 8 }} />}
        {text && (
          <pre style={{ margin: 0, maxHeight: 480, overflow: 'auto', padding: 24, background: '#FAF9F8', borderRadius: 8, fontFamily: "'Nunito Sans', sans-serif", fontSize: 14, lineHeight: '24px', color: '#1F1E1E', whiteSpace: 'pre-wrap' }}>{text}</pre>
        )}
        {none && <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#4B4B49' }}>{none}</p>}
        <div className="sk-modal-actions">
          <div style={{ display: 'flex', minWidth: 144 }}><Button variant="outlined" size="medium" className="text-m-sb" onClick={() => download(f)}>Download</Button></div>
          <div style={{ display: 'flex', minWidth: 120 }}><Button variant="filled" size="medium" className="text-m-sb" onClick={close}>Close</Button></div>
        </div>
      </div>
    </Modal>
  );
}

function RemoveFileModal() {
  const { s, set, confirmRemove } = useAdmin();
  const r = s.removing!;
  const cancel = () => set({ removing: null });
  return (
    <Modal size="medium" aria-label="Remove file" style={MEDIUM}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sk-modal-head">
          <h3 className="sk-modal-title">Remove this file?</h3>
          <ModalClose onClick={cancel} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: '#1F1E1E', overflowWrap: 'anywhere' }}>
            <strong>{r.name}</strong> will be permanently removed from <strong>{CAT_BY_KEY[r.cat].title}</strong>. This can’t be undone.
          </p>
          <div className="sk-modal-actions">
            <div style={{ display: 'flex', minWidth: 120 }}><Button variant="outlined" size="medium" className="text-m-sb" onClick={cancel}>Cancel</Button></div>
            <div style={{ display: 'flex', minWidth: 144 }}><Button variant="filled" size="medium" className="text-m-sb" onClick={confirmRemove}>Remove file</Button></div>
          </div>
        </div>
      </div>
    </Modal>
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
    <Modal size="medium" aria-label="Request changes" style={MEDIUM}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="sk-modal-head">
          <h3 className="sk-modal-title">Request changes</h3>
          <ModalClose onClick={close} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
          <div className="sk-modal-actions">
            <div style={{ display: 'flex', minWidth: 120 }}><Button variant="outlined" size="medium" className="text-m-sb" onClick={close}>Cancel</Button></div>
            <div style={{ display: 'flex', minWidth: 184 }}><Button variant="filled" size="medium" className="text-m-sb" onClick={send}>Request changes</Button></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
