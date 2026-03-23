export const StatusBanner = ({ status, message }) => {
  if (!message) return null;

  return <div className={`status-banner status-banner--${status}`}>{message}</div>;
};
