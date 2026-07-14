# Jem Pet Scanner

Phase 1 of the Jem pet-food barcode scanner PWA: open the camera, read a barcode, show the number on screen. No scoring or database yet — see `docs/plan-app-mascotas-escaner.md` and `docs/rubrica-v1-y-datos.md` for the full roadmap.

## Run it locally

```
npm install
npm run dev
```

Open the printed `http://localhost:5173` link. The barcode scanner needs camera access, which most desktop browsers grant over `http://localhost`; on a phone you'll need HTTPS (see Deploy below).

## Build for production

```
npm run build
npm run preview
```

## Deploy

Push this repo to GitHub, then import it in Vercel (framework preset: Vite). Every push to `main` redeploys automatically.
