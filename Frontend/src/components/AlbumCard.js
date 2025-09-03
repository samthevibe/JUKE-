import React from 'react';

function AlbumCard({ album }) {
  return (
    <div className="album-card">
      {album.cover && <img src={`http://localhost:5000/uploads/${album.cover}`} alt={album.title} />}
      <h3>{album.title}</h3>
      <p>{album.artist}</p>
      <p>Streams: {album.streams}</p>
    </div>
  );
}

export default AlbumCard;
