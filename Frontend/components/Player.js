import React, { useState, useEffect } from 'react';

function Player({ track, queue, setCurrentTrack }) {
  const [audio] = useState(new Audio(track.url));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    audio.pause();
    audio.src = track.url;
    audio.load();
    if (playing) audio.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  const togglePlay = () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const nextTrack = () => {
    const currentIndex = queue.findIndex(t => t.id === track.id);
    const next = queue[currentIndex + 1];
    if (next) setCurrentTrack(next);
  };

  return (
    <div className="player-bar">
      <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={nextTrack}>Next</button>
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(e.target.value)} />
      <span>{track.title}</span>
    </div>
  );
}

export default Player;
