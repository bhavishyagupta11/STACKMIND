# STACKMIND

A production-quality, full-stack web application for AI-powered code reviews under the STACKMIND brand. Built with React (Vite), Node.js/Express, MongoDB, and Tailwind CSS.

---

## 📸 Features - 

- **Monaco Editor** — VS Code-grade editor with syntax highlighting for 15+ languages
- **File Upload** — Upload `.js`, `.py`, `.java`, `.cpp`, `.ts`, `.go`, `.rs`, and more
- **Structured AI Review** — 8 clearly labeled sections: bugs, complexity, optimizations, verdict, and more
- **Interview Mode** — Toggle to receive interview-style explanations + follow-up questions
- **Review History** — All reviews persisted to MongoDB; browse, revisit, delete
- **JWT Authentication** — Signup/Login with secure hashed passwords
- **Fallback Analyzer** — Rule-based static analysis if Gemini API is unavailable
- **Dark Mode UI** — Polished dark theme with glow effects and smooth animations

---

## 🗂️ Project Structure

```
stackmind/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Signup, Login, GetMe
│   │   ├── reviewController.js     # POST /api/review
│   │   └── historyController.js    # GET/DELETE /api/history
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect middleware
│   │   └── errorHandler.js         # Global error handler
│   ├── models/
│   │   ├── User.js                 # Mongoose User schema
│   │   └── Review.js               # Mongoose Review schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── review.js
│   │   └── history.js
│   ├── services/
│   │   └── geminiService.js        # Gemini API + fallback analyzer
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx           # Sidebar + nav shell
    │   │   ├── CodeEditor.jsx       # Monaco editor wrapper
    │   │   ├── ReviewOutput.jsx     # Structured AI output display
    │   │   └── AnalyzingLoader.jsx  # Animated loading spinner
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ReviewPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   └── ReviewDetailPage.jsx
    │   ├── services/
    │   │   ├── api.js               # Axios instance with interceptors
    │   │   ├── authService.js
    │   │   └── reviewService.js
    │   ├── utils/
    │   │   ├── AuthContext.jsx      # React context for auth state
    │   │   └── languages.js         # Language definitions
    │   ├── App.jsx                  # Router + route guards
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** — Local install or free cloud cluster at https://cloud.mongodb.com
- **Google Gemini API Key** — Free at https://aistudio.google.com/app/apikey

---

## 🚀 Setup Instructions

### Step 1 — Clone / Extract the project

```bash
cd stackmind
```

---

### Step 2 — Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stackmind
JWT_SECRET=replace_with_a_long_random_string_at_least_32_chars
JWT_EXPIRE=7d
GEMINI_API_KEY=your_key_from_aistudio_google_com
NODE_ENV=development
```

> 💡 Get your Gemini API key free at: https://aistudio.google.com/app/apikey

Install dependencies and start:

```bash
npm install
npm run dev      # Development with nodemon
# OR
npm start        # Production
```

Backend runs on: **http://localhost:5000**

You can also start both services together from the repo root:

```bash
npm run dev:all
```

---

### Step 3 — Configure the Frontend

```bash
cd ../frontend
cp .env.example .env
```

The default `.env` works with the dev proxy (no changes needed for local dev):

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start:

```bash
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

### Step 4 — Open the App

Navigate to **http://localhost:5173** in your browser.

1. Click **Get started** to create an account
2. Go to **New Review** in the sidebar
3. Paste code or upload a file
4. Select the language
5. Optionally toggle **Interview Mode**
6. Click **Analyze Code**

---

## 🚀 Deployment

### Recommended setup: Vercel frontend + Render backend + MongoDB Atlas

This is the safest production setup for STACKMIND because the frontend and backend can scale independently.

#### 1) Deploy MongoDB

Use MongoDB Atlas and copy your connection string into the backend environment.

#### 2) Deploy the backend on Render

Set the root directory to `backend` and use:

- Build command: `npm install`
- Start command: `npm start`

Add these environment variables in Render:

```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
```

If you use more than one frontend URL, separate them with commas:

```env
CLIENT_URL=http://localhost:5173,https://your-frontend.vercel.app
```

#### 3) Deploy the frontend on Vercel

Set the root directory to `frontend`.

Add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

The included `frontend/vercel.json` keeps React Router refreshes working on deployed routes like `/login`, `/dashboard`, and `/history/:id`.

#### 4) Update local and deployed URLs

After both services are live, make sure:

- `CLIENT_URL` in the backend matches the deployed frontend URL
- `VITE_API_URL` in the frontend matches the deployed backend URL

---

### Single-service option: Render only

If you want one service only, you can deploy the backend on Render and serve the built frontend from the same Node process.

Use:

- Build command: `cd frontend && npm install && npm run build`
- Start command: `cd backend && npm start`

The backend automatically serves `frontend/dist` when it exists, so the same Render service can host the API and the React app.

## 🔌 API Reference

| Method | Endpoint            | Auth     | Description                        |
|--------|---------------------|----------|------------------------------------|
| POST   | `/api/auth/signup`  | Public   | Register new user                  |
| POST   | `/api/auth/login`   | Public   | Login and receive JWT              |
| GET    | `/api/auth/me`      | Required | Get current user                   |
| POST   | `/api/review`       | Required | Submit code for AI review          |
| GET    | `/api/history`      | Required | Get paginated review history       |
| GET    | `/api/history/:id`  | Required | Get a single review by ID          |
| DELETE | `/api/history/:id`  | Required | Delete a review                    |
| GET    | `/api/health`       | Public   | Server health check                |

---

## 🗄️ Database Schemas

### User
```js
{
  name:      String  (required, 2–50 chars)
  email:     String  (required, unique, lowercase)
  password:  String  (hashed with bcrypt, never returned)
  createdAt: Date
  updatedAt: Date
}
```

### Review
```js
{
  userId:       ObjectId  (ref: User)
  code:         String    (max 50,000 chars)
  language:     String
  interviewMode: Boolean
  response: {
    codeUnderstanding:      String
    bugsIssues:             String
    complexity:             String
    optimizationSuggestions:String
    codeQuality:            String
    edgeCases:              String
    improvedCode:           String
    finalVerdict:           String
    interviewExplanation:   String   (interview mode only)
    followUpQuestions:      String   (interview mode only)
  }
  rawResponse:  String   (raw Gemini output)
  isFallback:   Boolean  (true if Gemini was unavailable)
  title:        String   (auto-derived from first code line)
  createdAt:    Date
}
```

---

## 🤖 Gemini Prompt Used

```
You are a senior software engineer, code reviewer, and technical interviewer.
Analyze the given code and respond ONLY in structured format:

🧠 Code Understanding
❌ Bugs / Issues
⚙️ Time & Space Complexity
🚀 Optimization Suggestions
🧹 Code Quality Review
⚠️ Edge Cases
💡 Improved Code
📊 Final Verdict

[If Interview Mode ON:]
🎤 Interview Explanation
❓ Follow-up Questions

Language: <language>
Interview Mode: <ON/OFF>
Code: <user_code>
```

---

## ⚡ Fallback Analyzer

When Gemini is unavailable, the backend automatically runs a rule-based analysis:

| Rule | Detection |
|------|-----------|
| Nested loops | Warns O(n²) complexity |
| File > 50 lines | Suggests refactoring |
| No try/catch | Missing error handling |
| console.log/print | Debug statements left in |
| Magic numbers | Suggests named constants |
| No null checks | Missing input validation |

---

## 🎨 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| Editor     | Monaco Editor (@monaco-editor/react) |
| Routing    | React Router v6                   |
| HTTP       | Axios with JWT interceptors       |
| Backend    | Node.js, Express                  |
| Database   | MongoDB with Mongoose             |
| Auth       | JWT + bcryptjs                    |
| AI         | Google Gemini 1.5 Flash           |
| Highlights | react-syntax-highlighter          |
| Toasts     | react-hot-toast                   |

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens expire after 7 days
- **Rate limiting**: 100 req/15min globally, 10 reviews/min for AI endpoint
- Password field excluded from all DB queries by default (`select: false`)
- User can only access their own reviews (userId check on every query)
- Input size limit: 50,000 chars for code, 2MB request body

---

## 📝 Viva / Interview Talking Points

1. **Why MongoDB?** — Schema flexibility for varied AI response structures; easy to evolve the review schema
2. **Why JWT over sessions?** — Stateless, scales horizontally, no server-side session store needed
3. **Fallback system** — Shows engineering resilience; app never fully breaks even if external API fails
4. **Rate limiting** — Prevents API abuse, protects Gemini quota
5. **Monaco Editor** — Same engine as VS Code; chosen for language-aware syntax highlighting
6. **Prompt engineering** — Structured emoji-delimited sections allow reliable parsing of LLM output
7. **Interview Mode** — Unique differentiator; transforms a review tool into a learning tool

---

## 🐛 Common Issues

**MongoDB connection failed**
→ Make sure MongoDB is running: `mongod` or use MongoDB Atlas URI
→ If you’re using Atlas, whitelist your current IP in Atlas Network Access
→ If you want to bypass Mongo temporarily for local-only testing, set `USE_LOCAL_STORE=true`

**Gemini API error**
→ Check your `GEMINI_API_KEY` in `.env`. Get one free at https://aistudio.google.com

**CORS error in browser**
→ Ensure `CLIENT_URL` in backend `.env` matches your frontend URL (default: `http://localhost:5173`)

**Monaco editor not loading**
→ Run `npm install` again in the frontend directory; it's a large package

**Signup / login on localhost**
→ In development, the backend falls back to a local file-backed store if MongoDB Atlas is unreachable. Your local data lives in `backend/data/local-db.json`.
