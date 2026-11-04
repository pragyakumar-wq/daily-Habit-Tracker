# Daily Habit Tracker — Full-Stack Edition (Step 8)

## Option A: Run with VS Code Live Server (Front-End Only)
1. Open the `habit-tracker-vscode` folder in **VS Code**.
2. Right-click `index.html` and choose **Open with Live Server**.

## Option B: Run the Full-Stack Node.js Server in VS Code Terminal
1. Open the integrated terminal in VS Code (`Ctrl+\``).
2. Run:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3000` in your browser. Zero `npm install` packages are needed—`server.js` uses built-in `node:http` and `node:fs` modules and exposes `GET /api/habits` and `POST /api/habits` backed by `habits-db.json`!
