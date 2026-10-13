import { ImgIcon, MaskIcon } from '../../components/Icon';
import { SchemaTable } from '../../components/SchemaTable';
import { FILE_CATS, fieldCount, fmtDate, fmtDateTime, plural, sizeText, type FileRec, type Step } from '../../data';
import { useAdmin } from '../../store';

const VISIBLE_FILES = 3;
const byNewest = (a: FileRec, b: FileRec) => (b.at || 0) - (a.at || 0);

/** Review & submit (wizard step 3) and Review & approve (approver's Review submission). */
export function Summary() {
  const { s, me, set } = useAdmin();
  const isWizard = s.screen === 'wizard';
  const reviewEnt = s.screen === 'review' ? s.entities.find(e => e.id === s.reviewId) : undefined;
  const src = reviewEnt
    ? { name: reviewEnt.name, category: reviewEnt.category, tables: reviewEnt.tables, files: reviewEnt.files }
    : { name: s.draft?.entity || '', category: s.draft?.category || '', tables: s.draft?.tables || [], files: s.draft?.files || [] };
  const files = src.files.filter(f => f.status === 'done');

  let note = '';
  if (reviewEnt) {
    if (reviewEnt.status === 'published' && reviewEnt.approvedBy) note = 'Approved by ' + reviewEnt.approvedBy + (reviewEnt.approvedAt ? ' on ' + fmtDate(reviewEnt.approvedAt) : '') + '.';
    else if (reviewEnt.status !== 'pending') note = 'This submission was already reviewed.';
    else if (!me.canApprove) note = 'You don’t have approval rights. Only approvers can approve or request changes.';
  }

  const editLink = (step: Step, label: string) => isWizard && (
    <button type="button" className="sk-link" onClick={() => set({ step })} aria-label={label}>
      <ImgIcon src="c/edit_outlined_24-blue.svg" size={20} />
      <span>Edit</span>
    </button>
  );

  return (
    <div className="sk-panel" data-r="card" style={{ gap: 32 }}>
      <h2 className="sk-h2">{reviewEnt ? 'Review & approve' : 'Review & submit'}</h2>
      {note && (
        <div role="note" className="sk-note sk-note--info">
          <ImgIcon src="c/info_outlined_24-blue.svg" size={24} />
          <span>{note}</span>
        </div>
      )}

      <div className="sk-sum__section">
        <div className="sk-sum__head">
          <h3 className="sk-sum__title">Data &amp; schema</h3>
          {editLink(1, 'Edit data and schema')}
        </div>
        <div className="sk-sum__box">
          <div className="sk-sum__bar" data-r="sum-head">
            <span style={{ flex: '1 1 240px', fontWeight: 600, fontSize: 16, lineHeight: '30px' }}>{src.name}</span>
            <span>Category: {src.category}</span>
            <span>{plural(src.tables.length, 'table')}</span>
            <span>{plural(fieldCount(src.tables), 'field')}</span>
          </div>
          <div data-r="sum-inner" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px 24px', background: '#FFFFFF' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#262524' }}>Schema annotation</span>
            <SchemaTable tables={src.tables} />
          </div>
        </div>
      </div>

      <div className="sk-sum__section">
        <div className="sk-sum__head">
          <h3 className="sk-sum__title">Prompts &amp; evals</h3>
          {editLink(2, 'Edit prompts and evals')}
        </div>
        <div className="sk-sum__box">
          <div role="list" data-r="sum-list" style={{ display: 'flex', flexDirection: 'column', padding: '0 24px 8px', background: '#FFFFFF' }}>
            {FILE_CATS.map((c, i) => {
              const list = files.filter(f => f.cat === c.key).sort(byNewest);
              const expanded = !!s.sumExpanded[c.key];
              const shown = expanded ? list : list.slice(0, VISIBLE_FILES);
              const hidden = list.length - VISIBLE_FILES;
              return (
                <div key={c.key} role="listitem" className="sk-sum__cat" style={{ borderTop: i ? '1px solid #F1F0EE' : 'none' }}>
                  <div data-r="sum-cat" style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#262524' }}>{c.title}</span>
                    <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49', whiteSpace: 'nowrap' }}>{list.length ? plural(list.length, 'file') : 'No files'}</span>
                  </div>
                  <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    {list.length > 0 ? (
                      <>
                        <div role="list" aria-label={c.title + ' files'} style={{ display: 'flex', flexDirection: 'column' }}>
                          {shown.map((f, j) => <SummaryFile key={f.id} file={f} first={j === 0} editable={isWizard} />)}
                        </div>
                        {list.length > VISIBLE_FILES && (
                          <button type="button" className="sk-link" style={{ alignSelf: 'flex-start', padding: '4px 0', lineHeight: '20px' }} onClick={() => set(x => ({ sumExpanded: { ...x.sumExpanded, [c.key]: !x.sumExpanded[c.key] } }))}>
                            {expanded ? 'Show fewer files' : 'Show ' + plural(hidden, 'more file', 'more files')}
                          </button>
                        )}
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 40 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#1F1E1E' }}>
                          <MaskIcon name="info" size={20} style={{ color: '#4B4B49' }} />
                          No files added
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryFile({ file: f, first, editable }: { file: FileRec; first: boolean; editable: boolean }) {
  const { download, openPreview } = useAdmin();
  return (
    <div role="listitem" style={{ display: 'flex', alignItems: 'center', gap: 16, minHeight: 56, padding: '8px 0', borderTop: first ? 'none' : '1px solid #F1F0EE' }}>
      <MaskIcon name="file" size={24} style={{ color: '#6E6E6D' }} />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span title={f.name} className="sk-files__name">{f.name}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, lineHeight: '20px', color: '#4B4B49' }}>
          {sizeText(f.size) + ' · ' + (f.editedAt ? 'Last edited ' + fmtDateTime(f.editedAt) + ' by ' + f.editedBy : 'Uploaded ' + fmtDate(f.at) + ' by ' + (f.by || '—'))}
        </span>
      </span>
      <div data-r="sum-act" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button type="button" className="sk-icon-btn sk-icon-btn--plain" onClick={() => openPreview(f, editable)} aria-label={'Preview ' + f.name} title="Preview"><MaskIcon name="eye" size={20} /></button>
        <button type="button" className="sk-icon-btn sk-icon-btn--plain" onClick={() => download(f)} aria-label={'Download ' + f.name} title="Download"><MaskIcon name="download" size={20} /></button>
      </div>
    </div>
  );
}
