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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { generatePortfolioData } from './lib/gemini';
import { cachedGenerate, invalidateCache } from './lib/apiCache';
import { useAuth } from './contexts/AuthContext';
// Razorpay import removed — payment integration is Coming Soon

// Load history from localStorage, max 20 items
const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('portfolio-history') || '[]');
  } catch {
    return [];
  }
};


const saveHistory = (history) => {
  try {
    localStorage.setItem('portfolio-history', JSON.stringify(history));
  } catch {
    // Storage quota exceeded – fail silently
  }
};

function App() {
  const [userData, setUserData] = useState({ name: '', role: '', prompt: '' });
  const [themeData, setThemeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variant, setVariant] = useState(1);
  const [history, setHistory] = useState(loadHistory);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const containerRef = useRef(null);
  const { isAuthenticated, isPro, updateProStatus, user } = useAuth();
  // Razorpay hook removed — payment integration Coming Soon

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  // ─── Pro Upgrade — Coming Soon ─────────────────────────────────────────────
  // Payment integration (Razorpay) is not yet live. Show a friendly Coming Soon
  // notification so users know it's on the roadmap.
  const handleUpgrade = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in first — then watch this space!', 'error');
      return;
    }
    if (isPro) {
      showToast('You are already a Pro user!', 'success');
      return;
    }
    showToast('🚀 Pro payments coming soon — stay tuned!', 'success');
  };

  // ─── Generation ────────────────────────────────────────────────────────────
  const handleGenerate = async (data, { forceRefresh = false } = {}) => {
    setUserData(data);
    setIsGenerating(true);

    // Bust the cache if the user explicitly wants a fresh result
    if (forceRefresh) invalidateCache(data);

    try {
      // Route through cache: identical prompts within 10 min reuse localStorage.
      // A 3-second min-interval guard prevents loop-driven quota exhaustion.
      const result = await cachedGenerate(data, () => generatePortfolioData(data));
      setThemeData(result);

      // Persist to history (newest first, max 20)
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
      console.error('Neural synthesis failed', error);
      const isTemplate2 = data.prompt?.includes('TEMPLATE_2');
      const fallback = isTemplate2 ? {
        bg: '#faf7f2',
        text: '#1a1614',
        accent: '#c4933f',
        fontDisplay: 'Cormorant Garamond',
        fontBody: 'Inter',
        bio: `${data.name} is an award-winning ${data.role} who bridges the gap between creative vision and technical excellence. With a philosophy rooted in editorial precision, every project is a narrative told through craft.`,
        aboutText: `A deliberate and precise approach to ${data.role} that elevates brands into cultural conversations.`,
        skills: ['Brand Strategy', 'Visual Design', 'Typography', 'Art Direction', 'Motion Design', 'UX Research'],
        experience: [
          { role: data.role || 'Lead Designer', company: 'Atelier Studio', duration: '2023 — Present', description: 'Leading creative direction for premium brand identities across luxury, fashion, and architecture sectors.' },
          { role: 'Senior Designer', company: 'Monograph Co.', duration: '2020 — 2023', description: 'Designed editorial systems and visual identities for international publications and cultural institutions.' },
          { role: 'Designer', company: 'Freelance', duration: '2017 — 2020', description: 'Independent practice focused on brand development, print design, and digital experiences.' },
        ],
        imagePrompts: ['warm editorial photography', 'serif typography on cream paper', 'golden hour architectural detail'],
      } : {
        bg: '#0a0a0b',
        text: '#f5f5f5',
        accent: '#ccff00',
        fontDisplay: 'Space Grotesk',
        fontBody: 'Inter',
        bio: `${data.name} is a high-performance ${data.role} architecting the future of digital experiences. Every pixel is a decision. Every interaction, a statement.`,
        aboutText: `Technical precision meets creative ambition. ${data.name} builds systems that scale.`,
        skills: ['Strategy', 'Design Systems', 'Prototyping', 'Code', 'Creative Direction', 'Motion'],
        experience: [
          { role: data.role || 'Creative Technologist', company: 'Kinetic Labs', duration: '2023 — Present', description: 'Building next-generation design tools and interactive experiences at the intersection of AI and design.' },
          { role: 'Lead Developer', company: 'Noir Studio', duration: '2021 — 2023', description: 'Led a team of 8 engineers shipping high-performance web applications for Fortune 500 clients.' },
          { role: 'Designer & Developer', company: 'Freelance', duration: '2018 — 2021', description: 'Independent practice specializing in cinematic web experiences, WebGL, and interaction design.' },
        ],
        imagePrompts: ['dark abstract 3D render', 'neon grid technical visualization', 'futuristic noir architecture'],
      };
      setThemeData(fallback);

      const newEntry = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userData: data,
        themeData: fallback,
      };
      const updated = [newEntry, ...history].slice(0, 20);
      setHistory(updated);
      saveHistory(updated);

      showToast('API quota exceeded – showing fallback design. Set a valid VITE_GEMINI_API_KEY to enable live generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async (format) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to download your portfolio', 'error');
      return;
    }

    // Target the inner content div so html2canvas sees the full document height,
    // not just the clipped viewport of the scrollable modal container.
    const element =
      document.getElementById('portfolio-content-inner') ||
      document.getElementById('capture-area');

    if (!element) {
      // FIX: toast is a React state object, not a library — use showToast()
      showToast('Capture area not found — open the preview first.', 'error');
      return;
    }

    try {
      // Clamp at 16 000 px to avoid OOM on very long portfolios
      const fullHeight = Math.min(element.scrollHeight, 16000);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: themeData?.bg || '#000000',
        // scrollY must be 0 here: we are supplying the element's full scrollHeight
        // as the explicit `height`, so html2canvas renders from the top of the
        // element — not from the viewport scroll position.  Using
        // getBoundingClientRect().top is wrong for elements inside a fixed modal
        // (the value is unrelated to the element's own scroll offset) and causes
        // a partial or blank capture in production builds.
        width: element.offsetWidth,
        height: fullHeight,
        windowWidth: element.offsetWidth,
        windowHeight: fullHeight,
        scrollY: 0,
        scrollX: 0,
        imageTimeout: 15000, // Give Google Fonts / remote assets up to 15s to load
      });

      const safeName = (userData.name || 'Portfolio').replace(/\s+/g, '_');

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeightMm = pdf.internal.pageSize.getHeight();
        const imgHeightMm = (canvas.height * pdfWidth) / canvas.width;
        // FIX: paginate across multiple A4 pages instead of squashing everything
        let yOffset = 0;
        while (yOffset < imgHeightMm) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfWidth, imgHeightMm);
          yOffset += pageHeightMm;
        }
        pdf.save(`${safeName}_Portfolio.pdf`);
        showToast('Portfolio downloaded successfully!', 'success');
      } else {
        // FIX: 'jpeg' is not a valid MIME type — must be 'image/jpeg'.
        // Passing the raw format string caused silent fallback to PNG blobs
        // in Firefox/Safari, resulting in files that failed to open.
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality  = format === 'jpeg' ? 0.92 : undefined;
        const dataUrl  = quality
          ? canvas.toDataURL(mimeType, quality)
          : canvas.toDataURL(mimeType);

        const link = document.createElement('a');
        link.download = `${safeName}_Portfolio.${format}`;
        link.href = dataUrl;
        // FIX: appending to body before .click() is required by Safari/Firefox
        // to reliably trigger the file-save dialog.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Portfolio downloaded successfully!', 'success');
      }
    } catch (err) {
      console.error('[Export] html2canvas error:', err);
      showToast('Export failed. Please check your browser permissions.', 'error');
    }
  };

  // ─── History actions ─────────────────────────────────────────────────────────
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
      {/* Background3D only visible on landing — hidden once preview opens via CSS z-index */}
      {!themeData && <Background3D />}
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Toast notification */}
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
              color: '#fff',
              maxWidth: '90vw',
              fontSize: '12px',
              fontWeight: 600,
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


      {/* Floating History Button — always rendered; z-[2001] lifts it above the preview modal (z-[2000]) */}
      <motion.button
        onClick={() => setIsHistoryOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-8 left-6 z-[2001] flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white/70 hover:text-white hover:border-primary/40 transition-all duration-300"
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

      {/* History Panel */}
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

          {/* Scroll Indicator */}
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

        {/* PortfolioPreview moved outside main — see below */}

        <Gallery
          onSelect={(themePrompt) => {
            setUserData((prev) => ({ ...prev, prompt: themePrompt }));
            document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
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

      {/* Portfolio preview — rendered at ROOT level, outside <main>, so fixed z-index works correctly */}
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
              // Logic for actual deployment would go here
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
