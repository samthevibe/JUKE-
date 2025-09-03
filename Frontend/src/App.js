import React, { useState, useEffect } from 'react';
import AlbumCard from './components/AlbumCard';
import Player from './components/Player';
import SearchBar from './components/SearchBar';
import axios from 'axios';

function App() {
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Fetch albums
    axios.get('http://localhost:5000/api/albums')
      .then(res => setAlbums(res.data))
      .catch(err => console.error(err));

    // Fetch singles
    axios.get('http://localhost:5000/api/singles')
      .then(res => setSingles(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredAlbums = albums.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSingles = singles.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>JUKE Music App</h1>

      <h2>Albums</h2>
      <div className="album-grid">
        {filteredAlbums.map(album => (
          <AlbumCard key={album.id} album={album} setCurrentTrack={setCurrentTrack} setQueue={setQueue} />
        ))}
      </div>

      <h2>Singles</h2>
      <div className="album-grid">
        {filteredSingles.map(single => (
          <AlbumCard key={single.id} album={single} setCurrentTrack={setCurrentTrack} setQueue={setQueue} />
        ))}
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {currentTrack && <Player track={currentTrack} queue={queue} setCurrentTrack={setCurrentTrack} />}
    </div>
  );
}

export default App;
