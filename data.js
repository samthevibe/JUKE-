// data.js

let albums = [
  {
    id: 1,
    title: "Evergreen Vibes",
    artist: "Sam The Vibe",
    coverUrl: "https://example.com/evergreen.jpg",
    releaseDate: "2025-09-01",
    label: "JUKE Records",
    genre: "Hip-Hop/R&B",
    bio: "Debut album featuring smooth beats and chill vibes.",
    features: ["Artist A", "Artist B"],
    tracks: [
      { id: 1, title: "Morning Glow", duration: "3:45", streams: 0 },
      { id: 2, title: "Midnight Drive", duration: "4:12", streams: 0 }
    ],
    streams: 0
  },
  {
    id: 2,
    title: "Nightfall Dreams",
    artist: "Sam The Vibe",
    coverUrl: "https://example.com/nightfall.jpg",
    releaseDate: "2025-10-01",
    label: "JUKE Records",
    genre: "R&B/Soul",
    bio: "Smooth night vibes to relax and unwind.",
    features: ["Artist C"],
    tracks: [
      { id: 1, title: "Starry Skies", duration: "4:05", streams: 0 },
      { id: 2, title: "Moonlight Drive", duration: "3:55", streams: 0 }
    ],
    streams: 0
  }
];

module.exports = { albums };

