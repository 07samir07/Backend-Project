import { useState } from 'react';
import { getChannelVideos, getDashboardStats } from '../../api/endpoints';
import { SectionCard } from '../../components/SectionCard';
import { StatusBanner } from '../../components/StatusBanner';
import { formatCompactNumber } from '../../utils/formatters';

export const DashboardPanel = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState({
    type: 'info',
    message: token
      ? 'Ready to load private creator data.'
      : 'Login first to access protected dashboard routes.',
  });

  const loadDashboard = async () => {
    if (!token) {
      setStatus({ type: 'error', message: 'You need an access token to load dashboard data.' });
      return;
    }

    try {
      const [statsResponse, videosResponse] = await Promise.all([
        getDashboardStats(token),
        getChannelVideos(token),
      ]);

      setStats(statsResponse.data);
      setVideos(videosResponse.data || []);
      setStatus({ type: 'success', message: 'Creator dashboard loaded successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <SectionCard
      title="Creator Dashboard"
      subtitle="Inspect protected stats and videos using the access token returned from your login route."
      actions={
        <button className="primary-button" onClick={loadDashboard} type="button">
          Load dashboard
        </button>
      }
    >
      <StatusBanner status={status.type} message={status.message} />
      <div className="stats-grid">
        {[
          ['Subscribers', stats?.totalSubscribers],
          ['Likes', stats?.totalLikes],
          ['Views', stats?.totalViews],
          ['Videos', stats?.totalVideos],
        ].map(([label, value]) => (
          <article className="stat-card" key={label}>
            <p>{label}</p>
            <strong>{formatCompactNumber(value)}</strong>
          </article>
        ))}
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Likes</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {videos.length ? (
              videos.map((video) => (
                <tr key={video._id}>
                  <td>{video.title}</td>
                  <td>{video.isPublished ? 'Published' : 'Draft'}</td>
                  <td>{formatCompactNumber(video.likesCount)}</td>
                  <td>{video.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No dashboard videos loaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};
