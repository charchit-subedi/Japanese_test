import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import StudyMaterialGenerator from './components/StudyMaterialGenerator';
import { motion, AnimatePresence } from 'motion/react';

type View = 'loading' | 'auth' | 'dashboard' | 'practice' | 'generator';
type PracticeType = 'hiragana' | 'katakana' | 'kanji_n5' | 'kanji_n4' | 'kanji_n3';

export default function App() {
  const [view, setView] = useState<View>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [practiceType, setPracticeType] = useState<PracticeType>('hiragana');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userBuffer) => {
      setUser(userBuffer);
      if (userBuffer) {
        setView('dashboard');
      } else {
        setView('auth');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStartPractice = (type: PracticeType) => {
    setPracticeType(type);
    setView('practice');
  };

  const handleExitView = () => {
    setView('dashboard');
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-ink/10 border-t-ink rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent/10 selection:text-accent">
      <AnimatePresence mode="wait">
        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Auth onSuccess={() => setView('dashboard')} />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Dashboard 
              onStartPractice={handleStartPractice} 
              onOpenGenerator={() => setView('generator')}
            />
          </motion.div>
        )}

        {view === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex items-center justify-center py-12 px-4"
          >
            <Practice 
              type={practiceType} 
              onExit={handleExitView}
              onComplete={(score, total) => {
                console.log(`Completed with ${score}/${total}`);
                setView('dashboard');
              }}
            />
          </motion.div>
        )}

        {view === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StudyMaterialGenerator onBack={handleExitView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


