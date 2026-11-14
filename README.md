# Holy Bible App

A responsive Bible reader inspired by your screenshots. Features:
- Old and New Testament book/chapter selectors
- KJV and WEB translation selector (Bible API)
- Search by verse reference (e.g. John 3:16)
- Browser text-to-speech, font size controls, dark/light theme
- Save verses and reflection notes locally
- Firebase email/password login starter

## Run locally
Use VS Code Live Server, or run `python -m http.server 5500` in this folder and open http://localhost:5500.

## Enable Login (Firebase)
1. Create a project at https://console.firebase.google.com/
2. Authentication → Sign-in method → enable **Email/Password**.
3. Project settings → Your apps → Web app → copy Firebase config.
4. Replace `YOUR_API_KEY`, `YOUR_PROJECT`, etc. in `app.js`.
5. Firebase Authentication → Settings → Authorized domains → add your GitHub Pages domain if needed.

## Publish with GitHub Pages
1. Create a GitHub repository named `holy-bible-app`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Repository Settings → Pages → Deploy from branch → `main` → `/ (root)` → Save.
4. Wait for the published URL shown in Pages.

Bible chapter content is loaded from bible-api.com and needs an internet connection. This starter's notes/saved verses are stored in this browser (localStorage); Firebase login is enabled after configuration but does not yet sync notes across devices.
