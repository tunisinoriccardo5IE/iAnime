
import React from 'react';
import AnimeSearch from './components/AnimeSearch';
import Community from './components/Community';
import MerchSuggestions from './components/MerchSuggestions';

function App() {
  return (
    <div>
      <h1>iAnime</h1>
      <p>Ricerca anime, community e suggerimenti merchandising in un'unica app!</p>
  <AnimeSearch />
  <Community />
  <MerchSuggestions />
    </div>
  );
}

export default App;
