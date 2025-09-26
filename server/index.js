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
  const { title, country = 'IT' } = req.query;
  if (!title) return res.status(400).json({ error: 'Titolo richiesto' });
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://apis.justwatch.com/content/titles/${country.toLowerCase()}/popular?query=${encodeURIComponent(title)}`;
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
      return res.json({ platforms: Object.values(providers) });
    } else {
      return res.json({ platforms: [] });
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
