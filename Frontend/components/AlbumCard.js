import React from 'react';

function AlbumCard({ album, setCurrentTrack, setQueue }) {
  const handleClick = () => {
    if (album.tracks) {
      setQueue(album.tracks);
      setCurrentTrack(album.tracks[0]);
    } else {
      setQueue([album]);
      setCurrentTrack(album);
    }
  };

  return (
    <div className="album-card" onClick={handleClick}>
      {album.cover && <img src={`http://localhost:5000/uploads/${album.cover}`} alt={album.title} />}
      <h3>{album.title}</h3>
      <p>{album.artist}</p>
    </div>
  );
}

export default AlbumCard;
