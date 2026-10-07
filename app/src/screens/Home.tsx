import { useAdmin } from '../store';

export function Home() {
  const { me, go } = useAdmin();
  return (
    <section data-screen-label="Home" className="sk-home">
      <h1 className="sk-h1" style={{ color: '#252733' }}>Good morning, {me.first}!</h1>
      <div className="sk-home__cards">
        <button type="button" className="sk-home-card sk-home-card--link" onClick={() => go('dashboard')}>
          <span className="sk-home-card__media">
            <span aria-hidden="true" style={{ width: 124, height: 124, borderRadius: '50%', background: 'url(/assets/ill-entity-dashboard.png) 74.39% 50% / 133.065% 88.71% no-repeat, #DDEFFF' }} />
          </span>
          <span className="sk-home-card__text">
            <span className="sk-home-card__title" style={{ color: '#1A1A1A' }}>Entity Dashboard</span>
            <span className="sk-home-card__body">Add, organize and edit the entities available in Sidekick.</span>
          </span>
        </button>
        {/* Trace Tool and Evaluation aren't built yet. */}
        <div className="sk-home-card" aria-disabled="true">
          <div className="sk-home-card__media"><img src="/assets/ill-trace-tool.png" alt="" width={124} height={124} style={{ display: 'block', objectFit: 'cover' }} /></div>
          <div className="sk-home-card__text">
            <span className="sk-home-card__title">Trace Tool</span>
            <span className="sk-home-card__body">Trace how Sidekick reached an answer, step by step.</span>
          </div>
        </div>
        <div className="sk-home-card" aria-disabled="true">
          <div className="sk-home-card__media"><img src="/assets/ill-evaluation.png" alt="" width={124} height={124} style={{ display: 'block', objectFit: 'cover' }} /></div>
          <div className="sk-home-card__text">
            <span className="sk-home-card__title">Evaluation</span>
            <span className="sk-home-card__body">Check Sidekick's answers against your evals.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
