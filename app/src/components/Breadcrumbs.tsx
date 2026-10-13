import type { CSSProperties } from 'react';
import type { Screen } from '../store';
import { useAdmin } from '../store';

const CURRENT_LABEL: Partial<Record<Screen, string>> = {
  wizard: 'New entity',
  edit: 'Edit entity',
  review: 'Review submission',
  success: 'Submitted for review',
};

/** Home › Entity dashboard › current page. Links save a wizard draft, like any other exit. */
export function Breadcrumbs({ style }: { style?: CSSProperties }) {
  const { s, go } = useAdmin();
  const crumbs: { label: string; target?: Screen }[] = [{ label: 'Home', target: 'home' }];
  if (s.screen === 'dashboard') crumbs.push({ label: 'Entity dashboard' });
  else crumbs.push({ label: 'Entity dashboard', target: 'dashboard' }, { label: s.resubmitId && s.screen === 'wizard' ? 'Make changes' : CURRENT_LABEL[s.screen] || '' });

  const leave = (target: Screen) => go(target, s.screen === 'edit' ? { editDraft: null, editId: null } : {});

  return (
    <nav aria-label="Breadcrumb" className="sk-crumbs" style={style}>
      <ol data-r="crumbs">
        {crumbs.map((c, i) => (
          <li key={c.label}>
            {i > 0 && <span aria-hidden="true" className="sk-crumbs__sep" data-r="crumb-sep" />}
            {c.target
              ? (
                <button type="button" className="sk-crumbs__link" data-r="crumb-link" onClick={() => leave(c.target!)}>
                  {/* Phones show only the parent page, with a back chevron. */}
                  <span data-r="crumb-back" className="pds-svg-chevron-left-small" aria-hidden="true" style={{ width: 24, height: 24, flexShrink: 0, background: 'currentColor' }} />
                  {c.label}
                </button>
              )
              : <span aria-current="page" className="sk-crumbs__current">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
