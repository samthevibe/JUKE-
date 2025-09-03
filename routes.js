// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const mm = require('music-metadata');
const fs = require('fs');
const { albums, playlists, saveAll, addAlbum, addPlaylist } = require('./data');

// helpers
function prettyDuration(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ---- Home page: grid + player + search
router.get('/', (req, res) => {
  // serve a full frontend that calls /api endpoints for dynamic content
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ---- Static API endpoints used by frontend
router.get('/api/albums', (req, res) => {
  // return full albums list (non-sensitive)
  const out = albums.map(a => ({
    ...a,
    // ensure each track has duration string
    tracks: a.tracks.map(t => ({ ...t }))
  }));
  res.json(out);
});

router.get('/api/albums/:id', (req, res) => {
  const album = albums.find(a => a.id == req.params.id);
  if (!album) return res.status(404).send({ error: 'Not found' });
  res.json(album);
});

// Search endpoint (title/artist/track/label/genre)
router.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json(albums);
  const results = albums.filter(a =>
    a.title.toLowerCase().includes(q) ||
    (a.artist && a.artist.toLowerCase().includes(q)) ||
    (a.label && a.label.toLowerCase().includes(q)) ||
    (a.genre && a.genre.toLowerCase().includes(q)) ||
    a.tracks.some(t => t.title.toLowerCase().includes(q))
  );
  res.json(results);
});

// Trending (top tracks & top albums)
router.get('/api/trending', (req, res) => {
  // top albums by streams
  const topAlbums = [...albums].sort((a,b)=>b.streams-a.streams).slice(0,10);
  // top tracks across albums
  const tracks = [];
  albums.forEach(a => a.tracks.forEach(t => tracks.push({ albumId: a.id, albumTitle: a.title, ...t })));
  const topTracks = tracks.sort((a,b)=>b.streams - a.streams).slice(0,10);
  res.json({ topAlbums, topTracks });
});

// Recently added
router.get('/api/recent', (req,res)=>{
  const recent = [...albums].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10);
  res.json(recent);
});

// ---- Uploading albums (covers + mp3s) -- upload handled in index.js and passed multer instance
module.exports = function(upload) {
  // Add album form page
  router.get('/add', (req,res)=>{
    res.sendFile(path.join(__dirname, 'frontend', 'add.html'));
  });

  // handle upload fields: cover (single), tracks (multiple)
  router.post('/api/albums', upload.fields([{ name: 'cover' }, { name: 'tracks' }]), async (req, res) => {
    try {
      const { title, artist, label, genre, bio, features } = req.body;
      const featuresArr = features ? features.split(',').map(s=>s.trim()).filter(Boolean) : [];

      const newAlbum = {
        title: title || 'Untitled',
        artist: artist || 'Unknown',
        coverUrl: '',
        label: label || '',
        genre: genre || '',
        bio: bio || '',
        features: featuresArr,
        tracks: [],
        streams: 0
      };

      // cover
      if (req.files && req.files.cover && req.files.cover[0]) {
        newAlbum.coverUrl = `/uploads/${req.files.cover[0].filename}`;
      }

      // tracks
      if (req.files && req.files.tracks) {
        let idx = 1;
        for (const f of req.files.tracks) {
          // detect duration
          let duration = null;
          try {
            const meta = await mm.parseFile(f.path);
            duration = meta.format.duration; // seconds (float)
          } catch (e) { console.warn('metadata fail', e.message); }
          newAlbum.tracks.push({
            id: idx++,
            title: f.originalname,
            duration: prettyDuration(duration),
            durationSec: duration || 0,
            streams: 0,
            file: f.filename
          });
        }
      }

      const saved = addAlbum(newAlbum);
      res.json(saved);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'upload failed' });
    }
  });

  // ---- stream counting endpoints
  // stream album (counts as album stream; still increments track streams)
  router.post('/api/albums/:id/stream', (req,res)=>{
    const album = albums.find(a=>a.id==req.params.id);
    if(!album) return res.status(404).send({error:'not found'});
    // album-equivalent conversion and weighted logic can be complex. For simplicity store both:
    album.streams++;
    // increment each track a little? we'll not auto-increment track streams here.
    saveAll();
    res.sendStatus(200);
  });

  // stream track (increments track + album influence)
  router.post('/api/albums/:albumId/tracks/:trackId/stream', (req,res)=>{
    const album = albums.find(a=>a.id==req.params.albumId);
    if(!album) return res.status(404).send({error:'not found'});
    const track = album.tracks.find(t=>t.id==req.params.trackId);
    if(!track) return res.status(404).send({error:'not found'});
    track.streams++;
    // album stream update policy: increase album streams by fractional amount
    // simple rule: 12 track streams = 1 album stream
    album.streams += 1/12;
    saveAll();
    res.sendStatus(200);
  });

  // ---- playlists
  router.get('/api/playlists', (req,res)=> res.json(playlists));
  router.post('/api/playlists', (req,res)=>{
    const { name } = req.body;
    const p = addPlaylist(name);
    res.json(p);
  });
  router.post('/api/playlists/:id/add', (req,res)=>{
    const p = playlists.find(x=>x.id==req.params.id);
    if(!p) return res.status(404).send({error:'not found'});
    const { albumId, trackId } = req.body;
    p.items.push({ albumId, trackId });
    saveAll();
    res.sendStatus(200);
  });
  router.post('/api/playlists/:id/remove', (req,res)=>{
    const p = playlists.find(x=>x.id==req.params.id);
    if(!p) return res.status(404).send({error:'not found'});
    const { index } = req.body;
    p.items.splice(index,1);
    saveAll();
    res.sendStatus(200);
  });

  // ---- serve uploads (already done in index.js static handler) but keep route for sanity
  router.get('/uploads/:file', (req,res)=>{
    res.sendFile(path.join(__dirname,'uploads', req.params.file));
  });

  return router;
};
