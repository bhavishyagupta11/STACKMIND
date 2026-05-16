# STACKMIND

> **AI-powered code review workspace for developers who care about code quality.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%202.0-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Overview

STACKMIND is a full-stack code review platform that routes submitted code through Google's Gemini 2.0 Flash model and returns a structured, section-based analysis covering bugs, complexity, security, testing, and more. Each review is stored in MongoDB (or a local JSON file when MongoDB is unavailable), creating a searchable history per user.

The system is designed with resilience in mind: if the primary Gemini API key fails, it automatically retries through OpenRouter. If both AI providers are unreachable, a built-in static analyzer fires rule-based heuristics and still returns a meaningful report to the user.

**Core use cases:**

- Performing deep AI-driven code reviews before pull requests
- Practicing technical interviews with interview-mode explanations and follow-up questions
- Tracking code quality trends over time via per-user review history
- Visualizing algorithmic complexity with an interactive SVG growth graph

---

## Features

### Code Review Engine
- Submit code in 16 languages for AI-driven analysis via Google Gemini 2.0 Flash
- Structured 14-section output: TL;DR, Code Understanding, Risk Hotspots, Bugs, Time & Space Complexity, Optimization Suggestions, Code Quality, Testing, Conventions, Change Walkthrough, Edge Cases, Improved Code, Final Verdict
- **Interview Mode** — adds an interview explanation section and follow-up questions to each review
- **Focus Areas** — narrow the review to Security, Performance, Testing, Readability, or Architecture
- Custom review instructions (up to 2,000 chars) and project context notes (up to 3,000 chars)
- File upload support for all 16 supported languages (500 KB limit) with automatic language detection from the file extension

### Language Intelligence
- Real-time client-side language detection from code content using a weighted signature scoring system (basic + strong pattern tiers)
- Auto-switches the editor language when a high-confidence match is detected (debounced at 450 ms)
- Server-side language mismatch guard — the backend independently detects language and returns HTTP 422 if the selected language does not match
- Inline Monaco editor diagnostics for mismatches and ambiguous detection

### Complexity Visualizer
- Parses the AI-generated complexity section into structured `time` and `space` dimensions
- Renders an SVG growth curve graph comparing current vs. post-optimization complexity
- Bar-based scaling projection for input sizes n = 10, 100, 1,000, 10,000
- Code signal summary: loop count, nested loop detection, recursion detection, and auxiliary structure count
- Supports O(1) through O(n!) with labeled presets, color-coded by severity

### Authentication & User Management
- JWT-based authentication with a 7-day token lifetime
- Password hashing with bcrypt (salt rounds: 12) via a pre-save Mongoose hook
- Profile editing with optional password change, requiring current password verification
- Auth state managed via React Context with localStorage token persistence and automatic `/auth/me` verification on mount
- Route guards (`PrivateRoute` / `PublicRoute`) enforced on the client and JWT middleware on the server

### Review History
- Paginated review history (10 per page) per authenticated user
- Full review detail page — revisit any past review, including the original code, all response sections, and metadata
- Delete individual reviews
- Auto-generated review titles derived from the first meaningful code line

### Dashboard
- At-a-glance stats: total reviews, session reviews, interview reviews
- Quick-action cards navigating to the new review page or full history
- Recent reviews list (last 5) with language, interview-mode badge, and date

### Persistence Modes
The backend can run in two modes, selected at startup:

| Mode | When Used | Storage |
|---|---|---|
| **MongoDB** | `MONGODB_URI` is set and reachable | Atlas / self-hosted MongoDB |
| **Local file** | `USE_LOCAL_STORE=true` or `MONGODB_URI` missing | `backend/data/local-db.json` |

Both modes support the full feature set, making the local mode useful for development without an Atlas connection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend framework** | React 18, Vite 5 |
| **Styling** | Tailwind CSS 3, custom design tokens |
| **Routing** | React Router DOM v6 |
| **Code editor** | Monaco Editor (`@monaco-editor/react`) |
| **State management** | React Context + `useCallback` / `useMemo` |
| **HTTP client** | Axios with request/response interceptors |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Toasts** | react-hot-toast |
| **Syntax highlight** | react-syntax-highlighter |
| **Backend framework** | Node.js, Express 4 |
| **Database** | MongoDB with Mongoose 8 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), bcryptjs |
| **AI Provider (primary)** | Google Gemini 2.0 Flash via `@google/generative-ai` |
| **AI Provider (fallback)** | OpenRouter (Gemini 2.0 Flash 001 model) |
| **Rate limiting** | `express-rate-limit` |
| **Logging** | Morgan |
| **Frontend deployment** | Vercel |
| **Backend deployment** | Render (or any Node.js host) |

---

## Architecture & Workflow

### Request Flow

```
Browser
  └── Axios (JWT Bearer header attached by interceptor)
        └── POST /api/review
              └── rate limiter (10 req / min per IP)
              └── JWT middleware → attaches req.user
              └── reviewController
                    ├── Input validation (code length, field types)
                    ├── Server-side language detection (mismatch → HTTP 422)
                    └── geminiService.analyzeCode()
                          ├── Primary: callGemini() → Google Generative AI SDK
                          │     └── 30 s timeout
                          ├── Fallback 1: callOpenRouter() → OpenRouter REST API
                          │     └── 30 s timeout
                          └── Fallback 2: fallbackAnalysis() → rule-based heuristics
                    └── Persist review → MongoDB or local JSON file
                    └── HTTP 201 with structured review object
  └── ReviewOutput component renders 14 sections
  └── ComplexityVisualizer parses complexity text → SVG graph + projections
```

### Frontend Architecture

- `App.jsx` owns routing and wraps the tree in `AuthProvider` and `BrowserRouter`
- `AuthContext` holds `user`, `token`, `isAuthenticated`, `loading`, `login`, `logout`, `updateUser`
- All pages are lazily loaded via `React.lazy` / `Suspense`
- `Layout.jsx` wraps authenticated pages: collapsible sidebar, sticky header, account dropdown
- `ReviewPage.jsx` manages all review state locally — code, language, focus areas, preferences, and result
- Preferences (focus areas + custom instructions) persist to `localStorage` keyed by `reviewPreferences.v2`

### Language Detection

Two independent detection systems run in parallel:

1. **Client-side** (`languages.js`): Runs debounced on every editor change. Scores each language against basic patterns (weight 1) and strong signatures (weight 2). Triggers an auto-switch toast only on high-confidence detections with a score gap ≥ 2.
2. **Server-side** (`utils/languageDetection.js`): Runs on every `POST /api/review`. If the detected language differs from the submitted language, the request is rejected with HTTP 422 before the AI call.

---

## Folder Structure

```
STACKMIND/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # signup, login, getMe, updateProfile
│   │   ├── historyController.js   # getHistory, getReviewById, deleteReview
│   │   └── reviewController.js    # createReview (AI call + persist)
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   └── errorHandler.js        # Centralized error handler (Mongoose, JWT, generic)
│   ├── models/
│   │   ├── User.js                # Mongoose schema with bcrypt pre-save hook
│   │   └── Review.js              # Review schema with auto-title pre-save hook
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   ├── review.js              # /api/review
│   │   └── history.js             # /api/history/*
│   ├── services/
│   │   ├── geminiService.js       # Gemini → OpenRouter → static fallback chain
│   │   └── localStore.js          # File-backed persistence (local-db.json)
│   ├── data/                      # Auto-created; holds local-db.json in local mode
│   ├── .env.example
│   └── server.js                  # Express app, DB connection, rate limiters
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyzingLoader.jsx      # Animated loading state during AI call
│   │   │   ├── CodeEditor.jsx           # Monaco editor wrapper with diagnostics
│   │   │   ├── CodeSnippet.jsx          # Syntax-highlighted code display
│   │   │   ├── ComplexityVisualizer.jsx # SVG graph + dials + projections
│   │   │   ├── Layout.jsx               # Sidebar + header shell
│   │   │   └── ReviewOutput.jsx         # Renders all 14 review sections
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          # Public marketing page
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx        # Stats + recent reviews
│   │   │   ├── ReviewPage.jsx           # Main review submission UI
│   │   │   ├── HistoryPage.jsx          # Paginated review history
│   │   │   ├── ReviewDetailPage.jsx     # Single past review
│   │   │   └── ProfilePage.jsx          # Profile + password update
│   │   ├── services/
│   │   │   ├── api.js                   # Axios instance with JWT interceptor
│   │   │   ├── authService.js           # Auth API calls
│   │   │   └── reviewService.js         # Review + history API calls
│   │   └── utils/
│   │       ├── AuthContext.jsx          # Auth state, token persistence
│   │       ├── complexity.js            # Complexity parsing + projection math
│   │       └── languages.js             # Language list, detection, diagnostics
│   ├── vercel.json                      # SPA rewrite rule for Vercel
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── package.json                         # Root scripts (install:all, dev:all, etc.)
├── start-dev.ps1                        # PowerShell script to run both servers
└── .gitignore
```

---

## Installation & Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) (free tier available)
- Optional: a **MongoDB Atlas** connection string or `USE_LOCAL_STORE=true` for file-backed local storage

### Clone the Repository

```bash
git clone https://github.com/bhavishyagupta11/STACKMIND.git
cd STACKMIND
```

### Install Dependencies

```bash
# Install both backend and frontend in one command
npm run install:all

# Or install each separately
cd backend && npm install
cd ../frontend && npm install
```

### Configure Environment Variables

**Backend** — create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

**Frontend** — create `frontend/.env` from the example:

```bash
cp frontend/.env.example frontend/.env
```

Edit both files with your actual values (see the [Environment Variables](#environment-variables) section below).

### Run in Development

```bash
# Run both servers concurrently (Windows PowerShell)
npm run dev:all

# Or run separately
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database — leave empty or set USE_LOCAL_STORE=true to use file-backed mode
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/stackmind?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# AI — at least one of the following is required
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
GEMINI_MODEL=gemini-2.0-flash

# Optional: OpenRouter as a secondary AI fallback
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001

# CORS — comma-separated list of allowed frontend origins
CLIENT_URL=http://localhost:5173

# Optional: force local file-backed storage (skips MongoDB entirely)
# USE_LOCAL_STORE=true
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | No* | MongoDB Atlas connection string. If missing, falls back to local JSON mode. |
| `JWT_SECRET` | Yes | Secret used to sign/verify JWTs. Use a long random string in production. |
| `JWT_EXPIRE` | No | JWT lifetime. Defaults to `7d`. |
| `GEMINI_API_KEY` | Yes** | Google AI Studio key. Primary AI provider. |
| `OPENROUTER_API_KEY` | No** | OpenRouter key. Used as secondary AI fallback if Gemini fails. |
| `CLIENT_URL` | Yes (prod) | Comma-separated list of allowed CORS origins. |
| `USE_LOCAL_STORE` | No | Set to `true` to skip MongoDB and use `data/local-db.json`. |

\* Either `MONGODB_URI` or `USE_LOCAL_STORE=true` must be configured.  
\*\* At least one AI key (`GEMINI_API_KEY` or `OPENROUTER_API_KEY`) must be present for live AI reviews. Without either, the static fallback analyzer runs.

### Frontend — `frontend/.env`

```env
# Points to the backend API base URL
VITE_API_URL=http://localhost:5000/api

# Production example:
# VITE_API_URL=https://your-backend.onrender.com/api
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user. Body: `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | Login. Body: `{ email, password }`. Returns JWT. |
| `GET` | `/api/auth/me` | Protected | Returns the authenticated user's profile. |
| `PUT` | `/api/auth/profile` | Protected | Update name, email, and optionally password. |

### Code Review

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/review` | Protected | Submit code for AI review. Rate limited to 10 requests / minute. |

**Request body for `POST /api/review`:**

```json
{
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript",
  "interviewMode": false,
  "focusAreas": ["security", "performance"],
  "customInstructions": "Prioritize async error handling.",
  "contextNotes": "This is part of a Node.js REST API."
}
```

**Response includes:** structured `response` object with all 14 sections, `isFallback`, `providerUsed`, `modelUsed`, `usedBackup`.

### Review History

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/history` | Protected | List user's reviews. Query params: `page`, `limit`. |
| `GET` | `/api/history/:id` | Protected | Get a single review by ID. |
| `DELETE` | `/api/history/:id` | Protected | Delete a review by ID. |

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns server status and timestamp. |

---

## Screenshots / Demo

> _Screenshots and a live demo link will be added here._

| View | Description |
|---|---|
| Review Page | Monaco editor, language selector, focus areas, interview mode toggle |
| Complexity Visualizer | SVG growth graph comparing current vs. optimized complexity |
| Review Output | 14-section structured analysis with code snippet display |
| Dashboard | Stats cards and recent reviews list |
| History | Paginated list of all past reviews |

---

## Challenges & Engineering Decisions

**Resilient AI pipeline with three-tier fallback**  
The Gemini API can fail due to key leaks, quota exhaustion, model deprecation, or network timeouts. Each failure path is caught, classified by message content, and escalated to the next tier (OpenRouter → static analyzer) without the user experiencing a crash. The static analyzer uses regex-based heuristics to still return useful output: nested loop detection, missing error handling, magic numbers, and estimated O-notation.

**Deterministic structured parsing from free-form LLM text**  
Gemini returns Markdown-formatted prose. The prompt enforces emoji section headers (e.g., `🧭 TL;DR Summary`) which act as reliable delimiters. `parseResponse` in `geminiService.js` locates each header's byte offset, slices the raw text between consecutive headers, and strips Markdown artifacts (bold, bullets, code fences) before storing clean plain text in the database.

**Server-side language mismatch detection**  
A backend utility independently detects the language of submitted code and compares it against the user's selection. This prevents the AI from receiving an incorrectly labeled prompt (e.g., C++ code marked as Ruby), which degrades review quality significantly. The check returns HTTP 422 with the detected language so the client can display a precise error.

**Dual-mode persistence without code duplication**  
The `persistenceMode` flag (`mongo` or `local`) is stored on `app.locals` at startup. Every controller checks this flag and routes to either the Mongoose model or the `localStore` service, which reads/writes a single JSON file using Node's `fs` module. Both paths expose the same interface, so controller logic stays clean.

**Client-side complexity graph rendering**  
The `ComplexityVisualizer` component parses the AI-generated complexity string in the browser, maps it to one of 8 preset curves (O(1) through O(n!)), and renders an SVG with 40-point Bézier-style polylines — no charting library required. Optimization suggestions are also parsed to infer a "final" complexity and overlay a second dashed curve on the same graph.

---

## Performance & Optimization

- **Lazy-loaded routes** — every page component is loaded on demand via `React.lazy` and `Suspense`, reducing the initial bundle size.
- **Memoized components** — `Layout`, `DashboardPage`'s `RecentReviewCard`, and `ComplexityVisualizer` are wrapped in `React.memo`. Heavy computations inside them use `useMemo`.
- **Debounced language detection** — client-side language scanning fires 450 ms after the user stops typing, not on every keystroke.
- **Parallel DB queries** — history pagination runs `Review.find()` and `Review.countDocuments()` in parallel via `Promise.all`.
- **Selective field projection** — the history list endpoint excludes the `rawResponse` field (which can be large) using `.select('-rawResponse')`. Only the detail endpoint returns it.
- **Request timeout guardrails** — all AI provider calls are wrapped in a `Promise.race` against a 30-second timeout to prevent the Express event loop from stalling.
- **Indexed review queries** — the `Review` schema indexes `userId`, ensuring per-user history queries do not perform full-collection scans as the reviews table grows.
- **Axios 45-second client timeout** — the frontend client is configured with a 45-second timeout to accommodate AI latency without hanging indefinitely.

---

## Security

- **Passwords** are hashed with bcrypt at salt round 12. The password field is excluded from all Mongoose queries by default (`select: false`) and only fetched explicitly when needed for comparison.
- **JWT tokens** are signed with a secret stored in environment variables and verified on every protected request. Expired or malformed tokens return 401 with a precise message.
- **CORS** is enforced with an explicit allowlist parsed from `CLIENT_URL`. Unlisted origins are rejected.
- **Rate limiting** is applied globally (100 req / 15 min per IP) and more strictly on the AI review endpoint (10 req / min per IP) to prevent abuse and cost overruns.
- **Request body size** is capped at 2 MB at the Express level. Code submissions are additionally capped at 50,000 characters in the controller.
- **Auto-logout** on 401 — the Axios response interceptor removes the stored token and redirects to `/login` when the server returns 401 on an authenticated request.
- **Centralized error handler** normalizes Mongoose validation errors, duplicate-key errors, and JWT errors into consistent JSON responses without leaking stack traces.

---

## Deployment

### Frontend — Vercel

1. Connect the repository to Vercel and set the root directory to `frontend/`.
2. Add the environment variable `VITE_API_URL=https://your-backend.onrender.com/api`.
3. The `vercel.json` rewrite rule routes all paths to `index.html`, supporting client-side React Router navigation.

### Backend — Render (or equivalent)

1. Create a new Web Service pointing to the `backend/` directory.
2. Set the start command to `node server.js`.
3. Add all required environment variables from `backend/.env.example`.
4. Set `CLIENT_URL` to your Vercel frontend URL.
5. MongoDB Atlas: whitelist the Render service's egress IP or allow connections from `0.0.0.0/0`.

**Unified deployment (optional):** If you build the frontend (`npm run build:frontend`) and place the `dist/` folder at `../frontend/dist` relative to the backend, `server.js` will detect and serve it as static files, enabling a single-service deployment.

---

## Future Improvements

- **Diff view** — compare the original submitted code against the AI-generated improved version side by side
- **Multi-file review** — accept a zip or a GitHub repository URL and review the codebase holistically
- **Review sharing** — generate a public read-only link for a review result
- **Webhook / CI integration** — a GitHub Action or GitLab CI step that submits changed files automatically on each pull request
- **Language usage analytics** — aggregate stats on which languages and focus areas a user reviews most
- **Dark mode** — extend the existing design token system with a dark theme variant

---

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against `main`

Please keep pull requests focused. Include relevant tests or usage examples where applicable.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## Author

**Bhavishya Gupta**

- GitHub: [@bhavishyagupta11](https://github.com/bhavishyagupta11)
- Repository: [STACKMIND](https://github.com/bhavishyagupta11/STACKMIND)

---

*Built with Google Gemini 2.0 Flash, React 18, Express, and MongoDB.*
