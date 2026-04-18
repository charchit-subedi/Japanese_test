import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { 
  Flame, 
  Trophy, 
  BookOpen, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  Clock,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface UserData {
  displayName: string;
  totalXP: number;
  streak: number;
  completedLessons: number;
}

interface DashboardProps {
  onStartPractice: (type: 'hiragana' | 'katakana' | 'kanji_n5' | 'kanji_n4' | 'kanji_n3') => void;
  onOpenGenerator: () => void;
}

export default function Dashboard({ onStartPractice, onOpenGenerator }: DashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data() as UserData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      window.location.reload();
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-ink/10 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-theme pb-8 mb-16 gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[3px] font-bold text-accent mb-2">Student Dashboard</div>
          <h1 className="text-4xl font-normal text-ink leading-tight">
            Kon'nichiwa, <span className="font-serif italic text-accent">{userData?.displayName || 'Student'}</span>
          </h1>
          <p className="text-sm text-muted mt-2">Precision in every stroke. Authenticity in every word.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onOpenGenerator}
            className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold bg-accent text-white hover:opacity-90 transition-all"
          >
            <Sparkles size={14} />
            <span>AI Study Lab</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold border border-border-theme hover:bg-ink hover:text-white transition-all"
          >
            <LogOut size={14} />
            <span>Exit Session</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-theme mb-16 bg-white shadow-sm">
        <StatCard 
          icon={<Flame className="text-accent" />}
          label="Current Streak"
          value={`${userData?.streak || 0} Days`}
          className="md:border-r border-border-theme"
        />
        <StatCard 
          icon={<Trophy className="text-ink" />}
          label="Total Mastery (XP)"
          value={userData?.totalXP || 0}
          className="md:border-r border-border-theme"
        />
        <StatCard 
          icon={<BookOpen className="text-muted" />}
          label="Perfect Lessons"
          value={userData?.completedLessons || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left: Practice Selection */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center gap-4 mb-2">
            <LayoutGrid size={24} className="text-ink" />
            <h2 className="text-2xl font-normal uppercase tracking-wider">Learning Modules</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <PracticeOption 
              title="Hiragana"
              subtitle="ひらがな"
              desc="The base scripts of modern Japanese writing. Essential for phonetics."
              onClick={() => onStartPractice('hiragana')}
              icon="あ"
            />

            <PracticeOption 
              title="Katakana"
              subtitle="カタカナ"
              desc="Angular scripts used for foreign loanwords and emphasis."
              onClick={() => onStartPractice('katakana')}
              icon="ア"
            />

            <div className="pt-10 border-t border-border-theme">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen size={24} className="text-accent" />
                <h2 className="text-2xl font-normal uppercase tracking-wider">Logographic Tiers (Kanji)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PracticeOption 
                  title="Kanji N5"
                  subtitle="初級"
                  desc="Basic characters for daily life and essentials."
                  onClick={() => onStartPractice('kanji_n5')}
                  icon="一"
                />
                <PracticeOption 
                  title="Kanji N4"
                  subtitle="中級下"
                  desc="Intermediate foundation: family, directions, verbs."
                  onClick={() => onStartPractice('kanji_n4')}
                  icon="会"
                />
                <PracticeOption 
                  title="Kanji N3"
                  subtitle="中級上"
                  desc="Advanced intermediate: society and concepts."
                  onClick={() => onStartPractice('kanji_n3')}
                  icon="政"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activity Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-accent" />
            <h2 className="text-lg font-normal uppercase tracking-wider">Historical Logs</h2>
          </div>
          <div className="bg-white border border-border-theme p-8 shadow-sm">
            <div className="space-y-8">
              <ActivityItem label="Hiragana Drill" time="2h ago" xp="+80" />
              <ActivityItem label="Katakana Intro" time="Yesterday" xp="+50" />
              <ActivityItem label="Profile Setup" time="2 days ago" xp="+100" />
            </div>
            <button className="w-full mt-10 pt-6 border-t border-border-theme text-[10px] uppercase tracking-[2px] font-bold text-muted hover:text-ink transition-colors">
              Request Full Archives
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, className }: any) {
  return (
    <div className={cn("p-10 flex flex-col items-center text-center", className)}>
      <div className="w-10 h-10 border border-border-theme flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-[2px] font-bold text-muted mb-2">{label}</p>
      <p className="text-3xl font-serif italic text-ink">{value}</p>
    </div>
  );
}

function PracticeOption({ title, subtitle, desc, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left group bg-white border border-border-theme p-8 transition-all hover:bg-ink hover:text-white flex items-center gap-10"
    >
      <div className="text-6xl font-serif text-accent group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-3 mb-1">
          <h3 className="text-2xl font-normal uppercase tracking-tight">{title}</h3>
          <span className="text-lg font-serif italic opacity-60">{subtitle}</span>
        </div>
        <p className="text-sm opacity-60 max-w-md">{desc}</p>
      </div>
      <div className="w-12 h-12 border border-border-theme flex items-center justify-center group-hover:border-white/30">
        <ChevronRight size={20} />
      </div>
    </button>
  );
}

function ActivityItem({ label, time, xp }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex flex-col">
        <p className="text-sm font-bold uppercase tracking-tight mb-1">{label}</p>
        <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-wider font-semibold">
          <Clock size={10} />
          <span>{time}</span>
        </div>
      </div>
      <span className="text-xs font-serif italic text-accent">{xp} XP</span>
    </div>
  );
}

