// routes.js
const express = require('express');
const router = express.Router();
const { albums } = require('./data');

// Home page: list albums
router.get('/', (req, res) => {
  let html = `<h1>JUKE Music App</h1>`;
  albums.forEach(album => {
    html += `
      <div style="margin-bottom: 20px;">
        <img src="${album.coverUrl}" alt="${album.title}" width="150"/>
        <h2>${album.title} - ${album.artist}</h2>
        <p><strong>Label:</strong> ${album.label} | <strong>Genre:</strong> ${album.genre}</p>
        <p><strong>Features:</strong> ${album.features.join(', ')}</p>
        <p>${album.bio}</p>
        <p><strong>Album Streams:</strong> ${album.streams}</p>
        <ul>
          ${album.tracks.map(track => `<li>${track.title} - ${track.duration} - Streams: ${track.streams}</li>`).join('')}
        </ul>
      </div>
    `;
  });
  res.send(html);
});

// Get all albums (JSON)
router.get('/albums', (req, res) => res.json(albums));

// Get single album by ID
router.get('/albums/:id', (req, res) => {
  const album = albums.find(a => a.id == req.params.id);
  if (!album) return res.status(404).send("Album not found");
  res.json(album);
});

// Add new album
router.post('/albums', (req, res) => {
  const { title, artist, coverUrl, releaseDate, label, genre, bio, features, tracks } = req.body;
  const id = albums.length + 1;
  const newAlbum = { id, title, artist, coverUrl, releaseDate, label, genre, bio, features, tracks, streams: 0 };
  albums.push(newAlbum);
  res.json(newAlbum);
});

// Stream album
router.post('/albums/:id/stream', (req, res) => {
  const album = albums.find(a => a.id == req.params.id);
  if (!album) return res.status(404).send("Album not found");
  album.streams++;
  res.json(album);
});

// Stream track
router.post('/albums/:albumId/tracks/:trackId/stream', (req, res) => {
  const album = albums.find(a => a.id == req.params.albumId);
  if (!album) return res.status(404).send("Album not found");
  const track = album.tracks.find(t => t.id == req.params.trackId);
  if (!track) return res.status(404).send("Track not found");
  track.streams++;
  res.json(track);
});

// Search albums/tracks by query (title, artist, label, genre)
router.get('/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const results = albums.filter(a =>
    a.title.toLowerCase().includes(query) ||
    a.artist.toLowerCase().includes(query) ||
    a.label.toLowerCase().includes(query) ||
    a.genre.toLowerCase().includes(query) ||
    a.tracks.some(t => t.title.toLowerCase().includes(query))
  );
  res.json(results);
});

module.exports = { router };
