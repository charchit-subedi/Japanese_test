import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCcw, 
  Home, 
  Trophy,
  Volume2
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { HIRAGANA, KATAKANA, KANJI_N5, KANJI_N4, KANJI_N3, Character } from '../constants/japaneseData';
import { cn } from '../lib/utils';
import { speakJapanese, speakRomaji } from '../services/speechService';
import KanjiCanvas from './KanjiCanvas';
import { MousePointer2, PenLine } from 'lucide-react';

interface PracticeProps {
  type: 'hiragana' | 'katakana' | 'kanji_n5' | 'kanji_n4' | 'kanji_n3';
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

export default function Practice({ type, onComplete, onExit }: PracticeProps) {
  const characters = 
    type === 'hiragana' ? HIRAGANA : 
    type === 'katakana' ? KATAKANA : 
    type === 'kanji_n4' ? KANJI_N4 :
    type === 'kanji_n3' ? KANJI_N3 :
    KANJI_N5;
  const [sessionCharacters, setSessionCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = sessionCharacters[currentIndex];

  useEffect(() => {
    // Shuffle and pick 10 characters for a session
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    setSessionCharacters(shuffled.slice(0, 10));
  }, [type]);

  useEffect(() => {
    if (!isFinished && current) {
      inputRef.current?.focus();
      // Auto-play character pronunciation
      speakJapanese(current.jp);
    }
  }, [currentIndex, isFinished, current]);

  const handleManualSpeak = () => {
    if (current) speakJapanese(current.jp);
  };

  const handleNext = () => {
    if (currentIndex < sessionCharacters.length - 1) {
      setFeedback(null);
      setUserInput('');
      setCurrentIndex(c => c + 1);
    } else {
      handleFinish();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) {
      handleNext();
      return;
    }

    const isCorrect = userInput.toLowerCase().trim() === current.romaji.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      speakRomaji(current.romaji);
    } else {
      setFeedback('wrong');
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const userId = user.uid;
        // 1. Add session record
        await addDoc(collection(db, `users/${userId}/sessions`), {
          type,
          score,
          totalItems: sessionCharacters.length,
          timestamp: Date.now(),
          perfect: score === sessionCharacters.length
        });

        // 2. Update user stats
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          totalXP: increment(score * 10),
          completedLessons: increment(1),
          lastActive: Date.now()
        });
      } catch (err) {
        console.error("Error saving session:", err);
      }
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-border-theme p-12 text-center shadow-xl"
      >
        <div className="w-16 h-16 border border-border-theme flex items-center justify-center mx-auto mb-8">
          <Trophy size={32} className="text-accent" />
        </div>
        <h2 className="text-3xl font-normal uppercase tracking-tight mb-2">Lesson Finalized</h2>
        <p className="text-sm text-muted italic font-serif mb-10">Module: {type.toUpperCase()}</p>
        
        <div className="flex flex-col gap-0 border border-border-theme mb-10 bg-bg/30">
          <div className="p-6 border-b border-border-theme">
            <p className="text-[10px] uppercase tracking-[2px] text-muted font-bold mb-1">Precision Score</p>
            <p className="text-3xl font-serif italic text-ink">{score} / {sessionCharacters.length}</p>
          </div>
          <div className="p-6">
            <p className="text-[10px] uppercase tracking-[2px] text-muted font-bold mb-1">Mastery Points Gained</p>
            <p className="text-3xl font-serif italic text-accent">+{score * 10} XP</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-ink text-white font-bold uppercase tracking-[2px] text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={14} />
            <span>Restart Drill</span>
          </button>
          <button
            onClick={onExit}
            className="w-full py-4 border border-border-theme text-ink font-bold uppercase tracking-[2px] text-xs hover:bg-bg transition-all flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Return to Base</span>
          </button>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentIndex + 1) / sessionCharacters.length) * 100;

  return (
    <div className="max-w-4xl w-full mx-auto px-6">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-16 px-4">
        <button onClick={onExit} className="p-3 border border-border-theme hover:bg-ink hover:text-white transition-all">
          <XCircle size={20} />
        </button>
        <div className="flex-1 mx-12 h-[1px] bg-border-theme relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-[2px] bg-accent -translate-y-[1px]"
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[3px] text-muted">
          SEQ: {currentIndex + 1} // 10
        </span>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-border-theme shadow-2xl overflow-hidden md:grid md:grid-cols-2"
      >
        <div className="bg-ink text-white p-12 md:p-20 flex flex-col items-center justify-center relative">
          <div className="absolute top-[-20px] left-[-20px] w-40 h-40 border border-white/5 rounded-full" />
          
          <div className="absolute top-8 left-8 text-[11px] uppercase tracking-[3px] font-bold text-white/30 hidden md:block">
            {isDrawMode ? "Mastery: Drawing" : "Mastery: Recognition"}
          </div>

          <div className="absolute top-8 right-8 flex gap-3">
            {type.startsWith('kanji') && (
              <button 
                onClick={() => setIsDrawMode(!isDrawMode)}
                className={cn(
                  "px-5 py-2 transition-all rounded-full flex items-center gap-2 shadow-lg border",
                  isDrawMode ? "bg-white text-ink border-white" : "bg-accent text-white border-accent hover:bg-accent/90"
                )}
                title={isDrawMode ? "Switch to Text Mode" : "Switch to Draw Mode"}
              >
                {isDrawMode ? <MousePointer2 size={16} /> : <PenLine size={16} />}
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {isDrawMode ? "View Mode" : "Draw Mode"}
                </span>
              </button>
            )}

            {!isDrawMode && (
              <button 
                onClick={handleManualSpeak}
                className="p-3 border border-white/10 hover:bg-white/10 transition-all rounded-full group"
                title="Listen to pronunciation"
              >
                <Volume2 size={24} className="group-active:scale-90 transition-transform" />
              </button>
            )}
          </div>

          <div className="w-full h-full flex items-center justify-center relative z-10">
            {isDrawMode ? (
              <KanjiCanvas key={current?.jp} char={current?.jp || ''} className="w-full aspect-square max-w-[320px]" />
            ) : (
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[160px] font-serif leading-none"
              >
                {current?.jp}
              </motion.h1>
            )}
          </div>
          
          <div className="mt-8 text-[10px] uppercase tracking-[4px] text-white/40 font-bold border-t border-white/10 pt-4">
            {isDrawMode ? "Sketch Character" : "Identify Character"}
          </div>
        </div>

        <div className="p-12 md:p-20 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-muted mb-4">Input Romaji Signal</label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  disabled={!!feedback}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="EX: KA"
                  className={cn(
                    "w-full py-5 px-6 text-2xl font-serif bg-bg border-b-2 transition-all outline-none",
                    feedback === 'correct' ? "border-accent text-accent" : 
                    feedback === 'wrong' ? "border-red-500 text-red-600" : 
                    "border-border-theme focus:border-ink"
                  )}
                />
                <AnimatePresence>
                  {feedback === 'correct' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 -bottom-8 text-[10px] uppercase tracking-widest font-bold text-accent"
                    >
                      Signal Verified ✓
                    </motion.div>
                  )}
                  {feedback === 'wrong' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 -bottom-8 text-[10px] uppercase tracking-widest font-bold text-red-500"
                    >
                      Signal Mismatch: {current.romaji.toUpperCase()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {feedback && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-bg border-l-2 border-accent space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {(current.onyomi || current.kunyomi) && (
                    <>
                      {current.onyomi && (
                        <div>
                          <div className="text-[9px] uppercase tracking-widest font-bold text-muted mb-1">Onyomi (Chinese)</div>
                          <div className="text-sm font-sans tracking-wide text-ink">{current.onyomi}</div>
                        </div>
                      )}
                      {current.kunyomi && (
                        <div>
                          <div className="text-[9px] uppercase tracking-widest font-bold text-muted mb-1">Kunyomi (Japanese)</div>
                          <div className="text-sm font-sans tracking-wide text-ink">{current.kunyomi}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {current.meaning && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-muted mb-1">Core Meaning</div>
                    <div className="text-lg font-serif italic text-ink leading-tight">{current.meaning}</div>
                  </div>
                )}
                
                {current.example && (
                   <div className="pt-2 border-t border-border-theme/50 text-[11px] text-muted leading-relaxed">
                     <span className="font-bold uppercase text-[9px] tracking-widest block mb-1">Usage Context</span>
                     {current.example}
                   </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full mt-2 py-4 bg-ink text-white text-[11px] uppercase tracking-[4px] font-bold hover:bg-accent transition-all flex items-center justify-center gap-2"
                >
                  Confirm & Advance <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {!feedback && (
              <button
                type="submit"
                className="w-full py-5 bg-ink text-white font-bold uppercase tracking-[3px] text-xs hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                <span>Authorize Signal</span>
                <ArrowRight size={14} />
              </button>
            )}
          </form>

          <div className="mt-16 text-[9px] uppercase tracking-[2px] text-muted italic leading-relaxed">
            Note: All inputs must match standard Hep-burn romanization protocols for verification.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

