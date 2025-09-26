


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimeSearch from './components/AnimeSearch';
import Community from './components/Community';
import MerchSuggestions from './components/MerchSuggestions';
import AnimeDetail from './components/AnimeDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="my-4">iAnime</h1>
        <p>Ricerca anime, community e suggerimenti merchandising in un'unica app!</p>
        <Routes>
          <Route path="/" element={
            <>
              <AnimeSearch />
              <Community />
              <MerchSuggestions />
            </>
          } />
          <Route path="/anime/:id" element={<AnimeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
