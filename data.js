let albums = [
  {
    id: 1,
    title: "Album 1",
    artist: "Artist A",
    coverUrl: "",
    label: "Indie Label",
    bio: "This is Album 1 bio.",
    streams: 0,
    tracks: [
      { id: 1, title: "Hit Single 1", duration: "3:45", streams: 0, file: "" },
      { id: 2, title: "Track 2", duration: "4:20", streams: 0, file: "" }
    ]
  },
  {
    id: 2,
    title: "Album 2",
    artist: "Artist B",
    coverUrl: "",
    label: "Major Label",
    bio: "This is Album 2 bio.",
    streams: 0,
    tracks: [
      { id: 1, title: "Hit Single 2", duration: "2:55", streams: 0, file: "" },
      { id: 2, title: "Track 2", duration: "3:30", streams: 0, file: "" }
    ]
  }
];

module.exports = albums;
