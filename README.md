
</details>

---
# 🌌 Celestial AI Astrology

A cinematic, AI-powered spiritual companion that turns your zodiac sign, birth data, and daily mood into deeply personalized cosmic guidance — built with Gemini AI, React, and Firebase.

---

## ✨ What It Does

Most astrology apps serve the same recycled horoscope to every Scorpio on the planet.

**Celestial AI Astrology** works differently: it feeds your zodiac sign, birth details, and current mood directly into a Gemini AI system prompt, generating a fresh, personalized reading every time.

The platform delivers a more interactive and meaningful astrology experience through AI-powered personalization.

---

## 🌠 Core Features

### 🌙 Daily Horoscope
A mood-aware cosmic snapshot regenerated daily with:
- Personalized horoscope insights
- Energy score analysis
- Lunar phase display
- Daily spiritual guidance

### 🔮 The Oracle
An interactive AI chat experience featuring four unique personas:

- **Spiritual Guide** → cosmic wisdom and inner clarity  
- **Love Coach** → relationship advice and emotional insights  
- **Dream Weaver** → symbolic interpretations and imaginative guidance  
- **Life Coach** → motivation, growth, and self-reflection

### 🪐 Birth Chart Reading
A personalized natal chart interpretation based on:
- Zodiac sign
- Birth time
- Birth location

Rendered as a poetic, AI-generated astrological analysis.

### 📖 Celestial Journal
A private reflection space where journal entries are analyzed using AI for:
- Emotional sentiment detection
- Mood insights
- Soul-frequency reflections
- Personal growth tracking

### 💫 Compatibility Analysis
Describe a relationship or personal dynamic and receive:
- Relationship compatibility insights
- Emotional dynamic breakdowns
- Guidance from the AI Love Coach
- A personalized **Harmony Exercise**

---


## 🤖 AI Architecture

All AI logic is server-side in `server.ts`. Four endpoints, each with a tightly controlled system prompt:

| Endpoint | Model | Input | Output |
|---|---|---|---|
| `POST /api/astrology/horoscope` | gemini-3-flash-preview | `sign`, `mood`, `context` | Personalized daily reading + Cosmic Ritual |
| `POST /api/astrology/birthchart` | gemini-3.5-flash | `name`, `zodiacSign`, `birthDate`, `birthTime`, `birthLocation` | Full natal chart: Sun, Moon, Ascendant, Planetary Nodes |
| `POST /api/astrology/affirmation` | gemini-3.5-flash | `sign`, `mood` | Single first-person affirmation, max 25 words |
| `POST /api/astrology/interpret` | gemini-3-flash-preview | `type` (dream/relationship/journal), `content`, `profile` | Symbolic analysis + Soul Lesson or Harmony Exercise |

Every prompt enforces strict output rules — word limits, tone, and structure — so responses always fit cleanly into the UI.

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/celestial-ai-astrology.git
cd celestial-ai-astrology
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```


**4. Start the dev server**
```bash
npm run dev
```

App runs at `http://localhost:3000` — Express backend and Vite dev server start together via `tsx server.ts`.

---

## 🔥 Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password or Anonymous)
3. Enable **Firestore Database**
4. Copy your Firebase config object into `src/lib/firebase.ts`
5. Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Vite + Express) |
| `npm run build` | Build frontend + bundle server for production |
| `npm start` | Run the production build |
| `npm run lint` | TypeScript type check |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | 

> Firebase config lives in `src/lib/firebase.ts`. Never commit real keys — use `.env.local` which is gitignored.

---

## 🚫 Not Included in Repo

These are intentionally excluded — generate them locally:

| Path | Why Excluded | How to Get It |
|---|---|---|
| `node_modules/` | Auto-generated | `npm install` |
| `.env.local` | Contains secrets | Copy from `.env.example` |
| `dist/` | Build output | `npm run build` |

---

## 🔭 Future Improvements

- More astrology personalization
- Improved UI/UX
- Better emotional insights
- Expanded compatibility analysis
- Enhanced journaling features

---

## 👩‍💻 Author

**Mamidala Sathvika**

