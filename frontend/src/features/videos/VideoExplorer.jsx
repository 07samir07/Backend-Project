import { useEffect, useState } from 'react';
import { getVideos } from '../../api/endpoints';
import { SectionCard } from '../../components/SectionCard';
import { StatusBanner } from '../../components/StatusBanner';
import { formatCompactNumber, formatDate } from '../../utils/formatters';

const initialFilters = {
  page: 1,
  limit: 6,
  query: '',
  sortBy: 'createdAt',
  sortType: 'desc',
};

export const VideoExplorer = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [videos, setVideos] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState({ type: 'info', message: 'Loading videos…' });

  const fetchVideos = async (nextFilters = filters) => {
    try {
      const response = await getVideos(nextFilters);
      setVideos(response.data.docs || []);
      setMeta(response.data);
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  useEffect(() => {
    fetchVideos(initialFilters);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchVideos(filters);
  };

  return (
    <SectionCard
      title="Video Explorer"
      subtitle="Query your public video feed with backend-native pagination and sorting controls."
    >
      <StatusBanner status={status.type} message={status.message} />
      <form className="toolbar" onSubmit={handleSubmit}>
        <input name="query" onChange={handleFilterChange} placeholder="Search title or description" value={filters.query} />
        <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
          <option value="createdAt">Newest</option>
          <option value="views">Views</option>
          <option value="duration">Duration</option>
        </select>
        <select name="sortType" onChange={handleFilterChange} value={filters.sortType}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button className="primary-button" type="submit">
          Refresh feed
        </button>
      </form>
      <div className="video-grid">
        {videos.map((video) => (
          <article className="video-card" key={video._id}>
            <div className="video-card__thumbnail">
              <span>{video.title?.slice(0, 1) || 'V'}</span>
            </div>
            <div className="video-card__body">
              <div>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
              <dl>
                <div>
                  <dt>Views</dt>
                  <dd>{formatCompactNumber(video.views)}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{formatDate(video.createdAt)}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
      {meta ? (
        <div className="meta-row">
          <span>Page {meta.page || 1}</span>
          <span>Total videos: {meta.totalDocs || videos.length}</span>
          <span>Total pages: {meta.totalPages || 1}</span>
        </div>
      ) : null}
    </SectionCard>
  );
};
