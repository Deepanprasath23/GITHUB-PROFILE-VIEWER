import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gh-dashboard-favorites';

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export default function FavoritesBar({ currentUsername, onSelect }) {
  const [favorites, setFavorites] = useState(loadFavorites);
  
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);
  
  const addFavorite = () => {
    if (currentUsername && !favorites.includes(currentUsername)) {
      setFavorites([...favorites, currentUsername]);
    }
  };
  
  const removeFavorite = (username) => {
    setFavorites(favorites.filter(f => f !== username));
  };
  
  const isSaved = currentUsername && favorites.includes(currentUsername);
  
  return (
    <div className="favorites-bar">
      {favorites.length > 0 && (
        <>
          <span className="favorites-label">Saved:</span>
          {favorites.map(fav => (
            <button
              key={fav}
              className="fav-chip"
              onClick={() => onSelect(fav)}
              title={`View ${fav}'s dashboard`}
            >
              {fav}
              <span
                className="remove-fav"
                onClick={(e) => { e.stopPropagation(); removeFavorite(fav); }}
                title="Remove"
              >
                ×
              </span>
            </button>
          ))}
        </>
      )}
      {currentUsername && !isSaved && (
        <button className="save-fav-btn" onClick={addFavorite}>
          + Save {currentUsername}
        </button>
      )}
    </div>
  );
}
