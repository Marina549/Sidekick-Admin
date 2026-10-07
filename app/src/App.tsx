import { Header } from './components/Header';
import { Modals } from './components/Modals';
import { Toast } from './components/pds';
import { SideNav } from './components/SideNav';
import { Dashboard } from './screens/Dashboard';
import { Flow } from './screens/Flow';
import { Home } from './screens/Home';
import { Success } from './screens/Success';
import { useAdmin } from './store';

export function App() {
  const { s, set } = useAdmin();
  const isFlow = s.screen === 'wizard' || s.screen === 'edit' || s.screen === 'review';

  return (
    <div data-theme="sutro" className="sk-app">
      <Header />
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
        <div role="status" aria-live="polite" className="sk-toast">
          <Toast tone={s.toast.tone} message={s.toast.message} actions={s.toast.actions} onDismiss={() => set({ toast: null })} />
        </div>
      )}
    </div>
  );
}
