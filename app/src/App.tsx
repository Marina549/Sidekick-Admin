import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Modals } from './components/Modals';
import { Toast } from './components/pds';
import { NavDrawer, SideNav } from './components/SideNav';
import { Dashboard } from './screens/Dashboard';
import { Flow } from './screens/Flow';
import { Home } from './screens/Home';
import { Success } from './screens/Success';
import { useAdmin } from './store';

export function App() {
  const { s, set } = useAdmin();
  const isFlow = s.screen === 'wizard' || s.screen === 'edit' || s.screen === 'review';
  const footerHeight = useFooterHeight(s.screen);

  return (
    <div data-theme="sutro" data-nav={s.navOpen ? 'open' : 'closed'} className="sk-app">
      <Header />
      <NavDrawer />
      <div className="sk-body">
        <SideNav />
        <main className="sk-main">
          {s.screen === 'home' && <Home />}
          {s.screen === 'dashboard' && <Dashboard />}
          {isFlow && <Flow />}
          {s.screen === 'success' && <Success />}
        </main>
      </div>
      <Modals />
      {s.toast && (
        <div role="status" aria-live="polite" className="sk-toast" data-r="toast" style={{ bottom: footerHeight + (window.innerWidth < 768 ? 16 : 24) }}>
          <Toast tone={s.toast.tone} message={s.toast.message} actions={s.toast.actions} onDismiss={() => set({ toast: null })} />
        </div>
      )}
    </div>
  );
}

/** Height of the sticky flow footer, so toasts sit just above it instead of covering the buttons. */
function useFooterHeight(screen: string) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-r="footer"]');
    if (!el) { setHeight(0); return; }
    const measure = () => setHeight(Math.round(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [screen]);
  return height;
}
