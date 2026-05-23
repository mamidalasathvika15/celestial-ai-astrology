import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // AI Astrology API Endpoints
  app.post('/api/astrology/horoscope', async (req, res) => {
    try {
      const { sign, mood, context } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User is a ${sign}. Mood: ${mood}. Topic: ${context}.`,
        config: {
          systemInstruction: `You are the Celestial Oracle, an emotionally intelligent spiritual guide.
          Provide a highly personalized cosmic insight for a ${sign} feeling ${mood}.
          STRICT RULES: 
          1. Use Poetic Minimalism: Max 2 short paragraphs. 
          2. High Mystery: Incorporate concepts of 'vibrational resonance', 'ethereal shifts', and 'celestial architecture'.
          3. Actionable Wisdom: End with a specific 'Cosmic Ritual' (e.g., "Place a glass of water under your bed", "Speak to a stranger").
          4. No Cliches: Avoid generic zodiac traits. focus on the current energetic pulse.`,
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 429) {
          return res.status(429).json({ error: 'The cosmic energy is currently depleted. Please wait a moment for the stars to realign.' });
      }
      console.error('Gemini Error:', error);
      res.status(500).json({ error: 'The stars are temporarily obscured.' });
    }
  });

  // AI Birth Chart Reading End point
  app.post('/api/astrology/birthchart', async (req, res) => {
    try {
      const { profile } = req.body;
      const { name, zodiacSign, birthDate, birthTime, birthLocation } = profile || {};
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Seeker attributes: Name: ${name || 'Seeker'}, Sun Sign: ${zodiacSign || 'Leo'}, Birth Date: ${birthDate || 'Unknown'}, Birth Time: ${birthTime || 'Unknown'}, Birth Location: ${birthLocation || 'Unknown'}.`,
        config: {
          systemInstruction: `You are the High Priest of the Astrological Conclave. You cast and read highly sophisticated birth charts.
          Based on the user's birth data, generate a deep astrological chart analysis.
          Provide information on:
          1. Sun Placement: Their primary essence and ego drive (derived from Sun Sign).
          2. Moon Placement: Their subconscious emotional landscape and shadow self (assign a compatible sign like Aries/Taurus and explain why).
          3. Ascendant/Rising Sign: Their social mask, first impressions, and soul portal (assign a compatible rising sign and explain why).
          4. Planetary Alignment Nodes: Synthesize Mercury, Venus, or Mars aspects.
          
          STRICT RULES:
          - Use a poetic, highly spiritual, and ancient tone.
          - Structure the sections clearly with beautiful cosmic titles.
          - Conclude with a single divine "Life Node Key" (e.g., "Sovereign Horizon", "Deep Oceanic Silence").
          - Be accurate, mysterious, and limit the full analysis to 300 words max to fit comfortably on screen.`,
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 429) {
        return res.status(429).json({ error: 'The cosmic alignments are shifting too rapidly. Re-align in a few seconds.' });
      }
      console.error('Birthchart error:', error);
      res.status(500).json({ error: 'Failed to cast the celestial chart.' });
    }
  });

  // AI Personalized Daily Affirmation
  app.post('/api/astrology/affirmation', async (req, res) => {
    try {
      const { sign, mood } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Zodiac Sign: ${sign}. Current Mood: ${mood}.`,
        config: {
          systemInstruction: `You are the Sovereign Voice of the Cosmos.
          Generate a beautiful, highly empowering, single-sentence spiritual affirmation tailored for a ${sign} experiencing a ${mood} state.
          STRICT RULES:
          1. The affirmation must be exactly ONE sentence, written in the first-person ("I am...").
          2. It must be poetic, majestic, and resonate with cosmic energy (avoid cheesy self-help cliché terms).
          3. Max length 25 words.`,
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 429) {
          return res.status(429).json({ error: 'The energy frequency is overloaded. Hold intent and retry.' });
      }
      res.status(500).json({ error: 'Affirmation failed.' });
    }
  });

  // AI Interpretation (Dreams, Relationships, Journal)
  app.post('/api/astrology/interpret', async (req, res) => {
    try {
      const { type, content, profile } = req.body;
      let systemPrompt = '';

      if (type === 'dream') {
        systemPrompt = `You are the Dream Weaver. You decode the subconscious using Jungian archetypes and astrology. 
        Analyze the dream: "${content}". 
        Be mystical, symbolic, and provide a single "Soul Lesson".`;
      } else if (type === 'relationship') {
        systemPrompt = `You are the Celestial Love Coach. Analyze the compatibility/issue: "${content}".
        Provide emotional depth, communication advice, and a "Harmony Exercise". 
        Be wise, empathic, and objective.`;
      } else {
        systemPrompt = `You are the Celestial Interpreter. Analyze the content: "${content}". 
        Sound like a wise observer of the soul. Format: Title, 2 lines of analysis, and a "Soul Frequency" percentage.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Content: ${content}. Profile: ${JSON.stringify(profile)}.`,
        config: {
          systemInstruction: `${systemPrompt}
          STRICT RULES:
          1. Be Empathic & Cryptic.
          2. Visual Imagery: Describe a mental image first.
          3. Brevity is divinity: 150 words max.`,
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 429) {
          return res.status(429).json({ error: 'The celestial interpreter is resting. Realign in a few seconds.' });
      }
      res.status(500).json({ error: 'Interpretation failed.' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Celestial Backend Engine running at http://localhost:${PORT}`);
  });
}

startServer();
