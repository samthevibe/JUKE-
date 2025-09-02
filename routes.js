// routes.js
const express = require('express');
const router = express.Router();

let singles = [
  { id: 1, name: "Hit Single 1", streams: 0 },
  { id: 2, name: "Hit Single 2", streams: 0 }
];

let albums = [
  { id: 1, name: "Album 1", streams: 0 },
  { id: 2, name: "Album 2", streams: 0 }
];

// Home page route
router.get('/', (req, res) => {
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

// ...other routes like /singles, /albums, POST streams

module.exports = { router, singles, albums };

