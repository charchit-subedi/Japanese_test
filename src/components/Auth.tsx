import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { LogIn, UserPlus, Github, Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initUserInFirestore = async (userId: string, email: string, name?: string) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email,
        displayName: name || email.split('@')[0],
        streak: 0,
        totalXP: 0,
        completedLessons: 0,
        lastActive: Date.now(),
        photoURL: ''
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await initUserInFirestore(userCredential.user.uid, userCredential.user.email!);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        await initUserInFirestore(userCredential.user.uid, userCredential.user.email!, displayName);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await initUserInFirestore(result.user.uid, result.user.email!, result.user.displayName || '');
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // Silently reset loading state if user manually closed the popup
        setError(null);
      } else {
        setError(err.message || 'Google Auth failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[900px] min-h-[600px] bg-white border border-border-theme shadow-2xl flex flex-col md:grid md:grid-cols-2 overflow-hidden"
      >
        {/* Visual Pane */}
        <div className="bg-[#111] text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-72 h-72 border border-white/10 rounded-full" />
          
          <div className="relative z-10">
            <div className="font-serif italic text-2xl tracking-[2px] border-b-2 border-accent w-fit pb-1 leading-none mb-12">
              Sakura
            </div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-[140px] leading-none opacity-90 font-serif">
                学習
              </div>
              <div className="text-sm uppercase tracking-[4px] text-muted italic mt-2">
                Master the Flow
              </div>
            </motion.div>
          </div>

          <div className="text-[10px] opacity-50 leading-relaxed uppercase tracking-wider relative z-10">
            PRECISION IN EVERY STROKE.<br />
            AUTHENTIC JAPANESE LEARNING POWERED BY AI.
          </div>
        </div>

        {/* Form Pane */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-[28px] font-normal text-ink mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Journey'}
            </h2>
            <p className="text-sm text-muted">
              {isLogin 
                ? 'Please enter your details to continue your journey.' 
                : 'Create an account to start your Japanese mastery.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-[10px] uppercase tracking-[1.5px] font-bold mb-2 text-muted">Full Name</label>
                  <input
                    type="text"
                    placeholder="Kenji Sato"
                    required={!isLogin}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-3 border border-border-theme text-sm outline-none focus:border-ink transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] uppercase tracking-[1.5px] font-bold mb-2 text-muted">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-border-theme text-sm outline-none focus:border-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[1.5px] font-bold mb-2 text-muted">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-border-theme text-sm outline-none focus:border-ink transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-ink text-white font-semibold text-sm tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="uppercase">{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="flex items-center my-8 text-[11px] text-muted uppercase tracking-[1px]">
            <div className="flex-1 h-[1px] bg-border-theme"></div>
            <span className="px-4">Or continue with</span>
            <div className="flex-1 h-[1px] bg-border-theme"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full p-3 border border-border-theme text-ink font-medium text-sm flex items-center justify-center gap-3 hover:bg-bg transition-colors shadow-sm disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center text-white p-1">
              <Chrome size={12} />
            </div>
            <span>Google Account</span>
          </button>

          <div className="mt-8 text-center text-xs text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-ink font-bold border-b border-border-theme pb-0.5 hover:border-ink transition-colors"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

