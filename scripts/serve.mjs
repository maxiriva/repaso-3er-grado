// Servidor estático mínimo para desarrollo y tests. Uso: node scripts/serve.mjs [puerto]
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const port = Number(process.argv[2] || process.env.PORT || 8806);
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json", ".svg":"image/svg+xml", ".png":"image/png", ".woff2":"font/woff2", ".md":"text/markdown; charset=utf-8" };

http.createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  if (/^\/(node_modules|tests|scripts|\.)/.test(path)) { res.writeHead(404).end(); return; }
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream", "cache-control": "no-cache" }).end(body);
  } catch { res.writeHead(404).end("no encontrado"); }
}).listen(port, () => console.log(`Repaso 3er grado en http://localhost:${port}`));
