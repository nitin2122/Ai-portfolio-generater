import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import Workspace from './components/Workspace';
import PortfolioPreview from './components/PortfolioPreview';
import Gallery from './components/Gallery';
import HistoryPanel from './components/HistoryPanel';
import AuthModal from './components/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { downloadAsHTML, printAsPDF } from './lib/exportPortfolio';
import { generatePortfolioData } from './lib/gemini';
import { cachedGenerate, invalidateCache } from './lib/apiCache';
import { useAuth } from './contexts/AuthContext';

// ─── localStorage helpers ────────────────────────────────────────────────────
const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem('portfolio-history') || '[]'); }
  catch { return []; }
};
const saveHistory = (history) => {
  try { localStorage.setItem('portfolio-history', JSON.stringify(history)); }
  catch { /* quota exceeded – fail silently */ }
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [userData, setUserData]       = useState({ name: '', role: '', prompt: '' });
  const [themeData, setThemeData]     = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variant, setVariant]         = useState(1);
  const [history, setHistory]         = useState(loadHistory);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast]             = useState(null);
  const containerRef = useRef(null);
  const { isAuthenticated, isPro } = useAuth();

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  // ─── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = async (data, { forceRefresh = false } = {}) => {
    setUserData(data);
    setIsGenerating(true);
    if (forceRefresh) invalidateCache(data);

    try {
      const result = await cachedGenerate(data, () => generatePortfolioData(data));
      setThemeData(result);

      if (result._isFallback) {
        showToast('⚡ API quota reached — showing demo portfolio. Your info is applied!', 'success');
      } else {
        showToast('✨ Portfolio generated!', 'success');
      }

      const newEntry = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userData: data,
        themeData: result,
      };
      const updated = [newEntry, ...history].slice(0, 20);
      setHistory(updated);
      saveHistory(updated);

      setTimeout(() => {
        const previewEl = document.getElementById('preview');
        if (previewEl) previewEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Neural synthesis failed:', error);
      showToast('Generation failed. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Export — FREE for all users, no sign-in required ─────────────────────
  const handleExport = async (format) => {
    if (!themeData) {
      showToast('Generate a portfolio first.', 'error');
      return;
    }
    try {
      if (format === 'pdf') {
        const opened = printAsPDF(themeData, userData, variant);
        if (!opened) {
          showToast('❌ Could not open print dialog. Try "Download HTML" instead.', 'error');
        } else {
          showToast('🖨️ Print dialog opening — select "Save as PDF" in your browser.', 'success');
        }
      } else {
        downloadAsHTML(themeData, userData, variant);
        showToast('✅ Portfolio downloaded as HTML! Open it in any browser.', 'success');
      }
    } catch (err) {
      console.error('[Export] error:', err);
      showToast('Export failed. Please try again.', 'error');
    }
  };

  // ─── Pro Upgrade — Coming Soon ─────────────────────────────────────────────
  const handleUpgrade = () => {
    showToast('🚀 Pro tier coming soon — payment integration in progress!', 'success');
  };

  // ─── History actions ───────────────────────────────────────────────────────
  const handleRestoreHistory = (item) => {
    setUserData(item.userData);
    setThemeData(item.themeData);
    setVariant(1);
    setIsHistoryOpen(false);
  };
  const handleDeleteHistory = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };
  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0b] overflow-x-hidden text-white">
      {!themeData && <Background3D />}
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border"
            style={{
              background: toast.type === 'error' ? 'rgba(30,10,10,0.9)' : 'rgba(10,30,10,0.9)',
              borderColor: toast.type === 'error' ? 'rgba(255,80,80,0.3)' : 'rgba(80,255,80,0.3)',
              color: '#fff', maxWidth: '90vw', fontSize: '12px', fontWeight: 600,
            }}
          >
            <span style={{ color: toast.type === 'error' ? '#ff6b6b' : '#6bff6b', fontSize: '16px' }}>
              {toast.type === 'error' ? '⚠' : '✓'}
            </span>
            {toast.msg}
            <button onClick={() => setToast(null)} style={{ marginLeft: '8px', opacity: 0.5, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating History Button — bottom-right */}
      <motion.button
        onClick={() => setIsHistoryOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[2001] flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/70 backdrop-blur-xl text-white/70 hover:text-white hover:border-primary/40 transition-all duration-300"
        style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2px' }}
      >
        <Clock size={13} />
        HISTORY
        {history.length > 0 && (
          <span className="ml-1 w-4 h-4 rounded-full bg-primary text-black text-[8px] font-black flex items-center justify-center">
            {history.length > 9 ? '9+' : history.length}
          </span>
        )}
      </motion.button>

      <HistoryPanel
        isOpen={isHistoryOpen}
        history={history}
        onRestore={handleRestoreHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
        onClose={() => setIsHistoryOpen(false)}
      />

      <main className="relative z-10">
        {/* Hero */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-4 mb-6 justify-center">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-[10px] font-display font-black tracking-[0.5em] text-primary uppercase">
                  Kinetic Noir Engine
                </span>
              </div>

              <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold leading-[1.05] mb-10 tracking-tight">
                Intelligence
                <br />
                Meets Design<span className="text-primary">.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Describe your vision. Our AI builds a high-end, cinematic portfolio in seconds.
                Zero code. Infinite possibilities.
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary"
                >
                  BUILD YOUR PORTFOLIO
                </button>
                <button
                  onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline"
                >
                  EXPLORE TEMPLATES
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        <Workspace
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          userData={userData}
          setUserData={setUserData}
        />

        <Gallery
          onSelect={(themePrompt) => {
            // Immediately generate with selected template theme
            const mergedData = { ...userData, prompt: themePrompt };
            setUserData(mergedData);
            handleGenerate(mergedData, { forceRefresh: true });
            setTimeout(() => {
              const ws = document.getElementById('workspace');
              if (ws) ws.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
        />

        {/* Pricing */}
        <section id="pricing" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-display font-bold mb-6">Kinetic Access</h2>
              <p className="text-text-dim text-lg">Choose the plan that fits your creative ambitions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                className="glass p-12 relative overflow-hidden group"
                whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-text-dim">Pro</h3>
                <div className="text-7xl font-display font-bold mb-12">
                  $4.99<span className="text-lg font-body text-text-dim">/mo</span>
                </div>
                <ul className="space-y-4 mb-12">
                  {['Unlimited Generations', '4K Export Quality', 'Custom Domains', 'Priority Rendering'].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="text-primary text-xl">✦</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={handleUpgrade} className="btn-primary w-full relative overflow-hidden group">
                  {isPro ? 'PRO ACTIVE' : 'UPGRADE TO PRO'}
                  {!isPro && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary text-[10px] tracking-widest font-black">
                      🚀 COMING SOON
                    </span>
                  )}
                </button>
              </motion.div>

              <motion.div
                className="glass p-12 border-primary/20 relative group"
                whileHover={{ borderColor: 'rgba(204,255,0,0.4)' }}
              >
                <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-primary">Enterprise</h3>
                <div className="text-7xl font-display font-bold mb-12">
                  $99<span className="text-lg font-body text-text-dim">/mo</span>
                </div>
                <ul className="space-y-4 mb-12">
                  {['Team Workspaces', 'White-label Exports', 'API Access', 'Dedicated Support'].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="text-primary text-xl">✦</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="btn-outline w-full hover:bg-primary hover:text-black">CONTACT SALES</button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-bold font-display text-primary tracking-widest">
            AIPF<span className="text-white">.</span>
          </div>
          <p className="text-text-dim text-sm font-medium">© 2026 AIPF KINETIC NOIR ENGINE. SYNTHESIZED BY AI.</p>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest text-text-dim">
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TWITTER</a>
          </div>
        </div>
      </footer>

      {/* Portfolio preview — at ROOT level so fixed positioning works */}
      <AnimatePresence>
        {themeData && (
          <PortfolioPreview
            themeData={themeData}
            userData={userData}
            variant={variant}
            setVariant={setVariant}
            onExport={handleExport}
            onClose={() => setThemeData(null)}
            isPro={isPro}
            onDeploy={() => {
              if (!isAuthenticated) {
                setIsAuthModalOpen(true);
                showToast('Please sign in to deploy', 'error');
                return;
              }
              if (!isPro) {
                showToast('Custom URL deployment is a Pro feature. Upgrade below.', 'error');
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                setThemeData(null);
                return;
              }
              showToast('Deploying to custom URL... (Simulated)', 'success');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
