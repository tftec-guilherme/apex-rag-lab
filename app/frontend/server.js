// Story 06.26 — Lab Inter D06: frontend separado em App Service Linux Node 22.
// Express simples serve Vite build (`dist/`) + SPA fallback para react-router.
// PORT vem da plataforma App Service (process.env.PORT). Em dev local: `npm start`
// usa 8080 por default — mas em dev real use `npm run dev` (Vite + proxy).
//
// Backend (Container App helpsphere-backend) é alcançado pelo browser via
// VITE_BACKEND_URI injetado no build (configurado no Bicep `app-helpsphere-{env}`).
// Este server NÃO faz proxy nem conhece o backend — apenas serve estáticos.
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;
const DIST_DIR = join(__dirname, "dist");

app.use(express.static(DIST_DIR));

// SPA fallback — qualquer rota não-arquivo retorna index.html para o react-router resolver client-side.
app.get("*", (req, res) => {
    res.sendFile(join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
    console.log(`HelpSphere frontend (Story 06.26) serving on port ${PORT}`);
});
