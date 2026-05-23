# Celestial AI Astrology: Cosmic Resonance Alignment Portal

**Celestial AI Astrology** is an immersive, spiritually resonant web application that blends professional modern astronomy/astrology rules with sophisticated Generative AI. Guided by the Gemini AI system, the platform allows seekers to calculate zodiac mathematical synastries, receive poetic and action-oriented daily readings, decode subconscious dreams, and catalog spiritual frequencies inside a permanent celestial log.

---

## 🌟 Core Features

- 🌌 **Immersive Cosmological background**: An interactive, dynamic HTML5 starfield overlay with real-time sinusodial twinkling coordinates and background drift nebulae.
- 🔮 **The Oracle Chat System**: A specialized four-personality dialogue center (Spiritual Guide, Love Coach, Dream Weaver, Life Coach) powered by strict system-instructions using the modern Google GenAI SDK.
- ☀️ **Astrophysical Onboarding Flow**: Implements direct date-range astronomical calculation algorithms to resolve the user's correct Sun zodiac sign derived from precise calendar coordinates.
- 📜 **Cosmic Synastry (Relationship Compatibility)**: Full elemental synastry matching engine measuring Fire, Earth, Air, and Water alignments before feeding insights into the relational love oracle model.
- ✍️ **Celestial Record Journal**: A daily reflective journal connected seamlessly with Firestore and augmented with dynamic subconscious translations using the `/api/astrology/interpret` engine.
- 🎟️ **Luxury Premium Paywall Subscription**: Gated interaction walls configured inside our global UI store representing simulated high-end enterprise monetization paths.

---

## 🛠️ Technological Stack

* **Frontend Framework**: React 18+ with TypeScript
* **Build tool**: Vite + Tailwind CSS for styling
* **Animations Engine**: `motion` layout and spring transitions (Framer Motion)
* **Icons Library**: Lucide React
* **Backend Runtime**: Node.js + Express
* **Database & Auth**: Google Firebase (Firestore Database, Firebase Authentication)
* **Generative Intelligent Model**: `@google/genai` (SDK) configured securely on the backend running `gemini-3-flash-preview`.

---

## 🚀 Setup & Local Installation

1. **Clone the repository** and navigate to your workspace.
2. **Install all dependencies** from the package registry:
   ```bash
   npm install
   ```
3. **Configure Environment Secrets**:
   Create a `.env` or `.env.local` file at the root of the project directory. Declare your private Google Gemini API key:
   ```env
   GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
   ```
4. **Boot Up the Development Server**:
   Start both Vite frontend compilation and the Express server in a single hot-reload process:
   ```bash
   npm run dev
   ```
5. **Access the application**: Open your web browser and navigate to `http://localhost:3000`.

---

## 🧠 Astrological GenAI Architecture

The application isolates API keys entirely on the Node.js server (`server.ts`) to prevent client-side credential exposure. Two primary REST routes process astrological readings:

### 1. `/api/astrology/horoscope`
Accepts `sign`, `mood`, and user `context`. Returns specialized poetic readings based on strict backend mandates:
* **Poetic Minimalism**: Output size limited to a maximum of 2 condensed paragraphs.
* **Lexical Sophistication**: Focuses on advanced, enigmatic language parameters.
* **Ritual Concluder**: Every horoscope must conclude on a constructive, actionable celestial ritual.

### 2. `/api/astrology/interpret`
A flexible multi-analysis engine accepting custom fields such as `type` (`"dream"` | `"relationship"` | `"journal"`), user content, and active profiles:
* **Subconscious Analysis**: Decodes hidden psychological patterns using Jungian archetypal symbolism. 
* **Synastry Decoy**: Evaluates dynamic communication and planetary aspects, returning a deep text-based harmony exercise.
* **Brevity Rule**: Enforces an strict 150-word maximum ceiling to preserve structural readability on mobile screens.
