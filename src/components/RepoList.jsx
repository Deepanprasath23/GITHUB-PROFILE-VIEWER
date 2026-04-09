import { useState, useMemo } from 'react';
import { FiStar, FiGitBranch, FiSearch } from 'react-icons/fi';
import { getLanguageColor, formatNumber, computeLanguageStats } from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function RepoList({ repos }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [langFilter, setLangFilter] = useState('');
  
  const languages = useMemo(() => {
    const { labels } = computeLanguageStats(repos);
    return labels;
  }, [repos]);
  
  // Sort by stars descending
  const sorted = useMemo(() => {
    return [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  }, [repos]);
  
  const topStars = sorted.length > 0 ? sorted[0].stargazers_count : 0;
  
  const filtered = useMemo(() => {
    return sorted.filter(repo => {
      const matchesSearch = !searchTerm || 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLang = !langFilter || repo.language === langFilter;
      return matchesSearch && matchesLang;
    });
  }, [sorted, searchTerm, langFilter]);
  
  return (
    <div className="glass-card repo-section full-width">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">📁</span> Repositories ({repos.length})
        </h3>
        <div className="repo-controls">
          <input
            id="repo-search"
            className="repo-search"
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            id="lang-filter"
            className="filter-select"
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          No repositories match your filters.
        </p>
      ) : (
        <div className="repo-list">
          {filtered.map(repo => (
            <div 
              key={repo.id} 
              className={`glass-card repo-card ${
                topStars > 0 && repo.stargazers_count === topStars ? 'top-repo' : ''
              }`}
            >
              <div className="repo-name">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </div>
              
              {repo.description && (
                <p className="repo-description">{repo.description}</p>
              )}
              
              <div className="repo-meta">
                {repo.language && (
                  <span className="repo-meta-item">
                    <span 
                      className="repo-lang-dot" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="repo-meta-item">
                  <FiStar /> {formatNumber(repo.stargazers_count || 0)}
                </span>
                <span className="repo-meta-item">
                  <FiGitBranch /> {formatNumber(repo.forks_count || 0)}
                </span>
              </div>
              
              <div className="repo-updated">
                Updated {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
