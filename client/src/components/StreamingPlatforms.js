import React from 'react';


// platforms: array di oggetti { name, url }
function StreamingPlatforms({ platforms }) {
  if (!platforms || platforms.length === 0) return null;
  return (
    <div className="alert alert-info p-2 mb-2" role="alert">
      <strong>Piattaforme disponibili:</strong>
      <ul className="mb-0 ps-3">
        {platforms.map((p, idx) => (
          <li key={idx}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
            ) : p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamingPlatforms;
