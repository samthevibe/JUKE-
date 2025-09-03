// data.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const FILES = {
  albums: path.join(DATA_DIR, 'albums.json'),
  playlists: path.join(DATA_DIR, 'playlists.json'),
  meta: path.join(DATA_DIR, 'meta.json')
};

function read(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Error reading', file, e);
    return fallback;
  }
}
function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let albums = read(FILES.albums, [
  {
    id: 1,
    title: "Evergreen Vibes",
    artist: "Sam The Vibe",
    coverUrl: "",
    releaseDate: "2025-09-01",
    label: "JUKE Records",
    genre: "Hip-Hop/R&B",
    bio: "Debut album featuring smooth beats and chill vibes.",
    features: ["Artist A", "Artist B"],
    tracks: [
      { id: 1, title: "Morning Glow", duration: "3:45", streams: 0, file: "" },
      { id: 2, title: "Midnight Drive", duration: "4:12", streams: 0, file: "" }
    ],
    streams: 0,
    createdAt: new Date().toISOString()
  }
]);

let playlists = read(FILES.playlists, [
  // example playlist structure
  // { id: "uuid", name: "My Playlist", items: [{ albumId, trackId }], createdAt }
]);

let meta = read(FILES.meta, { nextAlbumId: albums.length + 1 });

function saveAll() {
  write(FILES.albums, albums);
  write(FILES.playlists, playlists);
  write(FILES.meta, meta);
}

function addAlbum(album) {
  album.id = meta.nextAlbumId++;
  album.createdAt = new Date().toISOString();
  albums.push(album);
  saveAll();
  return album;
}

function addPlaylist(name) {
  const p = { id: uuidv4(), name: name || `Playlist ${playlists.length + 1}`, items: [], createdAt: new Date().toISOString() };
  playlists.push(p);
  saveAll();
  return p;
}

module.exports = {
  albums,
  playlists,
  meta,
  saveAll,
  addAlbum,
  addPlaylist
};
