const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing
app.use(express.json());

// Import routes
const routes = require('./routes');
app.use('/', routes);

// New home route
app.get('/', (req, res) => {
  // Get singles and albums from routes.js
  const { singles, albums } = require('./routes');

  let html = `
    <h1>JUKE Music App</h1>
    <h2>Singles</h2>
    <ul>
      ${singles.map(s => `<li>${s.name} - Streams: ${s.streams}</li>`).join('')}
    </ul>
    <h2>Albums</h2>
    <ul>
      ${albums.map(a => `<li>${a.name} - Streams: ${a.streams}</li>`).join('')}
    </ul>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

