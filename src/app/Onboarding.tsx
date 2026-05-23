import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, ArrowRight, Calendar, User, MapPin, Clock } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', dates: 'Mar 21 - Apr 19', icon: '♈' },
  { name: 'Taurus', dates: 'Apr 20 - May 20', icon: '♉' },
  { name: 'Gemini', dates: 'May 21 - Jun 20', icon: '♊' },
  { name: 'Cancer', dates: 'Jun 21 - Jul 22', icon: '♋' },
  { name: 'Leo', dates: 'Jul 23 - Aug 22', icon: '♌' },
  { name: 'Virgo', dates: 'Aug 23 - Sep 22', icon: '♍' },
  { name: 'Libra', dates: 'Sep 23 - Oct 22', icon: '♎' },
  { name: 'Scorpio', dates: 'Oct 23 - Nov 21', icon: '♏' },
  { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', icon: '♐' },
  { name: 'Capricorn', dates: 'Dec 22 - Jan 19', icon: '♑' },
  { name: 'Aquarius', dates: 'Jan 20 - Feb 18', icon: '♒' },
  { name: 'Pisces', dates: 'Feb 19 - Mar 20', icon: '♓' },
];

export default function Onboarding({ onComplete, initialData }: { onComplete: (data: any) => void, initialData?: any }) {
  const [step, setStep] = useState(initialData ? 1 : 0);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    zodiacSign: initialData?.zodiacSign || '',
    birthDate: initialData?.birthDate || '',
    birthTime: initialData?.birthTime || '',
    birthLocation: initialData?.birthLocation || '',
  });

  const nextStep = () => setStep(s => s + 1);

  const steps = [
    // Step 0: Welcome
    (
      <motion.div 
        key="step0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: -100 }}
        className="flex flex-col items-center text-center px-8"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-celestial-purple to-celestial-magenta p-[1px] mb-8 shadow-[0_0_50px_rgba(109,40,217,0.3)]">
          <div className="w-full h-full rounded-full bg-[#050208] flex items-center justify-center">
            <Sparkles size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-serif italic mb-4">Welcome to Celestial</h1>
        <p className="text-white/60 leading-relaxed mb-12 italic">
          Unlock your cosmic blueprint and navigate the stars with AI-powered clarity.
        </p>
        <button 
          onClick={nextStep}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
        >
          Begin Journey <ArrowRight size={18} />
        </button>
      </motion.div>
    ),
    // Step 1: Name
    (
      <motion.div 
        key="step1"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="w-full px-8"
      >
        <h2 className="text-2xl font-serif italic mb-8">What should the stars call you?</h2>
        <div className="relative mb-12">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input 
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-celestial-purple/50 transition-colors"
          />
        </div>
        <button 
          disabled={!formData.name}
          onClick={nextStep}
          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl disabled:opacity-50"
        >
          Next
        </button>
      </motion.div>
    ),
    // Step 2: Zodiac
    (
      <motion.div 
        key="step2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="w-full px-8"
      >
        <h2 className="text-2xl font-serif italic mb-6 text-center">Choose your Zodiac</h2>
        <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {ZODIAC_SIGNS.map((sign) => (
            <button
              key={sign.name}
              onClick={() => {
                setFormData(d => ({ ...d, zodiacSign: sign.name }));
                nextStep();
              }}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                formData.zodiacSign === sign.name 
                ? 'bg-celestial-purple border-white/40' 
                : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <span className="text-2xl">{sign.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{sign.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    ),
    // Step 3: Birth Details (Final)
    (
      <motion.div 
        key="step3"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full px-8"
      >
        <h2 className="text-2xl font-serif italic mb-8">Set your Cosmic Anchor</h2>
        <div className="flex flex-col gap-4 mb-12">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData(d => ({ ...d, birthDate: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData(d => ({ ...d, birthTime: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text"
                placeholder="Birth Place"
                value={formData.birthLocation}
                onChange={(e) => setFormData(d => ({ ...d, birthLocation: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
        <button 
          onClick={() => onComplete({ ...formData, onboarded: true })}
          className="w-full py-4 bg-gradient-to-r from-celestial-purple to-celestial-magenta text-white font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(219,39,119,0.3)]"
        >
          Enter the Cosmos
        </button>
      </motion.div>
    )
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 relative z-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                x: [0, 50, 0],
                y: [0, -50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-radial-gradient from-celestial-purple/40 to-transparent blur-[100px]" 
        />
        <motion.div 
            animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1],
                x: [0, -50, 0],
                y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-radial-gradient from-celestial-magenta/30 to-transparent blur-[80px]" 
        />
      </div>

      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>
      
      {/* Progress indicators */}
      <div className="absolute bottom-12 flex gap-3">
        {steps.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full transition-all duration-700 ease-out ${
              idx === step ? 'w-12 bg-celestial-magenta shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
