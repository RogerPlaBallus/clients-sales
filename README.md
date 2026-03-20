<img width="1918" height="909" alt="ClientsVendes screenshot 1" src="https://github.com/user-attachments/assets/3f76aa05-4c4e-433d-9f43-a46ec6c20e2b" />
<img width="1902" height="898" alt="ClientsVendes screenshot 2" src="https://github.com/user-attachments/assets/e8788cd3-925a-4d18-a47c-0dd2f7696090" />
<img width="981" height="879" alt="ClientsVendes screenshot 3" src="https://github.com/user-attachments/assets/e4880cff-dae5-4f59-b648-43c4e9504059" />
<img width="1220" height="422" alt="ClientsVendes screenshot 4" src="https://github.com/user-attachments/assets/6c0ed483-7d79-4961-95c3-3e8e9e9307d2" />

# ClientsVendes Portfolio Demo

Static portfolio version of the original ClientsVendes project.

## What changed for deployment

- The app now runs as a plain static site and is ready to deploy on Vercel.
- `Clients.db` is used only as bundled seed data on first load.
- All create, update and delete actions happen inside the current browser only.
- The deployed `.db` file is never modified.
- Browser changes are persisted locally with IndexedDB, so each visitor gets a private working copy.
- Users can export their current browser snapshot or reset the demo back to the bundled database.

## Vercel deployment

This repository includes a `vercel.json` configuration that:

- forces the project to use the `Other` framework preset
- skips dependency installation
- serves the project root as the output directory

Deploy steps:

1. Import the repository into Vercel.
2. Keep the project root as the root directory.
3. Deploy.

No server, database service, or environment variables are required for the portfolio version.

## Local preview

Run the site with any static file server, for example:

```bash
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Project structure

- `index.html`, `styles.css`, `script.js`: main portfolio UI
- `db-browser.js`: in-browser SQLite layer powered by sql.js
- `Clients.db`: bundled read-only seed database
- `translations.js`: interface translations
- `server.js`: legacy local Express backend kept only for reference

## Notes

- The original Node/Express implementation is still in the repo for archival/reference purposes, but it is not used by the Vercel portfolio deployment.
- `DATABASE_DOCUMENTATION.md` describes the original schema and server-side API model; the deployed portfolio runtime is browser-only.
