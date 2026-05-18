// Story 06.26 v2 — SPA server usando `http` nativo do Node (zero deps runtime).
// Express foi removido: deploy reduzido de ~8min pra ~60s eliminando node_modules
// runtime (sem npm install server-side, sem tar.gz, sem extract).
// Vite build acontece localmente no PC do aluno (azure.yaml prepackage hook).
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = process.env.PORT || 8080;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".map": "application/json; charset=utf-8"
};

const sendFile = (res, filePath, status, statsSize, contentType) => {
    res.writeHead(status, {
        "Content-Type": contentType,
        "Content-Length": statsSize,
        "Cache-Control": status === 200 && filePath.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache"
    });
    createReadStream(filePath).pipe(res);
};

createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method not allowed");
        return;
    }

    // Easy Auth disabled (Story 06.26) — retornar 404 JSON evita SPA fallback
    // mandar HTML pro authConfig.ts → r.json() crash → tela branca.
    if (req.url.startsWith("/.auth/")) {
        const body = JSON.stringify({
            error: "easy_auth_not_active",
            detail: "Easy Auth disabled in Story 06.26 — use MSAL via /auth_setup endpoint on backend."
        });
        res.writeHead(404, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
        res.end(body);
        return;
    }

    const urlPath = req.url.split("?")[0].split("#")[0];
    const safePath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = join(DIST, safePath);

    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const ext = extname(filePath).toLowerCase();
            sendFile(res, filePath, 200, stats.size, MIME[ext] || "application/octet-stream");
            return;
        }
    } catch {
        // not found — SPA fallback
    }

    try {
        const indexPath = join(DIST, "index.html");
        const indexStats = await stat(indexPath);
        sendFile(res, indexPath, 200, indexStats.size, "text/html; charset=utf-8");
    } catch {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("dist/index.html missing — run `npm run build` first");
    }
}).listen(PORT, () => {
    console.log(`HelpSphere frontend (Story 06.26 v2 — http nativo) serving on port ${PORT}`);
});
