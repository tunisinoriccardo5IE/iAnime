import React from 'react';

function StreamingPlatforms({ platforms }) {
  if (!platforms || platforms.length === 0) return null;
  return (
    <div>
      <strong>Piattaforme disponibili:</strong> {platforms.join(', ')}
    </div>
  );
}

export default StreamingPlatforms;
