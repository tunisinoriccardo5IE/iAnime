import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      if (data.data) {
        setResults(data.data.map(anime => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images?.jpg?.image_url,
          synopsis: anime.synopsis,
        })));
      } else {
        setResults([]);
      }
    } catch (error) {
      setResults([]);
    }
  };

  return (
    <div className="container my-4">
      <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
        <div className="col-auto flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca un anime..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Cerca</button>
        </div>
      </form>
      <div className="row">
        {results.map((anime, idx) => (
          <div key={idx} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm" style={{cursor: 'pointer'}} onClick={() => navigate(`/anime/${anime.id}`)}>
              {anime.image && (
                <img src={anime.image} alt={anime.title} className="card-img-top" style={{objectFit: 'cover', height: '250px'}} />
              )}
              <div className="card-body">
                <h5 className="card-title">{anime.title}</h5>
                {anime.synopsis && (
                  <p className="card-text" style={{fontSize: '0.95em', color: '#555'}}>{anime.synopsis.slice(0, 180)}...</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimeSearch;
