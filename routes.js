const express = require('express');
let albums = require('./data');

module.exports = (upload) => {
  const router = express.Router();

  // Homepage with MP3 player + search
  router.get('/', (req, res) => {
    let html = `
    <html>
    <head>
      <title>JUKE Music App</title>
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding-bottom:120px; background:#f9f9f9; }
        h1 { text-align:center; }
        .grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding:20px; }
        .album-card { background:white; border-radius:10px; padding:15px; width:200px; box-shadow:0 2px 6px rgba(0,0,0,0.2); display:flex; flex-direction:column; align-items:center; }
        .album-card img { width:150px; height:150px; object-fit:cover; border-radius:5px; margin-bottom:10px; }
        .album-card h2 { font-size:16px; margin:5px 0 2px 0; text-align:center; }
        .album-card p { font-size:12px; margin:2px 0; text-align:center; }
        .album-card button { margin-top:5px; padding:6px 10px; font-size:12px; cursor:pointer; border:none; border-radius:5px; background:#1db954; color:white; }
        .album-card ul { padding-left:20px; font-size:12px; list-style-type: disc; width:100%; }
        .album-card li { margin-bottom:4px; }
        .search-bar { position: fixed; bottom: 60px; left: 0; width: 100%; background: #fff; padding: 10px; display:flex; box-shadow: 0 -2px 5px rgba(0,0,0,0.2); }
        .search-bar input { flex:1; padding:8px; font-size:16px; }
        .search-bar button { padding:8px 12px; font-size:16px; margin-left:5px; background:#1db954; color:white; border:none; border-radius:5px; cursor:pointer; }
        .player { position: fixed; bottom:0; left:0; width:100%; background:#222; color:white; padding:10px; display:flex; align-items:center; justify-content:space-between; }
        .player button, .player input[type=range] { margin:0 5px; }
        .queue { font-size:12px; max-height:60px; overflow-y:auto; }
      </style>
    </head>
    <body>
      <h1>JUKE Music App</h1>
      <a href="/add-album" style="display:block;text-align:center;margin-bottom:10px;">Add New Album</a>
      <div class="grid" id="albums"></div>

      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search albums or tracks..."/>
        <button onclick="searchAlbums()">Search</button>
      </div>

      <!-- Music Player -->
      <div class="player">
        <div>
          <button onclick="prevTrack()">⏮️</button>
          <button onclick="togglePlay()">▶️/⏸️</button>
          <button onclick="nextTrack()">⏭️</button>
        </div>
        <div style="flex:1; margin:0 10px;">
          <strong id="nowPlaying">No track playing</strong>
          <div class="queue" id="queue"></div>
        </div>
        <div>
          🔊 <input type="range" id="volume" min="0" max="1" step="0.05" value="1" onchange="setVolume(this.value)">
        </div>
        <audio id="audioPlayer" controls style="display:none;"></audio>
      </div>

      <script>
        let queue = [];
        let currentIndex = 0;
        const audioPlayer = document.getElementById('audioPlayer');
        const nowPlaying = document.getElementById('nowPlaying');
        const queueDiv = document.getElementById('queue');

        // Load albums
        function loadAlbums() {
          fetch('/search?q=')
            .then(res=>res.json())
            .then(renderAlbums);
        }

        function renderAlbums(albums) {
          const albumsDiv = document.getElementById('albums');
          albumsDiv.innerHTML = '';
          albums.forEach(album => {
            let tracksHtml = album.tracks.map(t => 
              \`<li>\${t.title} - \${t.duration} - Streams: \${t.streams} 
                <button onclick="addToQueue('\${t.title}', '/uploads/\${t.file}')">Play</button>
                <button onclick="streamTrack(\${album.id},\${t.id})">Stream</button>
              </li>\`
            ).join('');
            albumsDiv.innerHTML += \`
              <div class="album-card">
                \${album.coverUrl ? '<img src="' + album.coverUrl + '"/>' : ''}
                <h2>\${album.title}</h2>
                <p>\${album.artist}</p>
                <p>\${album.label}</p>
                <p>\${album.bio}</p>
                <p>Streams: <span id="album-stream-\${album.id}">\${album.streams}</span></p>
                <ul>\${tracksHtml}</ul>
                <button onclick="streamAlbum(\${album.id})">Stream Album</button>
              </div>
            \`;
          });
        }

        function searchAlbums() {
          const query = document.getElementById('searchInput').value;
          fetch('/search?q=' + encodeURIComponent(query))
            .then(res=>res.json())
            .then(renderAlbums);
        }

        // Queue system
        function addToQueue(title, file) {
          queue.push({title, file});
          updateQueue();
          if (queue.length === 1) {
            playTrack(0);
          }
        }

        function playTrack(index) {
          if (index < 0 || index >= queue.length) return;
          currentIndex = index;
          audioPlayer.src = queue[index].file;
          audioPlayer.play();
          nowPlaying.textContent = "Now Playing: " + queue[index].title;
          updateQueue();
        }

        function nextTrack() {
          if (currentIndex < queue.length-1) {
            playTrack(currentIndex+1);
          }
        }

        function prevTrack() {
          if (currentIndex > 0) {
            playTrack(currentIndex-1);
          }
        }

        function togglePlay() {
          if (audioPlayer.paused) {
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }
        }

        function setVolume(val) {
          audioPlayer.volume = val;
        }

        function updateQueue() {
          queueDiv.innerHTML = queue.map((t,i) =>
            \`<div style="color:\${i===currentIndex?'#1db954':'white'}">\${i+1}. \${t.title}</div>\`
          ).join('');
        }

        function streamTrack(albumId, trackId) {
          fetch(\`/albums/\${albumId}/tracks/\${trackId}/stream\`, { method:'POST' })
            .then(()=>loadAlbums());
        }

        function streamAlbum(albumId) {
          fetch(\`/albums/\${albumId}/stream\`, { method:'POST' })
            .then(()=>loadAlbums());
        }

        loadAlbums();
      </script>
    </body>
    </html>
    `;
    res.send(html);
  });

  // Add album form
  router.get('/add-album', (req, res) => {
    res.send(`
      <html>
      <body>
        <h1>Add Album</h1>
        <form action="/add-album" method="post" enctype="multipart/form-data">
          Title: <input type="text" name="title" required/><br/>
          Artist: <input type="text" name="artist" required/><br/>
          Label: <input type="text" name="label"/><br/>
          Bio: <textarea name="bio"></textarea><br/>
          Cover: <input type="file" name="cover"/><br/>
          Track MP3s: <input type="file" name="tracks" multiple/><br/>
          <button type="submit">Add Album</button>
        </form>
      </body>
      </html>
    `);
  });

  // Handle album upload
  router.post('/add-album', upload.fields([{ name: 'cover' }, { name: 'tracks' }]), (req, res) => {
    const newAlbum = {
      id: albums.length+1,
      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label || "",
      bio: req.body.bio || "",
      coverUrl: req.files['cover'] ? '/uploads/' + req.files['cover'][0].filename : "",
      streams: 0,
      tracks: []
    };

    if (req.files['tracks']) {
      newAlbum.tracks = req.files['tracks'].map((file, idx) => ({
        id: idx+1,
        title: file.originalname,
        duration: "3:00", // placeholder
        streams: 0,
        file: file.filename
      }));
    }

    albums.push(newAlbum);
    res.redirect('/');
  });

  // Stream album
  router.post('/albums/:id/stream', (req, res) => {
    const album = albums.find(a => a.id == req.params.id);
    if (album) {
      album.streams++;
      album.tracks.forEach(t => t.streams++);
    }
    res.sendStatus(200);
  });

  // Stream track
  router.post('/albums/:albumId/tracks/:trackId/stream', (req, res) => {
    const album = albums.find(a => a.id == req.params.albumId);
    if (album) {
      const track = album.tracks.find(t => t.id == req.params.trackId);
      if (track) {
        album.streams++;
        track.streams++;
      }
    }
    res.sendStatus(200);
  });

  // Search
  router.get('/search', (req, res) => {
    const q = req.query.q?.toLowerCase() || "";
    const results = albums.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.tracks.some(t => t.title.toLowerCase().includes(q))
    );
    res.json(results);
  });

  return router;
};


      function streamTrack(albumId, trackId) {
        fetch(\`/albums/\${albumId}/tracks/\${trackId}/stream\`, { method:'POST' })
          .then(()=>loadAlbums());
      }

      function streamAlbum(albumId) {
        fetch(\`/albums/\${albumId}/stream\`, { method:'POST' })
          .then(()=>loadAlbums());
      }

      loadAlbums();
    </script>
  </body>
  </html>
  `;
  res.send(html);
});
