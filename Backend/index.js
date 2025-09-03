const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make sure uploads folder exists
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// In-memory data
let albums = [];
let singles = [];

// Upload album
app.post('/api/albums', upload.fields([{ name: 'cover' }, { name: 'tracks' }]), (req, res) => {
  const { title, artist, label, bio } = req.body;
  const cover = req.files['cover'][0].filename;
  const tracks = req.files['tracks'].map(file => ({ name: file.originalname, url: `/uploads/${file.filename}`, streams: 0 }));
  
  const album = { id: uuidv4(), title, artist, label, bio, cover, tracks, streams: 0 };
  albums.push(album);
  res.json(album);
});

// Get all albums
app.get('/api/albums', (req, res) => {
  res.json(albums);
});

// Upload single
app.post('/api/singles', upload.single('track'), (req, res) => {
  const { title, artist } = req.body;
  const track = { id: uuidv4(), title, artist, url: `/uploads/${req.file.filename}`, streams: 0 };
  singles.push(track);
  res.json(track);
});

// Get all singles
app.get('/api/singles', (req, res) => {
  res.json(singles);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
