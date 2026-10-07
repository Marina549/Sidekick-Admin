import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImgIcon } from '../components/Icon';
import { Button } from '../components/pds';
import { STEP_LABELS, ago, emptyDraft, step1Missing, step2Missing, type Step } from '../data';
import { useAdmin } from '../store';
import { DataSchemaForm } from './flow/DataSchemaForm';
import { PromptsEvals } from './flow/PromptsEvals';
import { Summary } from './flow/Summary';

/** New entity (3-step wizard), Edit entity and Review submission share this layout. */
export function Flow() {
  const { s, me, now, set, go, submit, saveEdit, approve } = useAdmin();
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
    if (reviewEnt?.submittedBy) subtitle = (reviewEnt.verb === 'updated' ? 'Updated' : 'Submitted') + ' by ' + reviewEnt.submittedBy + ' · ' + ago(reviewEnt.submittedAt || now, now);
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

  return (
    <section data-screen-label={label} className="sk-flow">
      <div className="sk-flow__body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Breadcrumbs />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="sk-title-row">
              <h1 className="sk-h1">{title}</h1>
              <img src="/assets/ill-entity-dashboard.png" alt="" width={144} height={76} className="sk-title-ill" />
            </div>
            {subtitle && <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: 16, lineHeight: '24px', color: '#4B4B49' }}>{subtitle}</p>}
          </div>
        </div>

        {isWizard && <Stepper reachable={[true, !m1, !m1 && !m2]} />}
        {showForm && <DataSchemaForm />}
        {showFiles && <PromptsEvals />}
        {showSummary && <Summary />}
      </div>

      <div className="sk-flow__footer">
        {isWizard && (
          <div style={{ display: 'flex', minWidth: 144 }}>
            <Button variant="filled" size="large" className="text-l-sb" disabled={nextDisabled} onClick={onNext}>
              {s.step === 3 ? (s.submitting ? 'Submitting…' : 'Submit') : 'Next'}
            </Button>
          </div>
        )}
        {isEdit && (
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="outlined" size="large" className="text-l-sb" onClick={() => go('dashboard', { editDraft: null, editId: null })}>Cancel</Button>
            </div>
            <div style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="filled" size="large" className="text-l-sb" disabled={!editDirty || editIncomplete} onClick={saveEdit}>Save</Button>
            </div>
          </div>
        )}
        {showDecision && (
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', minWidth: 184 }}>
              <Button variant="outlined" size="large" className="text-l-sb" onClick={() => set({ changes: { text: '', error: false } })}>Request changes</Button>
            </div>
            <div style={{ display: 'flex', minWidth: 144 }}>
              <Button variant="filled" size="large" className="text-l-sb" disabled={s.approving} onClick={approve}>{s.approving ? 'Approving…' : 'Approve'}</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** 3-step progress: current step is a blue ring, finished steps are filled with a check. */
function Stepper({ reachable }: { reachable: boolean[] }) {
  const { s, set } = useAdmin();
  return (
    <ol aria-label="Progress" className="sk-stepper">
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
              <span className="sk-stepper__label">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
