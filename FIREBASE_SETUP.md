# 🔥 Connecting Your GitHub Habit Tracker to Firebase (2 Easy Parts)

## Part 1: Connect Firebase Cloud Database (So Laptop & Phone Sync Live!)
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Create a project** (or select an existing project).
2. In the left sidebar, click **Build → Firestore Database → Create database**:
   - Choose any location (e.g., `asia-south1` Mumbai) and select **Start in test mode** → **Create**.
3. Go to **Project Overview (⚙️ Gear icon) → Project settings → General**:
   - Scroll down to **Your apps**, click the **Web (`</>`)** icon, register an app nickname (e.g. `habit-tracker`), and copy the `firebaseConfig` block:
     ```js
     const firebaseConfig = {
       apiKey: "AIzaSyCHrUNWRnbLRn_9P61rnDm-6rT-ktXyPWs",
       projectId: "daily-habit-tracker-4e555",
       ...
     };
     ```
4. **Paste directly in your app (Zero code edits needed!)**:
   - Open your Habit Tracker app, click the **🔥 Firebase** button at the top (or go to **⚙️ Tools → 🔥 Firebase Cloud Firestore Sync**).
   - Set a **Sync ID** (e.g., `rahul-habits-01`), paste your `firebaseConfig`, and click **🔌 Save & Connect Firebase**!
   - Open the app on your phone, enter the same `firebaseConfig` and **Sync ID**, and click **☁️⬇ Pull from Cloud**—now both devices sync automatically!
   - *(Optional)*: If you don't even want to paste it on each device, put your `apiKey` and `projectId` inside `DEFAULT_FIREBASE_CONFIG` at the top of `app.js` and push to GitHub!

## Part 2: Host on Firebase Hosting Connected to Your GitHub Repo (Optional)
If you also want Firebase to host your app automatically whenever you push to GitHub:
1. In your **Firebase Console**, go to **Build → Hosting → Get started**.
2. In your **VS Code Terminal (`Ctrl+\` `)**, run:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```
3. Select **Use an existing project**, set public directory to `.` (current folder), choose **No** for single-page rewrite, and choose **Yes** to **Set up automatic builds and deploys with GitHub**!
