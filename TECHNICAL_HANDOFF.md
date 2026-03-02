# CACN Re-Onboarding App — Technical Handoff

> **Last updated**: 2 March 2026 | **Author**: L&D Team (Jayden)

---

## 1. Project Overview

This is a **web-based interactive onboarding/quiz flow** for internal CACN staff — not a static landing page. It is a multi-step app that:

1. Collects employee info (name, employee ID, store)
2. Fetches quiz questions live from **Google Sheets** (via Google Apps Script)
3. Submits results back to Google Sheets upon completion

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 + Vite 7 | UI framework & build tool |
| Styling | Tailwind CSS v3 + `clsx` | Utility-first styling |
| Animation | Framer Motion | Screen transitions & micro-animations |
| Icons | Lucide React | Icon set |
| Data Layer | Google Apps Script (GAS) | Lightweight backend API (GET questions / POST results) |
| Deployment | GitHub Pages (`gh-pages`) | Static hosting |

---

## 3. Repository Structure

```
re-onboarding-app/
├── src/
│   ├── App.jsx              # Main app — state machine, screen routing
│   ├── components/
│   │   ├── screens/         # Each step of the flow (Welcome, Quiz, Result…)
│   │   ├── ui/              # Reusable UI primitives (Button, Card…)
│   │   └── layout/          # Layout wrappers
│   ├── services/
│   │   └── api.js           # All API calls: fetchQuestions() & submitData()
│   ├── data/                # Local fallback question bank (JSON)
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── public/                  # Static assets (logo, favicon…)
├── .env                     # ⚠️ Environment variables — NOT committed to git
├── .env.example             # Template for env vars — commit this
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 4. Environment Variables

Create a `.env` file inside `re-onboarding-app/`. Use `.env.example` as reference:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/[YOUR_DEPLOYMENT_ID]/exec
```

> ⚠️ **All Vite env vars must be prefixed with `VITE_`** to be accessible in browser code. Do **not** store secrets here.

---

## 5. Data Flow

```
[User opens app]
      │
      ▼
[App.jsx] ──── fetchQuestions() ─── GET ──► [Google Apps Script Web App]
                                                        │
                                           Reads "Question Bank" tab
                                           from Google Sheet
                                                        │
                                           Returns structured JSON
      ◄─────────────────────────────────────────────────┘

[User completes quiz]
      │
      ▼
[App.jsx] ──── submitData() ─── POST ──► [Google Apps Script Web App]
                                                  │
                                      Writes result row to
                                      "Results" tab in Google Sheet
```

**Fallback behavior**: If `VITE_GOOGLE_SCRIPT_URL` is not set → app uses local JSON from `src/data/` and logs to console (dev mode only, no data is lost).

---

## 6. Google Apps Script — The Backend

The GAS Web App is deployed as a public REST endpoint:

| Method | Endpoint | Action |
|---|---|---|
| `GET` | `/exec` | Returns question bank as JSON |
| `POST` | `/exec` | Accepts quiz submission, writes to Google Sheet |

### Expected POST Payload

```json
{
  "employeeId": "EMP001",
  "name": "Nguyen Van A",
  "store": "Anphu",
  "score": 10,
  "total": 12,
  "passed": true,
  "timestamp": "2026-03-02T00:00:00+07:00"
}
```

### How to get / update the Script URL

1. Open the linked **Google Sheet**
2. Go to **Extensions → Apps Script**
3. Click **Deploy → Manage Deployments** (or New Deployment)
4. Set type to **Web App**, access to **Anyone**
5. Copy the `/exec` URL → paste into `.env`

---

## 7. Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Navigate to the app folder
cd "re-onboarding-app"

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Open .env and paste your Google Apps Script URL

# 4. Start dev server
npm run dev
# → Runs at http://localhost:5173
```

---

## 8. Deployment (GitHub Pages)

```bash
npm run deploy
```

This runs `vite build` (outputs to `dist/`) then pushes `dist/` to the `gh-pages` branch automatically via the `gh-pages` npm package.

> **Note**: `vite.config.js` has `base: '/'`. If the repo is hosted at a subpath (e.g. `username.github.io/repo-name/`), change `base` to `'/repo-name/'`.

---

## 9. Key Files Reference

| File | Role |
|---|---|
| `src/App.jsx` | Central state machine — controls which screen renders |
| `src/services/api.js` | All API logic — the only file to touch for data layer changes |
| `src/data/` | Local fallback questions — update for offline/dev testing |
| `.env` | Single config point — swap URL here to redirect to a different GAS |

---

## 10. Updating Questions (No Code Required)

Questions are stored in **Google Sheets** (source of truth). The app fetches fresh questions on every load.

**To add/edit/remove questions:**
1. Open the Google Sheet linked to this project
2. Edit the **Question Bank** tab
3. ✅ Done — no code deployment needed

---

## 11. Contact

| Role | Name |
|---|---|
| L&D / Project Owner | Jayden Pham (internal) |
| App Architecture | Antigravity AI Agent |
