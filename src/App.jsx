import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import StatsGrid from './components/StatsGrid';
import ProfileScore from './components/ProfileScore';
import AIInsights from './components/AIInsights';
import LanguageChart from './components/LanguageChart';
import RepoList from './components/RepoList';
import ActivityFeed from './components/ActivityFeed';
import ContributionHeatmap from './components/ContributionHeatmap';
import LoadingSkeleton from './components/LoadingSkeleton';
import FavoritesBar from './components/FavoritesBar';
import { extractUsername, fetchAllUserData } from './api';

export default function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  const handleSearch = useCallback(async (input) => {
    const username = extractUsername(input);
    if (!username) {
      setError('Invalid GitHub username or URL. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);
    setCurrentUsername(username);

    try {
      const data = await fetchAllUserData(username);
      setUserData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user data. Please try again.');
      setCurrentUsername('');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} isLoading={loading} />

      <FavoritesBar currentUsername={currentUsername} onSelect={handleSearch} />

      {error && (
        <div className="error-state">
          <div className="error-icon">😕</div>
          <h3>Oops!</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {userData && !loading && (
        <>
          {/* Profile Card */}
          <ProfileCard profile={userData.profile} />

          {/* Stats Grid */}
          <StatsGrid repos={userData.repos} />

          {/* Score + AI Insights row */}
          <div className="dashboard-grid">
            <ProfileScore
              profile={userData.profile}
              repos={userData.repos}
              events={userData.events}
            />
            <AIInsights
              profile={userData.profile}
              repos={userData.repos}
              events={userData.events}
            />
          </div>

          {/* Contribution Heatmap */}
          <div style={{ marginTop: 24 }}>
            <ContributionHeatmap events={userData.events} />
          </div>

          {/* Charts + Activity row */}
          <div className="dashboard-grid" style={{ marginTop: 24 }}>
            <LanguageChart repos={userData.repos} />
            <ActivityFeed events={userData.events} />
          </div>

          {/* Repos */}
          <div style={{ marginTop: 24 }}>
            <RepoList repos={userData.repos} />
          </div>
        </>
      )}

      <footer className="app-footer">
        <p>
          Built with React & GitHub API · 
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer"> API Docs</a> · 
          Rate limit: 60 req/hr (unauthenticated)
        </p>
      </footer>
    </div>
  );
}
