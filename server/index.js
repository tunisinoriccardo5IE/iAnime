const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());


// API: piattaforme JustWatch per titolo e paese

app.get('/api/justwatch', async (req, res) => {
  const { title, country } = req.query;
  if (!title) return res.status(400).json({ error: 'Titolo richiesto' });
  let userCountry = country;
  try {
    // Se non specificato, rileva il paese dall'IP
    if (!userCountry) {
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
      // Usa ipinfo.io per geolocalizzazione gratuita (limite 50k/mese)
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const geoRes = await fetch(`https://ipinfo.io/${ip}/json?token=demo`); // Sostituisci 'demo' con un token reale se necessario
      const geoData = await geoRes.json();
      userCountry = geoData.country || 'US';
    }
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://apis.justwatch.com/content/titles/${userCountry.toLowerCase()}/popular?query=${encodeURIComponent(title)}`;
    const jwRes = await fetch(url);
    const jwData = await jwRes.json();
    if (jwData && jwData.items && jwData.items.length > 0) {
      const offers = jwData.items[0].offers || [];
      const providers = {};
      offers.forEach(offer => {
        if (!providers[offer.provider_id]) {
          providers[offer.provider_id] = {
            name: offer.provider_id,
            url: offer.urls && offer.urls.standard_web,
            type: offer.monetization_type
          };
        }
      });
      return res.json({ platforms: Object.values(providers), country: userCountry });
    } else {
      return res.json({ platforms: [], country: userCountry });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Errore JustWatch', details: err.message });
  }
});

// Socket.io base
io.on('connection', (socket) => {
  console.log('Nuovo utente connesso');
  socket.on('disconnect', () => {
    console.log('Utente disconnesso');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
