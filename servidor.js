const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const DIR = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - No encontrado");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });
    res.end(data);
  });
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.log(`⚠️  Puerto ${PORT} ocupado, intentando con otro...`);
    server.listen(0);
  }
});

server.listen(PORT, () => {
  const addr = server.address();
  const url = `http://localhost:${addr.port}`;
  console.log(`\n  ✅ Servidor corriendo en:`);
  console.log(`  └─ ${url}\n`);
});