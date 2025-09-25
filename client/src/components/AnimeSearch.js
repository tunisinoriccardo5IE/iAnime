import React, { useState } from 'react';

function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Placeholder: chiamata API da implementare
    setResults([{ title: 'Esempio Anime', streaming: ['Netflix', 'Crunchyroll'] }]);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cerca un anime..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Cerca</button>
      </form>
      <ul>
        {results.map((anime, idx) => (
          <li key={idx}>
            <strong>{anime.title}</strong> - Streaming: {anime.streaming.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnimeSearch;
