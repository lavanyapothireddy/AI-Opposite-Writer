// server-static.js
// Plain Node.js static file server — serves the Vite build output (dist/)
// No dependency on vite being installed at runtime.

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST      = path.join(__dirname, "dist");
const PORT      = process.env.PORT || 10000;

const MIME = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".mjs":  "application/javascript",
  ".css":  "text/css",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".ico":  "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
};

const server = http.createServer((req, res) => {
  // Strip query string
  let urlPath = req.url.split("?")[0];

  // Resolve file path
  let filePath = path.join(DIST, urlPath);

  // If it's a directory, try index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // If file doesn't exist, serve index.html (SPA client-side routing)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST, "index.html");
  }

  const ext      = path.extname(filePath);
  const mimeType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Internal Server Error");
      return;
    }

    // Cache static assets, no-cache HTML
    const isHTML = ext === ".html" || !ext;
    res.writeHead(200, {
      "Content-Type":  mimeType,
      "Cache-Control": isHTML ? "no-cache" : "public, max-age=31536000",
    });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AI Opposite Writer running on http://0.0.0.0:${PORT}`);
});
