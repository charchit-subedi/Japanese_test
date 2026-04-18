import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookMarked, 
  FileText, 
  ArrowLeft, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Save,
  AlertTriangle
} from 'lucide-react';
import { processStudyMaterial } from '../services/aiService';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface GeneratorProps {
  onBack: () => void;
}

export default function StudyMaterialGenerator({ onBack }: GeneratorProps) {
  const [content, setContent] = useState('');
  const [level, setLevel] = useState<'N5' | 'N4' | 'N3'>('N5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const data = await processStudyMaterial(content, level);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    const userBuffer = auth.currentUser;
    if (!userBuffer || !result) return;
    
    setLoading(true);
    try {
      // Save entire study pack to user's materials
      const materialRef = collection(db, `users/${userBuffer.uid}/materials`);
      await addDoc(materialRef, {
        ...result,
        createdAt: Date.now()
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="flex items-center gap-4 mb-12 border-b border-border-theme pb-8 text-black">
        <button onClick={onBack} className="p-3 border border-border-theme hover:bg-ink hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="text-[10px] uppercase tracking-[3px] font-bold text-accent mb-1">AI Research Lab</div>
          <h1 className="text-3xl font-normal tracking-tight uppercase">Mastery Dataset Generator</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Phase */}
        <div className="space-y-8">
          <div className="bg-white border border-border-theme p-8 shadow-sm">
            <label className="block text-[10px] uppercase tracking-[2px] font-bold text-muted mb-4">Target JLPT Level</label>
            <div className="flex gap-2">
              {(['N5', 'N4', 'N3'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "flex-1 py-3 border border-border-theme font-bold text-xs transition-all",
                    level === l ? "bg-ink text-white" : "hover:bg-bg text-ink"
                  )}
                >
                  {l} MASTER
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border-theme p-8 shadow-sm">
            <label className="block text-[10px] uppercase tracking-[2px] font-bold text-muted mb-4">Input Study Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste Japanese text, article summaries, or specific grammar notes here..."
              className="w-full h-80 p-6 bg-bg border-b border-border-theme font-serif text-lg outline-none focus:border-ink transition-colors resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !content.trim()}
              className="w-full mt-6 py-5 bg-accent text-white font-bold uppercase tracking-[3px] text-xs flex items-center justify-center gap-3 hover:bg-[#a00026] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>Execute AI Analysis</span>
            </button>
          </div>
        </div>

        {/* Output Phase */}
        <div className="relative min-h-[600px] border border-dashed border-border-theme bg-white/50 p-1 flex flex-col">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12"
              >
                <FileText size={48} className="text-muted/20 mb-4" />
                <p className="font-serif italic text-muted max-w-sm">
                  Generated datasets will be structured here for your review and integration.
                </p>
              </motion.div>
            ) : result.error ? (
               <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 text-red-600"
              >
                <AlertTriangle size={48} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-sm">System Error</p>
                <p className="font-serif italic text-ink mt-2">{result.error}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-white border border-border-theme p-8 overflow-y-auto max-h-[1000px] text-gray-800"
              >
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-border-theme">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-2 py-1 bg-accent/5 inline-block mb-2">
                       Dataset: {result.metadata.level}
                    </span>
                    <h2 className="text-2xl font-normal uppercase tracking-tight leading-none">
                      {result.metadata.source_material}
                    </h2>
                  </div>
                  <button
                    onClick={handleSaveToDashboard}
                    disabled={loading || saved}
                    className={cn(
                      "p-3 border transition-all flex items-center gap-2",
                      saved ? "border-green-500 text-green-600" : "border-ink text-ink hover:bg-ink hover:text-white"
                    )}
                  >
                    {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {saved ? 'Injected' : 'Inject to DB'}
                    </span>
                  </button>
                </div>

                <div className="space-y-12">
                  <section>
                    <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-muted mb-6">Extracted Kanji Dataset</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {result.kanji_data?.map((k: any, idx: number) => (
                        <div key={idx} className="p-6 bg-bg/30 border border-border-theme flex gap-6">
                          <div className="text-5xl font-serif text-ink">{k.kanji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-bold border-b border-accent pb-0.5">{k.reading}</span>
                              <span className="text-xs italic text-muted">{k.meaning_en}</span>
                            </div>
                            <div className="text-xs font-serif text-accent mb-3">NEP: {k.meaning_np}</div>
                            <div className="p-3 bg-white border border-border-theme rounded text-[11px] italic leading-relaxed">
                              {k.example_sentence}
                              <div className="mt-1 text-muted opacity-50 border-t pt-1 border-border-theme/50">
                                {k.example_np}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] uppercase tracking-[3px] font-bold text-muted mb-6">Generated Mock Drill</h4>
                    <div className="space-y-4">
                      {result.mock_test?.map((q: any) => (
                        <div key={q.id} className="p-6 bg-white border border-border-theme">
                          <div className="flex justify-between mb-4">
                            <span className="text-[10px] uppercase font-bold text-muted">Question #{q.id}</span>
                            <span className="text-[10px] uppercase font-bold text-accent">{q.category}</span>
                          </div>
                          <p className="text-lg font-serif mb-6">{q.question}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt: string, i: number) => (
                              <div key={i} className={cn(
                                "p-3 border text-xs text-center font-bold tracking-tight",
                                opt === q.answer ? "border-green-300 bg-green-50 text-green-800" : "border-border-theme text-muted opacity-60"
                              )}>
                                {opt}
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-border-theme/50 text-[11px] italic font-serif text-muted">
                            <span className="font-bold uppercase tracking-widest text-[9px] block mb-1">Correction Logic (Nepali)</span>
                            {q.explanation_np}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
