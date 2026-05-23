import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Home from './app/(tabs)/Home';
import Oracle from './app/(tabs)/Oracle';
import Compatibility from './app/(tabs)/Compatibility';
import Profile from './app/(tabs)/Profile';
import Journal from './app/(tabs)/Journal';
import Onboarding from './app/Onboarding';
import TabNavigation from './components/TabNavigation';
import Paywall from './components/Paywall';
import StarField from './components/StarField';
import { useUserStore } from './store/useStore';
import { loginWithGoogle } from './lib/firebase';
import { Sparkles, Star } from 'lucide-react';

export default function App() {
  const { user, profile, saveProfile, loading, error } = useUserStore();
  const [showPaywall, setShowPaywall] = useState(false);

  if (loading) return (
     <div className="min-h-screen w-full cosmic-gradient flex items-center justify-center">
        <StarField />
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Sparkles className="text-celestial-gold" size={48} />
        </motion.div>
     </div>
  );

  if (error && !user) {
      return (
          <div className="min-h-screen w-full cosmic-gradient flex flex-col items-center justify-center p-8 text-center">
              <StarField />
              <div className="glass-premium p-10 rounded-[2rem] border border-white/10 max-w-sm">
                <h1 className="text-2xl font-serif italic text-white mb-4">Cosmic Interference</h1>
                <p className="text-white/40 text-sm mb-8">The celestial link is currently unstable. Please check your connection or wait for the stars to align.</p>
                <div className="text-[10px] uppercase font-mono text-celestial-magenta mb-8">{error}</div>
                <button onClick={() => window.location.reload()} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl active:scale-95 transition-all">Retry Ritual</button>
              </div>
          </div>
      );
  }

  // 1. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen w-full relative cosmic-gradient flex items-center justify-center p-8 overflow-hidden">
        <StarField />
        <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] w-[120%] h-[120%] bg-radial-gradient from-celestial-purple/20 via-transparent to-transparent blur-[120px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center max-w-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <Star className="text-celestial-gold" size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-serif italic text-white mb-4 tracking-tight">Celestial</h1>
            <p className="text-indigo-100/40 text-sm mb-12 leading-relaxed tracking-wider uppercase font-light">Sync your soul with the planetary transits. Discover your cosmic blueprint.</p>
            <button 
                onClick={loginWithGoogle}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
                Connect with Universe
            </button>
        </motion.div>
      </div>
    );
  }

  // 2. Onboarding State
  if (!profile?.onboarded) {
    return (
      <div className="min-h-screen w-full relative cosmic-gradient overflow-hidden">
        <StarField />
        <Onboarding 
          initialData={profile}
          onComplete={(data) => saveProfile({ ...data, onboarded: true })} 
        />
      </div>
    );
  }

  // 3. Authenticated & Onboarded State
  return (
    <Router>
      <div className="min-h-screen w-full relative cosmic-gradient overflow-hidden selection:bg-celestial-purple selection:text-white">
        <StarField />
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-6 right-6 z-[200] p-4 glass-premium border border-celestial-magenta/30 rounded-2xl text-[10px] uppercase tracking-widest text-celestial-magenta font-bold text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-radial-gradient from-celestial-purple/30 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-radial-gradient from-celestial-magenta/20 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/compatibility" element={<Compatibility />} />
              <Route path="/ai" element={<Oracle />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/journal" element={<Journal />} />
            </Routes>
          </AnimatePresence>
        </div>

        <TabNavigation onPremiumClick={() => setShowPaywall(true)} />
        <Paywall isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      </div>
    </Router>
  );
}
