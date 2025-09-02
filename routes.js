// routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { albums } = require('./data');

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Home page
router.get('/', (req, res) => {
  let html = `<h1>JUKE Music App</h1><a href="/add-album">Add New Album</a><hr>`;
  
  albums.forEach(album => {
    html += `
      <div style="margin-bottom:20px;">
        ${album.coverUrl ? `<img src="${album.coverUrl}" width="150"/>` : ""}
        <h2>${album.title} - ${album.artist}</h2>
        <p>${album.label} | ${album.genre}</p>
        <p>${album.bio}</p>
        <p>Album Streams: ${album.streams}</p>
        <ul>
          ${album.tracks.map(t => `
            <li>${t.title} - ${t.duration} - Streams: ${t.streams}
              <form style="display:inline" method="POST" action="/albums/${album.id}/tracks/${t.id}/stream">
                <button type="submit">Stream Track</button>
              </form>
            </li>`).join('')}
        </ul>
        <form method="POST" action="/albums/${album.id}/stream">
          <button type="submit">Stream Album</button>
        </form>
      </div>
    `;
  });
  res.send(html);
});

// Add album form
router.get('/add-album', (req, res) => {
  res.send(`
    <h1>Add Album</h1>
    <form action="/albums" method="POST" enctype="multipart/form-data">
      <input name="title" placeholder="Album Title" required/><br/>
      <input name="artist" placeholder="Artist" required/><br/>
      <input name="label" placeholder="Label"/><br/>
      <input name="genre" placeholder="Genre"/><br/>
      <textarea name="bio" placeholder="Album Bio"></textarea><br/>
      <input type="file" name="cover"/><br/>
      <textarea name="tracks" placeholder='Tracks as JSON, e.g. [{"title":"Track 1","duration":"3:30"}]'></textarea><br/>
      <button type="submit">Add Album</button>
    </form>
  `);
});

// Add new album
router.post('/albums', upload.single('cover'), (req, res) => {
  const { title, artist, label, genre, bio, tracks } = req.body;
  const tracksArray = JSON.parse(tracks || "[]").map((t, idx) => ({ id: idx+1, ...t, streams:0 }));
  const id = albums.length + 1;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

  albums.push({ id, title, artist, label, genre, bio, features: [], tracks: tracksArray, streams: 0, coverUrl });
  res.redirect('/');
});

// Stream album (weighted)
router.post('/albums/:id/stream', (req,res)=>{
  const album = albums.find(a=>a.id==req.params.id);
  if(!album) return res.status(404).send("Album not found");

  const totalTrackStreams = album.tracks.reduce((sum,t)=>sum+t.streams,0);
  const maxTrackStreams = Math.max(...album.tracks.map(t=>t.streams),0);

  if(totalTrackStreams>0 && maxTrackStreams/totalTrackStreams>0.8){
    album.streams+=0.2;
  } else {
    album.streams++;
  }

  res.redirect('/');
});

// Stream individual track
router.post('/albums/:albumId/tracks/:trackId/stream', (req,res)=>{
  const album = albums.find(a=>a.id==req.params.albumId);
  if(!album) return res.status(404).send("Album not found");
  const track = album.tracks.find(t=>t.id==req.params.trackId);
  if(!track) return res.status(404).send("Track not found");

  track.streams++;
  res.redirect('/');
});

// Serve uploads
router.use('/uploads', express.static('uploads'));

// Search
router.get('/search', (req,res)=>{
  const q = (req.query.q||'').toLowerCase();
  const results = albums.filter(a=>
    a.title.toLowerCase().includes(q)||
    a.artist.toLowerCase().includes(q)||
    a.label?.toLowerCase().includes(q)||
    a.genre?.toLowerCase().includes(q)||
    a.tracks.some(t=>t.title.toLowerCase().includes(q))
  );
  res.json(results);
});

module.exports = { router };
