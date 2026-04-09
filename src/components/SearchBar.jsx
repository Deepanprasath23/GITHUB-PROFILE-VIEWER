import { useState } from 'react';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';

export default function SearchBar({ onSearch, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-icon"><FaGithub /></div>
        <h1>GitHub Profile Dashboard</h1>
        <p>
          Explore any GitHub user's profile with rich analytics, repository insights, 
          language breakdowns, and AI-powered summaries.
        </p>
      </div>
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              id="search-input"
              className="search-input"
              type="text"
              placeholder="Enter GitHub username or profile URL..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              id="search-btn"
              className="search-btn"
              type="submit"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <div className="spinner" />
              ) : (
                <>
                  Explore <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
