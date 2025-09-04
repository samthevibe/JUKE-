const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Streaming route
app.get("/stream/:file", (req, res) => {
  const path = `./videos/${req.params.file}`;
  const stat = fs.statSync(path);
  const range = req.headers.range;

  if (!range) {
    res.setHeader("Content-Length", stat.size);
    fs.createReadStream(path).pipe(res);
    return;
  }

  const [start, end] = range.replace(/bytes=/, "").split("-").map(n => n ? +n : stat.size - 1);
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4"
  });

  fs.createReadStream(path, { start, end }).pipe(res);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
