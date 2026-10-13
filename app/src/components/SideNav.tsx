import type { Screen } from '../store';
import { useAdmin } from '../store';
import { asset } from '../asset';
import { ModalClose } from './pds';

// Trace tool and Evaluation don't exist yet, so they have no target.
const NAV: { label: string; target: Screen | null; icon: string }[] = [
  { label: 'Home', target: 'home', icon: 'nav-home' },
  { label: 'Entity dashboard', target: 'dashboard', icon: 'nav-entitydash' },
  { label: 'Trace tool', target: null, icon: 'nav-trace' },
  { label: 'Evaluation', target: null, icon: 'nav-eval' },
];

/**
 * Collapsed (88px) and expanded (320px) states keep every icon at the same x position;
 * expanding only reveals the labels.
 */
const navIcon = (icon: string, active: boolean) => (
  <span aria-hidden="true" style={{ display: 'block', flexShrink: 0, width: 24, height: 24, background: `url(${asset('assets/icons/fig/')}${icon}-${active ? 'blue' : 'grey'}.svg) center / contain no-repeat` }} />
);

export function SideNav() {
  const { s, set, go } = useAdmin();
  const open = s.navOpen;
  const activeIndex = s.screen === 'home' ? 0 : 1;

  return (
    <nav aria-label="Primary" data-r="sidenav" className={'sk-nav ' + (open ? 'sk-nav--expanded' : 'sk-nav--collapsed')} style={{ width: open ? 320 : 88 }}>
      <div className="sk-nav__inner">
        {NAV.map((it, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={it.label}
              type="button"
              className="sk-nav__item"
              onClick={() => it.target && go(it.target)}
              aria-label={open ? undefined : it.label}
              title={open ? undefined : it.label}
              aria-current={active ? 'page' : undefined}
              aria-disabled={it.target ? undefined : true}
            >
              {navIcon(it.icon, active)}
              {open && <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{it.label}</span>}
            </button>
          );
        })}
        <button
          type="button"
          className="sk-nav__toggle"
          onClick={() => set(st => ({ navOpen: !st.navOpen }))}
          aria-label={open ? undefined : 'Expand navigation'}
          title={open ? undefined : 'Expand navigation'}
        >
          <img src={asset(`assets/icons/fig/nav-arrow-${open ? 'left' : 'right'}.svg`)} alt="" aria-hidden="true" width={24} height={24} style={{ display: 'block', flexShrink: 0 }} />
          {open && <span>Collapse navigation</span>}
        </button>
      </div>
    </nav>
  );
}

/** Slide-out navigation that replaces the side nav below 1024px. */
export function NavDrawer() {
  const { s, set, go } = useAdmin();
  if (!s.drawerOpen) return null;
  const close = () => set({ drawerOpen: false });
  const activeIndex = s.screen === 'home' ? 0 : 1;
  return (
    <div className="sk-drawer" data-r="drawer">
      <div className="sk-drawer__scrim" onClick={close} aria-hidden="true" />
      <nav aria-label="Primary" className="sk-drawer__panel">
        <div className="sk-drawer__head">
          <img src={asset('assets/sidekick-logo-full.svg')} alt="SideKick Admin" width={136} height={24} style={{ display: 'block', width: 136, height: 'auto' }} />
          <ModalClose onClick={close} label="Close navigation" autoFocus style={{ marginRight: 0 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NAV.map((it, i) => (
            <button
              key={it.label}
              type="button"
              className="sk-nav__item"
              data-r="drawer-item"
              onClick={() => it.target && go(it.target)}
              aria-current={i === activeIndex ? 'page' : undefined}
              aria-disabled={it.target ? undefined : true}
            >
              {navIcon(it.icon, i === activeIndex)}
              <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
