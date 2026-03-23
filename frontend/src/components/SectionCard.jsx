export const SectionCard = ({ title, subtitle, actions, children }) => (
  <section className="section-card">
    <header className="section-card__header">
      <div>
        <p className="eyebrow">Workspace</p>
        <h2>{title}</h2>
        {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="section-card__actions">{actions}</div> : null}
    </header>
    <div className="section-card__body">{children}</div>
  </section>
);
