const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'auth', label: 'Authentication' },
  { id: 'videos', label: 'Video Explorer' },
  { id: 'dashboard', label: 'Creator Dashboard' },
];

export const AppShell = ({ children }) => (
  <div className="app-shell">
    <aside className="sidebar">
      <div>
        <p className="brand-kicker">React + Express</p>
        <h1>Backend Project Studio</h1>
        <p className="sidebar-copy">
          A polished frontend starter designed around your existing API routes,
          authentication flow, and creator dashboard endpoints.
        </p>
      </div>
      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
    <main className="content">{children}</main>
  </div>
);
