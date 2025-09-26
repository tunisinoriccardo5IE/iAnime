import React, { useEffect, useState } from 'react';
import Community from './Community';
import MerchSuggestions from './MerchSuggestions';
import StreamingPlatforms from './StreamingPlatforms';
import { useParams } from 'react-router-dom';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  const [jwPlatforms, setJwPlatforms] = useState([]);

  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        if (!res.ok) {
          if (res.status === 429) {
            setError('Rate limit Jikan superato. Riprova tra qualche secondo.');
          } else {
            setError('Errore di rete o anime non trovato.');
          }
          setAnime(null);
          setJwPlatforms([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data.data) {
          setError('Anime non trovato.');
          setAnime(null);
          setJwPlatforms([]);
          setLoading(false);
          return;
        }
        setAnime(data.data);
        // JustWatch integration tramite backend
        if (data.data && data.data.title) {
          const country = getCountry();
          try {
            const apiUrl = `/api/justwatch?title=${encodeURIComponent(data.data.title)}&country=${country}`;
            const jwRes = await fetch(apiUrl);
            const jwData = await jwRes.json();
            if (jwData && jwData.platforms && jwData.platforms.length > 0) {
              setJwPlatforms(jwData.platforms);
            } else {
              setJwPlatforms([]);
            }
          } catch (err) {
            setJwPlatforms([]);
          }
        }
      } catch (e) {
        setError('Errore di rete.');
        setAnime(null);
        setJwPlatforms([]);
      }
      setLoading(false);
    }
    fetchAnime();
  }, [id]);

  // Utility per paese da browser
  function getCountry() {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0].split('-')[1] || 'US';
    }
    if (navigator.language) {
      return navigator.language.split('-')[1] || 'US';
    }
    return 'US';
  }

  // Placeholder prodotti e-commerce
  const products = [
    { name: 'Action Figure', img: 'https://via.placeholder.com/100', url: '#' },
    { name: 'Poster', img: 'https://via.placeholder.com/100', url: '#' },
    { name: 'T-shirt', img: 'https://via.placeholder.com/100', url: '#' },
  ];

  if (loading) return <div className="text-center my-5">Caricamento...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!anime) return null;


  // Mostra prima le piattaforme JustWatch se disponibili, altrimenti fallback Jikan
  let platformsWithLinks = [];
  if (jwPlatforms.length > 0) {
    // Mappa provider_id a nome leggibile (puoi espandere questa mappa)
    const providerNames = {
      'nfx': 'Netflix',
      'prv': 'Prime Video',
      'dnp': 'Disney+',
      'cru': 'Crunchyroll',
      'wki': 'Wakanim',
      'hbo': 'HBO',
      'ply': 'PlayStation',
      'yot': 'YouTube',
      'itv': 'Infinity',
      'rai': 'RaiPlay',
      'med': 'Mediaset Infinity',
      // ...aggiungi altri se necessario
    };
    platformsWithLinks = jwPlatforms.map(p => ({
      name: providerNames[p.name] || p.name,
      url: p.url
    }));
  } else {
    let streamingPlatforms = anime?.streaming || [];
    platformsWithLinks = streamingPlatforms.map(s => ({
      name: s.name,
      url: s.url
    }));
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-4">
          <img src={anime.images?.jpg?.image_url} alt={anime.title} className="img-fluid rounded mb-3" />
        </div>
        <div className="col-md-8">
          <h2>{anime.title}</h2>
          <p>{anime.synopsis}</p>
          <StreamingPlatforms platforms={platformsWithLinks} />
        </div>
      </div>
      <hr />
      <h4>Community</h4>
      <Community />
      <hr />
      <h4>Prodotti consigliati</h4>
      <div className="row">
        {products.map((prod, idx) => (
          <div className="col-4 col-md-2 text-center" key={idx}>
            <a href={prod.url} target="_blank" rel="noopener noreferrer">
              <img src={prod.img} alt={prod.name} className="img-thumbnail mb-2" />
              <div>{prod.name}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimeDetail;
