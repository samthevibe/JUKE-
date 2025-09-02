// routes.js
const express = require('express');
const router = express.Router();

// Temporary data storage
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

// Increment single streams
router.post('/single/:id/stream', (req, res) => {
  const single = singles.find(s => s.id == req.params.id);
  if (!single) return res.status(404).send("Single not found");
  single.streams++;
  res.send(single);
});

// Increment album streams
router.post('/album/:id/stream', (req, res) => {
  const album = albums.find(a => a.id == req.params.id);
  if (!album) return res.status(404).send("Album not found");
  album.streams++;
  res.send(album);
});

// Get all singles
router.get('/singles', (req, res) => {
  res.json(singles);
});

// Get all albums
router.get('/albums', (req, res) => {
  res.json(albums);
});

module.exports = { router, singles, albums };
