import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImgIcon } from '../components/Icon';
import { Button } from '../components/pds';
import { STEP_LABELS, ago, draftKey, emptyDraft, step1Missing, step2Missing, type Step } from '../data';
import { useAdmin } from '../store';
import { DataSchemaForm } from './flow/DataSchemaForm';
import { PromptsEvals } from './flow/PromptsEvals';
import { Summary } from './flow/Summary';
import { asset } from '../asset';

/** New entity (3-step wizard), Edit entity and Review submission share this layout. */
export function Flow() {
  const { s, me, now, set, go, submit, saveEdit, approve, saveDraft, askDelete } = useAdmin();
  const isWizard = s.screen === 'wizard';
  const isEdit = s.screen === 'edit';
  const isReview = s.screen === 'review';
  const reviewEnt = isReview ? s.entities.find(e => e.id === s.reviewId) : undefined;

  const d = s.draft || emptyDraft();
  const m1 = step1Missing(d);
  const m2 = step2Missing(d);

  let title = 'New Entity';
  let subtitle = '';
  let label = 'New entity — ' + STEP_LABELS[s.step - 1];
  if (isEdit) { title = 'Edit Entity'; label = 'Edit entity'; }
  if (isReview) {
    title = 'Review submission';
    label = 'Review submission';
    if (reviewEnt?.submittedBy) {
      subtitle = (reviewEnt.verb === 'updated' ? 'Updated' : 'Submitted') + ' by ' + reviewEnt.submittedBy + ' · ' + ago(reviewEnt.submittedAt || now, now)
        + (reviewEnt.status === 'published' && reviewEnt.approvedBy ? ' · Approved by ' + reviewEnt.approvedBy : '');
    }
  }

  const showForm = (isWizard && s.step === 1) || isEdit;
  const showFiles = isWizard && s.step === 2;
  const showSummary = (isWizard && s.step === 3) || isReview;

  const nextDisabled = s.submitting || (s.step === 1 ? !!m1 : s.step === 2 ? !!m2 : !!(m1 || m2));
  const onNext = () => {
    if (s.step < 3) { set({ step: (s.step + 1) as Step }); window.scrollTo(0, 0); } else submit();
  };

  const ed = s.editDraft;
  const editDirty = isEdit && !!ed && JSON.stringify(ed) !== s.editOriginal;
  const editIncomplete = isEdit && !!ed && !!step1Missing(ed);

  const showDecision = !!reviewEnt && reviewEnt.status === 'pending' && me.canApprove;

  // "Delete entity" is offered once the entity exists on the dashboard (a saved draft, or Edit entity).
  const deleteTarget = isEdit ? s.editId : isWizard ? s.draftId : null;
  const showDelete = !!deleteTarget && s.entities.some(e => e.id === deleteTarget);
  // "Save as draft" appears once the draft differs from how it was opened.
  const showSaveDraft = isWizard && draftKey(s.draft) !== s.draftBase;
  const draftEmpty = !d.category && !d.entity && !d.source && !d.tables.length && !d.files.length;

  return (
    <section data-screen-label={label} className="sk-flow">
      <div className="sk-flow__body" data-r="flow-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Breadcrumbs />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="sk-title-row">
              <h1 className="sk-h1">{title}</h1>
              <img src={asset('assets/ill-entity-dashboard-v3.png')} data-r="page-ill" alt="" width={104} height={76} style={{ display: 'block', width: 104, height: 76, objectFit: 'contain' }} />
            </div>
            {subtitle && <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: 16, lineHeight: '24px', color: '#4B4B49' }}>{subtitle}</p>}
          </div>
        </div>

        {isWizard && <Stepper reachable={[true, !m1, !m1 && !m2]} />}
        {isWizard && (
          <p data-r="step-mobile" style={{ margin: '-8px 0 0', textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '24px', color: '#4B4B49' }}>
            Step {s.step} of 3 · {STEP_LABELS[s.step - 1]}
          </p>
        )}
        {showForm && <DataSchemaForm />}
        {showFiles && <PromptsEvals />}
        {showSummary && <Summary />}
      </div>

      <div className="sk-flow__footer" data-r="footer">
        <div data-r="footer-left" style={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
          {showDelete && (
            <button type="button" className="sk-link" style={{ padding: '8px 0', fontSize: 16 }} onClick={askDelete}>
              <span>Delete entity</span>
            </button>
          )}
        </div>
        <div data-r="footer-right" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {isWizard && (
          <div data-r="footer-grp" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {showSaveDraft && (
              <div data-r="fdraft" style={{ display: 'flex' }}>
                <Button variant="transparent" size="large" className="text-l-sb" disabled={s.submitting || draftEmpty} onClick={saveDraft}>Save as draft</Button>
              </div>
            )}
            {s.step > 1 && (
              <div data-r="fbtn" style={{ display: 'flex', minWidth: 144 }}>
                <Button variant="outlined" size="large" className="text-l-sb" disabled={s.submitting} onClick={() => { set({ step: (s.step - 1) as Step }); window.scrollTo(0, 0); }}>Back</Button>
              </div>
            )}
            <div data-r="fbtn" style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="filled" size="large" className="text-l-sb" disabled={nextDisabled} onClick={onNext}>
                {s.step === 3 ? (s.submitting ? 'Submitting…' : 'Submit') : 'Next'}
              </Button>
            </div>
          </div>
        )}
        {isEdit && (
          <div data-r="footer-grp" style={{ display: 'flex', gap: 16 }}>
            <div data-r="fbtn" style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="outlined" size="large" className="text-l-sb" onClick={() => go('dashboard', { editDraft: null, editId: null })}>Cancel</Button>
            </div>
            <div data-r="fbtn" style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="filled" size="large" className="text-l-sb" disabled={!editDirty || editIncomplete} onClick={saveEdit}>Save</Button>
            </div>
          </div>
        )}
        {showDecision && (
          <div data-r="footer-grp" style={{ display: 'flex', gap: 16 }}>
            <div data-r="fbtn" style={{ display: 'flex', minWidth: 184 }}>
              <Button variant="outlined" size="large" className="text-l-sb" onClick={() => set({ changes: { text: '', error: false } })}>Request changes</Button>
            </div>
            <div data-r="fbtn" style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="filled" size="large" className="text-l-sb" disabled={s.approving} onClick={approve}>{s.approving ? 'Approving…' : 'Approve'}</Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

/** 3-step progress: current step is a blue ring, finished steps are filled with a check. */
function Stepper({ reachable }: { reachable: boolean[] }) {
  const { s, set } = useAdmin();
  return (
    <ol aria-label="Progress" className="sk-stepper" data-r="stepper">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = n < s.step;
        const cur = n === s.step;
        return (
          <li key={label} style={{ display: 'flex', alignItems: 'center', flex: i > 0 ? 1 : '0 0 auto' }}>
            {i > 0 && <span aria-hidden="true" style={{ flex: 1, height: 2, borderRadius: 100, margin: '0 8px', background: n <= s.step ? '#004488' : '#C2C1C0' }} />}
            <button
              type="button"
              className="sk-stepper__circle"
              onClick={() => { if (reachable[i]) set({ step: n }); }}
              disabled={!reachable[i] || cur}
              aria-current={cur ? 'step' : undefined}
              aria-label={label + (done ? ', completed' : cur ? ', current step' : '')}
              style={{
                background: done ? '#004488' : '#FFFFFF',
                boxShadow: done ? 'none' : 'inset 0 0 0 2px ' + (cur ? '#004488' : '#C2C1C0'),
                color: cur ? '#004488' : '#A3A2A2',
                cursor: reachable[i] && !cur ? 'pointer' : 'default',
              }}
            >
              {done
                ? <ImgIcon src="c/checkmark_outlined_24-white.svg" size={16} />
                : <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '16px' }}>{n}</span>}
              <span className="sk-stepper__label" data-r="step-label">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
