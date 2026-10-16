<div align="center">

# 🔗 URL Shortener

**A modern, full-stack URL shortener with click analytics**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Transform long, unwieldy links into short, shareable URLs — and track every click with built-in analytics.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- ⚡ **Instant Shortening** — Turn any long URL into a compact 8-character ID using `nanoid`
- 📊 **Click & Copy Analytics** — Track total clicks *and* copies, plus a clean click-by-click history timeline for every short link
- 🕰️ **URL History** — Browse recently shortened links with live click & copy stats, one click away from copying again
- 📋 **One-Click Copy** — Copy the shortened URL to your clipboard with a single click
- 🎨 **Clean Modern UI** — Minimal, responsive interface built with Tailwind CSS 4
- 🔀 **Seamless Redirects** — Fast redirects that automatically record every visit
- ✅ **Input Validation** — URL and shortId validation with clear, friendly error messages
- 🧩 **Clean Architecture** — Well-separated routes, controllers, models, and DB layers

## 🛠 Tech Stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Frontend  | Next.js 16 (App Router), React 19, Tailwind CSS 4                |
| Backend   | Node.js, Express 5                                              |
| Database  | MongoDB (MongoDB Atlas) via Mongoose 9                           |
| ID Engine | [nanoid](https://github.com/ai/nanoid) — collision-resistant IDs |
| Dev Tools | Nodemon (auto-reload), ESLint, PostCSS                           |


## 📁 Project Structure

```
URL_shortner/
├── backend/
│   ├── controllers/
│   │   └── url.js          # Shorten + analytics handlers
│   ├── DB/
│   │   └── connect.js      # MongoDB connection helper
│   ├── models/
│   │   └── url.js          # Mongoose URL schema
│   ├── routes/
│   │   └── url.js          # /api/url routes
│   ├── .env                # Environment variables (not committed)
│   ├── index.js            # Express app entry point
│   └── package.json
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Analytics.jsx      # Analytics lookup + visit history UI
    │   │   ├── Header.jsx         # Page header
    │   │   ├── History.jsx        # Recent links list + per-link stats
    │   │   ├── ShortenedURL.jsx   # Result display + copy button
    │   │   └── URLForm.jsx        # URL input form
    │   ├── globals.css
    │   ├── layout.js              # Root layout + metadata
    │   └── page.js                # Home page (client component)
    ├── next.config.mjs     # Rewrites /api/* → backend
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A MongoDB instance — local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HarshDeshmukh2201/URL-shortner.git
cd URL_shortner
```

### 2️⃣ Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=9000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Start the server:

```bash
npm start
# ➜ Server started at http://localhost:9000
```

### 3️⃣ Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — the app is live! 🎉

> 💡 The frontend proxies all `/api/*` requests to the backend on port `9000` via a rewrite rule in `next.config.mjs`, so no CORS configuration is needed in development.


## 📡 API Reference

### `POST /api/url` — Create a short URL

**Request**

```http
POST /api/url
Content-Type: application/json

{ "url": "https://www.example.com/very/long/path?with=parameters" }
```

**Response** `201 Created`

```json
{
  "shortId": "V1StGXR8_Z5",
  "message": "URL created successfully"
}
```

### `GET /api/url/analytics?shortId=<shortId>` — Get click analytics

**Response** `200 OK`

```json
{
  "shortId": "V1StGXR8_Z5",
  "totalClick": 3,
  "analytics": [
    { "timestamp": 1718000000000 },
    { "timestamp": 1718008642000 },
    { "timestamp": 1718017284000 }
  ],
  "totalCopies": 2,
  "copyHistory": [
    { "timestamp": 1718005000000 },
    { "timestamp": 1718012000000 }
  ]
}
```

### `POST /api/url/copy` — Track a copy event

Recorded automatically when a user clicks the **Copy** button in the UI.

**Request**

```http
POST /api/url/copy
Content-Type: application/json

{ "shortId": "V1StGXR8_Z5" }
```

**Response** `200 OK`

```json
{
  "shortId": "V1StGXR8_Z5",
  "totalCopies": 3,
  "message": "Copy tracked successfully"
}
```

### `GET /api/url/history` — List recently created short URLs

Returns the latest short links (newest first), each with live click & copy counts. Supports an optional `?limit=` (default 15, max 50).

**Response** `200 OK`

```json
{
  "count": 2,
  "urls": [
    {
      "shortId": "V1StGXR8_Z5",
      "redirectURL": "https://www.example.com/very/long/path",
      "totalClick": 3,
      "totalCopies": 2,
      "createdAt": "2026-10-16T09:30:00.000Z"
    },
    {
      "shortId": "aB3xY9qw",
      "redirectURL": "https://github.com/HarshDeshmukh2201/URL-shortner",
      "totalClick": 1,
      "totalCopies": 0,
      "createdAt": "2026-10-16T08:15:00.000Z"
    }
  ]
}
```

### `GET /:shortId` — Redirect to the original URL

```http
GET /V1StGXR8_Z5
```

Redirects to the stored URL and records a visit in the history. Returns `404` if the shortId does not exist.

### Error Format

| Status | Meaning                | Example body                            |
| ------ | ---------------------- | --------------------------------------- |
| `400`  | Missing required field | `{ "error": "url is required" }`        |
| `404`  | Short URL not found    | `{ "error": "URL not found" }`          |
| `500`  | Server error           | `{ "error": "Internal server error" }`  |

## 🔍 How It Works

1. **Shorten** — The frontend sends the long URL to `POST /api/url`. The backend generates a unique 8-character ID with `nanoid` and stores `{ shortId, redirectURL, visitHistory }` in MongoDB.
2. **Redirect** — Visiting `/:shortId` looks up the entry, appends a timestamp to `visitHistory`, and redirects the user to the original URL.
3. **Analyze** — Entering a shortId in the Analytics card fetches the total click count and the complete visit history.

## ☁️ Deployment (Vercel)

The backend is Vercel-ready — the Express app is exported as a serverless function (`backend/api/index.js` + `backend/vercel.json`), while still running as a normal server locally with `npm start`.

### 1️⃣ Push to GitHub

```bash
git add .
git commit -m "Deploy-ready backend"
git push
```

### 2️⃣ Deploy the backend

1. [Vercel](https://vercel.com) → **Add New… → Project** → import this repo
2. In **Project Settings → General**, set **Root Directory** to `backend`
3. Add environment variable: `MONGO_URI` = your MongoDB Atlas connection string
4. Deploy → copy the deployment URL (e.g. `https://url-shortner-api.vercel.app`)

> 💡 **MongoDB Atlas:** add `0.0.0.0/0` ("Allow Access From Anywhere") to the IP Access List — Vercel serverless IPs are dynamic.

### 3️⃣ Deploy the frontend

1. Vercel → **Add New… → Project** → import the **same repo** again
2. Set **Root Directory** to `frontend`
3. Add environment variables (both = the backend URL from step 2):
   - `API_URL` — server-side `/api/*` rewrite target
   - `NEXT_PUBLIC_API_URL` — short links & copy buttons in the UI
4. Deploy. Done! 🎉

Your short links now look like `https://url-shortner-api.vercel.app/V1StGXR8_Z5`.

> ⚠️ **Security reminder:** `backend/.env` is committed to git with real credentials. Rotate the Atlas password, run `git rm --cached backend/.env`, and keep `MONGO_URI` only in Vercel's environment settings.

> 💡 **Cold starts:** Vercel's free tier puts serverless functions to sleep after inactivity — the first request after idle may take ~1–3 seconds. Prefer a always-on host? Deploy `backend/` to [Render](https://render.com) as a Web Service (start command `npm start`) — the code works there unchanged.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo, open an issue, or submit a pull request.

```bash
git checkout -b feature/awesome-feature
git commit -m "Add awesome feature"
git push origin feature/awesome-feature
```

## 📄 License

This project is licensed under the [ISC](https://opensource.org/licenses/ISC) License.

---

<div align="center">

**Built with ❤️ by [Harsh Deshmukh](https://github.com/HarshDeshmukh2201)**

⭐ Star this repo if you found it helpful!

</div>
