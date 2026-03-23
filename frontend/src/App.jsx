import { useEffect, useState } from 'react';
import { healthcheck } from './api/endpoints';
import { SectionCard } from './components/SectionCard';
import { StatusBanner } from './components/StatusBanner';
import { AuthPanel } from './features/auth/AuthPanel';
import { DashboardPanel } from './features/dashboard/DashboardPanel';
import { VideoExplorer } from './features/videos/VideoExplorer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppShell } from './layout/AppShell';

const overviewCards = [
  {
    title: 'Backend compatible',
    description:
      'Targets your existing `/api/v1/users`, `/api/v1/video`, `/api/v1/dashboard`, and `/api/v1/healthcheck` routes.',
  },
  {
    title: 'Clean structure',
    description:
      'Uses feature-based folders for auth, dashboard, videos, API access, shared layout, and reusable components.',
  },
  {
    title: 'Ready to extend',
    description:
      'You can add playlists, comments, subscriptions, and uploads without restructuring the app later.',
  },
];

export default function App() {
  const [authState, setAuthState] = useLocalStorage('studio-auth', {
    accessToken: '',
    refreshToken: '',
    user: null,
  });
  const [healthStatus, setHealthStatus] = useState({
    type: 'info',
    message: 'Checking API health…',
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthcheck();
        setHealthStatus({ type: 'success', message: response.data.message });
      } catch (error) {
        setHealthStatus({
          type: 'error',
          message: `${error.message}. Start the backend on http://localhost:8000 or set VITE_API_BASE_URL.`,
        });
      }
    };

    checkHealth();
  }, []);

  return (
    <AppShell>
      <section className="hero" id="overview">
        <div>
          <p className="eyebrow">Frontend Starter</p>
          <h2>Clean UI/UX for your video backend</h2>
          <p className="hero-copy">
            This React app gives you a polished starting point for auth, public video discovery,
            and creator analytics while staying aligned with your current Express API routes.
          </p>
        </div>
        <StatusBanner status={healthStatus.type} message={healthStatus.message} />
      </section>

      <section className="overview-grid">
        {overviewCards.map((card) => (
          <article className="overview-card" key={card.title}>
            <p className="eyebrow">Feature</p>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <div id="auth">
        <AuthPanel authState={authState} setAuthState={setAuthState} />
      </div>

      <div id="videos">
        <VideoExplorer />
      </div>

      <div id="dashboard">
        <DashboardPanel token={authState.accessToken} />
      </div>

      <SectionCard
        title="Folder structure"
        subtitle="A maintainable structure that can scale with your backend resources."
      >
        <pre className="code-block">{`frontend/
  src/
    api/
    components/
    features/
      auth/
      dashboard/
      videos/
    hooks/
    layout/
    styles/
    utils/`}</pre>
      </SectionCard>
    </AppShell>
  );
}
