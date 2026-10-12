import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/pds';
import { useAdmin } from '../store';
import { asset } from '../asset';

export function Success() {
  const { go, startNew } = useAdmin();
  return (
    <section data-screen-label="Submitted for review" className="sk-success">
      <Breadcrumbs style={{ alignSelf: 'stretch' }} />
      <img src={asset('assets/ill-submitted.png')} alt="" width={144} height={144} style={{ display: 'block', borderRadius: '50%', objectFit: 'cover' }} />
      <h1 style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 32, lineHeight: '48px', color: '#262524' }}>Submitted for review</h1>
      <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: 20, lineHeight: '30px', color: '#1F1E1E' }}>We will notify you when it will be reviewed and published.</p>
      <div style={{ display: 'flex', gap: 16, paddingTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', minWidth: 200 }}>
          <Button variant="outlined" size="large" className="text-l-sb" onClick={() => go('dashboard')}>Back to Dashboard</Button>
        </div>
        <div style={{ display: 'flex', minWidth: 200 }}>
          <Button variant="filled" size="large" className="text-l-sb" onClick={startNew}>Add another entity</Button>
        </div>
      </div>
    </section>
  );
}
