import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumCard from './components/AlbumCard';
import Player from './components/Player';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/albums').then(res => setAlbums(res.data));
    axios.get('http://localhost:5000/api/singles').then(res => setSingles(res.data));
  }, []);

  const filteredAlbums = albums.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  const filteredSingles = singles.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="App">
      <h1>JUKE Music App</h1>
      <h2>Albums</h2>
      <div className="album-grid">
        {filteredAlbums.map(album => <AlbumCard key={album.id} album={album} />)}
      </div>
      <h2>Singles</h2>
      <div className="album-grid">
        {filteredSingles.map(single => <AlbumCard key={single.id} album={single} />)}
      </div>
      <SearchBar search={search} setSearch={setSearch} />
      <Player />
    </div>
  );
}

export default App;
