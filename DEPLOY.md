# Deploying Your Habit Tracker Live from VS Code

## Method 1: GitHub Pages (Free Static Hosting)
1. Open the `habit-tracker-vscode` folder in **VS Code** and open the integrated terminal (`Ctrl+\``).
2. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete Daily Habit Tracker"
   ```
3. Create a new repository on GitHub (e.g., `daily-habit-tracker`) and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/daily-habit-tracker.git
   git push -u origin main
   ```
4. On GitHub, go to **Settings → Pages**, set **Branch** to `main` (`/(root)`), and click **Save**. Your app will be live at `https://<your-username>.github.io/daily-habit-tracker/`!

## Method 2: Instant Deploy with Vercel or Netlify Drop
- Run `npx vercel` inside your VS Code terminal, or drag-and-drop the `habit-tracker-vscode` folder onto Netlify Drop (`https://app.netlify.com/drop`).
