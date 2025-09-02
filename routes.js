// Home page with fixed search bar
router.get('/', (req, res) => {
  let html = `
  <html>
  <head>
    <title>JUKE Music App</title>
    <style>
      body { font-family: Arial, sans-serif; margin:0; padding-bottom:60px; }
      .album { margin-bottom: 30px; border-bottom:1px solid #ccc; padding-bottom:10px; }
      .album img { width:150px; display:block; margin-bottom:5px; }
      .search-bar { 
        position: fixed; bottom: 0; left: 0; width: 100%; 
        background: #f0f0f0; padding: 10px; display:flex;
        box-shadow: 0 -2px 5px rgba(0,0,0,0.2);
      }
      .search-bar input { flex:1; padding:8px; font-size:16px; }
      .search-bar button { padding:8px 12px; font-size:16px; margin-left:5px; }
    </style>
  </head>
  <body>
    <h1>JUKE Music App</h1>
    <a href="/add-album">Add New Album</a><hr>
    <div id="albums">`;

  albums.forEach(album => {
    html += `
      <div class="album">
        ${album.coverUrl ? `<img src="${album.coverUrl}"/>` : ""}
        <h2>${album.title} - ${album.artist}</h2>
        <p>${album.label} | ${album.genre}</p>
        <p>${album.bio}</p>
        <p>Album Streams: ${album.streams}</p>
        <ul>
          ${album.tracks.map(t => `
            <li>${t.title} - ${t.duration} - Streams: ${t.streams}
              <form style="display:inline" method="POST" action="/albums/${album.id}/tracks/${t.id}/stream">
                <button type="submit">Stream Track</button>
              </form>
            </li>`).join('')}
        </ul>
        <form method="POST" action="/albums/${album.id}/stream">
          <button type="submit">Stream Album</button>
        </form>
      </div>
    `;
  });

  html += `
    </div>
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="Search albums or tracks..."/>
      <button onclick="searchAlbums()">Search</button>
    </div>
    <script>
      function searchAlbums() {
        const query = document.getElementById('searchInput').value;
        fetch('/search?q=' + encodeURIComponent(query))
          .then(res => res.json())
          .then(data => {
            const albumsDiv = document.getElementById('albums');
            albumsDiv.innerHTML = '';
            data.forEach(album => {
              let tracksHtml = album.tracks.map(t =>
                \`<li>\${t.title} - \${t.duration} - Streams: \${t.streams}</li>\`
              ).join('');
              albumsDiv.innerHTML += \`
                <div class="album">
                  \${album.coverUrl ? '<img src="' + album.coverUrl + '"/>' : ''}
                  <h2>\${album.title} - \${album.artist}</h2>
                  <p>\${album.label} | \${album.genre}</p>
                  <p>\${album.bio}</p>
                  <p>Album Streams: \${album.streams}</p>
                  <ul>\${tracksHtml}</ul>
                </div>
              \`;
            });
          });
      }
    </script>
  </body>
  </html>
  `;

  res.send(html);
});
