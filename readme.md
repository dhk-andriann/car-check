# Car-Check

Application web légère développée avec **HTML**, **CSS**, **Bootstrap** et le bundler **Vite**.

## ▶️ Lancement local (mode développement)

1. Assurez-vous d’avoir **Node.js** installé sur votre machine.
2. Installez les dépendances :

```bash
npm install
```

3. Lancez l’application en mode développement :

```bash
npm run dev
```

4. Ouvrez l’URL affichée dans le terminal (généralement `http://localhost:5173`).

---

## ☁️ Déploiement (mode production)

1. Générez les fichiers de production :

```bash
npm run build
```

2. Les fichiers prêts à être déployés se trouvent dans le dossier `dist`.

3. Vous pouvez :

- Copier le contenu de `dist/` vers un serveur statique (FTP, NAS, etc.)
- Ou publier ce dossier sur **GitHub Pages**, **Netlify**, **Vercel**, etc.

> 💡 Pour GitHub Pages avec [`vite-plugin-gh-pages`](https://www.npmjs.com/package/vite-plugin-gh-pages), voir la documentation officielle.

---

## ✅ Stack utilisée

- HTML / CSS
- [Bootstrap 5](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/) – bundler ultra-rapide
