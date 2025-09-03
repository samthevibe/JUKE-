import React from 'react';

function Player() {
  return (
    <div className="player-bar">
      <button>Play</button>
      <input type="range" min="0" max="100" />
      <span>Queue: 0</span>
    </div>
  );
}

export default Player;
