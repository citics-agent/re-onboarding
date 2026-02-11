# How to Share Your Prototype

Since `localhost` only lives on your computer, others can't see it directly. Here are 2 ways to share:

## Option 1: Share on Same Wi-Fi (Quickest)
Best for: Showing a colleague in the same room.

1.  **Stop** the current server (Ctrl + C).
2.  **Run** this command:
    ```bash
    npm run dev -- --host
    ```
3.  It will show a "Network" URL (e.g., `http://192.168.1.5:5173/`).
4.  Send that URL to anyone on the **same Wi-Fi** network.

## Option 2: Publish to Web (Vercel) - **Recommended**
Best for: Sending a link to Sếp Thiện or anyone outside the office. Easiest setup.

1.  **Create a Vercel Account** at [vercel.com](https://vercel.com) (free).
2.  **Run** these commands in your terminal:
    ```bash
    npx vercel
    ```
3.  **Answer the prompts** (mostly just hit Enter):
    *   Set up and deploy? **y**
    *   Which scope? **[Your Name]**
    *   Link to existing project? **n**
    *   Project name? **re-onboarding-app**
    *   Directory? **./**
    *   Want to modify settings? **n**
4.  It will give you a **Production** URL (e.g., `https://re-onboarding-app.vercel.app`).
5.  **Share that link!**

> **Note:** If you use Vercel, don't forget to add your Environment Variables (the Google Sheet URL) in the Vercel Dashboard > Settings > Environment Variables.

## Option 3: GitHub Pages (Free but more steps)
Best for: If you already have the code on GitHub.

1.  **Push your code** to a GitHub repository.
2.  **Install** the deploy helper:
    ```bash
    npm install gh-pages --save-dev
    ```
3.  **Update `vite.config.js`**:
    Add `base: '/REPO_NAME/',` (replace `REPO_NAME` with your repo name).
4.  **Update `package.json`**:
    Add `"deploy": "gh-pages -d dist"` to "scripts".
5.  **Run**:
    ```bash
    npm run build
    npm run deploy
    ```
6.  Your app will be at `https://[username].github.io/[repo-name]/`.
