
</details>

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

## 📄 License

MIT © 2025 Celestial AI Astrology
