import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { Download, X, ChevronDown, FileImage, FileText, Sparkles } from 'lucide-react';

// ─── Floating Toolbar (always on top, never clipped) ────────────────────────
function FloatingToolbar({ variant, setVariant, accent, onExport, onClose, userName, isPro, onDeploy }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [exporting, setExporting] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (e.type === 'keydown' && e.key === 'Escape') { setShowMenu(false); return; }
      if (btnRef.current && !btnRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', h);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', h); };
  }, []);

  const toggle = () => {
    if (!showMenu && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setShowMenu((p) => !p);
  };

  const doExport = async (fmt) => {
    setShowMenu(false);
    setExporting(true);
    try { await onExport(fmt); } finally { setExporting(false); }
  };

  const doDeploy = () => {
    setShowMenu(false);
    onDeploy();
  };

  return (
    <>
      {/* Sticky header bar */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 100,
        flexShrink: 0,
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        {/* Left: traffic lights + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.08)' }} />
          <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>
            {userName || 'Portfolio'} // Preview
          </div>
        </div>

        {/* Center: variants */}
        <div style={{ display: 'flex', background: '#f0f0f0', padding: '3px', borderRadius: '100px', gap: '2px' }}>
          {[1, 2, 3].map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              style={{
                padding: '4px 14px', border: 'none', borderRadius: '100px',
                background: variant === v ? '#222' : 'transparent',
                color: variant === v ? '#fff' : '#999',
                cursor: 'pointer', fontSize: '9px', fontWeight: 900, letterSpacing: '1px',
                transition: 'all 0.2s',
              }}
            >
              V{v}
            </button>
          ))}
        </div>

        {/* Right: download + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div ref={btnRef} style={{ position: 'relative' }}>
            <button
              onClick={toggle}
              disabled={exporting}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '100px', border: 'none',
                background: accent || '#ccff00', color: '#000',
                cursor: exporting ? 'wait' : 'pointer',
                fontSize: '9px', fontWeight: 900, letterSpacing: '1.5px',
                textTransform: 'uppercase', opacity: exporting ? 0.6 : 1,
              }}
            >
              <Download size={12} />
              {exporting ? 'Saving…' : 'Export'}
              <ChevronDown size={10} style={{ transform: showMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '50%', background: '#f5f5f5', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Close preview"
          >
            <X size={14} color="#333" />
          </button>
        </div>
      </div>

      {/* Fixed-position dropdown menu (escapes overflow:hidden) */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed', top: menuPos.top, right: menuPos.right,
              background: '#fff', border: '1px solid #e5e5e5', borderRadius: '14px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.18)', padding: '4px', minWidth: '220px', zIndex: 99999,
            }}
          >
            <button
              onClick={doDeploy}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '8px 12px', border: 'none', borderRadius: '10px',
                background: isPro ? '#000' : 'transparent', cursor: 'pointer', textAlign: 'left',
                color: isPro ? '#fff' : '#000',
                marginBottom: '4px'
              }}
              onMouseEnter={(e) => { if (!isPro) e.currentTarget.style.background = '#f5f5f5'; }}
              onMouseLeave={(e) => { if (!isPro) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: isPro ? 'rgba(255,255,255,0.1)' : `${accent || '#ccff00'}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={12} style={{ color: isPro ? accent || '#ccff00' : accent || '#ccff00' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700 }}>Deploy Custom URL</div>
                <div style={{ fontSize: '9px', color: isPro ? '#aaa' : '#aaa', fontWeight: 500 }}>{isPro ? 'Live web hosting' : 'Pro feature only'}</div>
              </div>
            </button>

            <div style={{ height: '1px', background: '#e5e5e5', margin: '4px 0' }} />

            {[
              { fmt: 'pdf',  icon: FileText,  label: 'Save as PDF',  sub: 'Opens print dialog' },
              { fmt: 'html', icon: FileImage, label: 'Download HTML', sub: 'Self-contained · All browsers' },
            ].map(({ fmt, icon: Icon, label, sub }) => (
              <button
                key={fmt}
                onClick={() => doExport(fmt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '8px 12px', border: 'none', borderRadius: '10px',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: `${accent || '#ccff00'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={12} style={{ color: accent || '#ccff00' }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#222' }}>{label}</div>
                  <div style={{ fontSize: '9px', color: '#aaa', fontWeight: 500 }}>{sub}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PortfolioPreview({ themeData, userData, variant, setVariant, onExport, onClose, isPro, onDeploy }) {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const [progressValue, setProgressValue] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgressValue(v));

  // ESC + body lock
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });
  useEffect(() => {
    if (!themeData) return;
    document.body.style.overflow = 'hidden';
    const k = (e) => { if (e.key === 'Escape') closeRef.current?.(); };
    document.addEventListener('keydown', k);
    return () => { document.body.style.overflow = 'unset'; document.removeEventListener('keydown', k); };
  }, [themeData]);

  // ─── FIX: All hooks must be called unconditionally (Rules of Hooks). ────────
  // synth overlay state & font loader moved above the early-return guard.
  const [synth, setSynth] = useState(true);
  useEffect(() => {
    if (!themeData) return;
    setSynth(true);
    const t = setTimeout(() => setSynth(false), 700);
    return () => clearTimeout(t);
  }, [variant, themeData]);

  // Load fonts — deduplicated so switching variants never double-inserts the same link
  useEffect(() => {
    if (!themeData) return;
    const { fontDisplay, fontBody } = themeData;
    if (!fontDisplay || !fontBody) return;
    const href = `https://fonts.googleapis.com/css2?family=${fontDisplay.replace(/['\s]/g, '+')}:wght@400;700;900&family=${fontBody.replace(/['\s]/g, '+')}:wght@300;400;700;800&display=swap`;
    // Only inject if not already present (prevents FOUC on variant switches)
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    // Keep the font loaded even after unmount so text doesn't re-flash
  }, [themeData]);

  if (!themeData) return null;

  const {
    bg = '#0a0a0b', text = '#f5f5f5', accent = '#ccff00',
    fontDisplay = "'Space Grotesk', sans-serif", fontBody = "'Inter', sans-serif",
    bio = '', aboutText = '', skills = [], experience = [], imagePrompts = [],
  } = themeData;

  const name = userData?.name || 'User';
  const role = userData?.role || 'Creative Director';
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');

  // ─── Variant 1: Kinetic Noir (Full-bleed dark) ─────────────────────────
  const renderV1 = () => (
    <div style={{ padding: 'clamp(32px, 6vw, 100px) clamp(20px, 5vw, 60px)', minHeight: '100%' }}>
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(60px, 10vw, 140px)', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: fontDisplay, fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, letterSpacing: '-0.02em', color: text }}>
          {firstName}<span style={{ color: accent }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 40px)', fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: text, flexWrap: 'wrap' }}>
          {['PROJECTS', 'STUDIO', 'JOURNAL'].map(n => (
            <motion.span key={n} whileHover={{ color: accent }} style={{ cursor: 'pointer', opacity: 0.6, transition: 'color 0.3s' }}>{n}</motion.span>
          ))}
        </div>
      </motion.nav>

      <div style={{ maxWidth: '900px' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '1px', background: accent }} />
            <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '5px', color: accent, textTransform: 'uppercase' }}>{role}</span>
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(36px, 8vw, 120px)', lineHeight: 0.88, marginBottom: '48px', fontWeight: 900, letterSpacing: '-0.05em', color: text }}>
            {bio ? bio.split(' ').slice(0, 3).join(' ').toUpperCase() : firstName.toUpperCase()}<br />
            <span style={{ color: accent }}>{bio ? bio.split(' ').slice(3, 6).join(' ').toUpperCase() + '.' : 'PORTFOLIO.'}</span>
          </h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(32px, 6vw, 80px)', marginBottom: 'clamp(80px, 12vw, 160px)' }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} style={{ fontSize: 'clamp(14px, 2vw, 18px)', lineHeight: 1.6, color: text }}>
            {bio || `${name} is a creative professional specializing in ${role}.`}
          </motion.p>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '4px', color: accent, marginBottom: '16px', textTransform: 'uppercase' }}>Core Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(s => (
                <motion.span key={s} whileHover={{ borderColor: accent, color: accent }} style={{ padding: '6px 16px', borderRadius: '100px', border: `1px solid ${text}20`, fontSize: '10px', fontWeight: 700, color: text, transition: '0.3s', cursor: 'default' }}>
                  {s.toUpperCase()}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {experience.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {experience.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: '-80px' }} whileHover={{ x: 12 }} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: 'clamp(20px, 4vw, 40px) 0', borderBottom: `1px solid ${text}12`, flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 900, color: accent, letterSpacing: '3px', marginBottom: '12px' }}>0{i + 1} // {exp.duration || ''}</div>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: 'clamp(22px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: text }}>{(exp?.role || 'Expert').toUpperCase()}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', fontWeight: 800, color: accent, marginBottom: '6px' }}>{exp?.company || ''}</div>
                    <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '3px', color: text, opacity: 0.3, textTransform: 'uppercase' }}>View →</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Variant 2: Editorial Split (Asymmetric magazine) ──────────────────
  const renderV2 = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', minHeight: '100vh' }}>
      <div style={{ padding: 'clamp(32px, 5vw, 80px) clamp(20px, 4vw, 60px)', borderRight: `1px solid ${text}10`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '40px', minHeight: '300px' }}>
        <motion.div whileHover={{ scale: 1.03 }} style={{ fontFamily: fontDisplay, fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, cursor: 'pointer', color: text }}>
          {firstName}
        </motion.div>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '5px', color: accent, textTransform: 'uppercase', marginBottom: '16px' }}>{role}</div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(32px, 5vw, 72px)', lineHeight: 1, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '32px', color: text }}>
            {aboutText ? aboutText.split(' ').slice(0, 2).join(' ').toUpperCase() : 'CRAFTING'}<br />
            {aboutText ? aboutText.split(' ').slice(2, 4).join(' ').toUpperCase() : 'DIGITAL'}<br />
            <span style={{ color: accent }}>{aboutText ? aboutText.split(' ').slice(4, 6).join(' ').toUpperCase() + '.' : 'POETRY.'}</span>
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.55, maxWidth: '380px', lineHeight: 1.6, color: text }}>{bio}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {skills.slice(0, 3).map(s => (
            <span key={s} style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '3px', color: accent, textTransform: 'uppercase' }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: 'clamp(32px, 5vw, 80px) clamp(20px, 4vw, 60px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {experience.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ backgroundColor: `${accent}08` }} style={{ borderBottom: `1px solid ${text}10`, padding: '28px', borderRadius: '12px', transition: '0.3s' }}>
              <div style={{ fontSize: '9px', fontWeight: 900, color: text, opacity: 0.25, letterSpacing: '3px', marginBottom: '8px', textTransform: 'uppercase' }}>{exp.duration}</div>
              <h2 style={{ fontFamily: fontDisplay, fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, marginBottom: '10px', color: text }}>{exp?.company || ''}</h2>
              <div style={{ color: accent, fontWeight: 800, fontSize: '12px', marginBottom: '16px', letterSpacing: '1px' }}>{(exp?.role || '').toUpperCase()}</div>
              <p style={{ opacity: 0.5, fontSize: '13px', lineHeight: 1.6, color: text }}>{exp.description || 'Pushing boundaries through design and innovation.'}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Variant 3: Centered Monumental ────────────────────────────────────
  const renderV3 = () => (
    <div>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 60px)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }}>
          <div style={{ color: accent, fontSize: '10px', fontWeight: 900, letterSpacing: '8px', marginBottom: '28px' }}>{role.toUpperCase()}</div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(48px, 10vw, 160px)', lineHeight: 0.82, fontWeight: 900, letterSpacing: '-0.07em', color: text }}>
            {firstName}<br />{lastName}
          </h1>
          <div style={{ width: '80px', height: '1px', background: text, margin: '48px auto', opacity: 0.12 }} />
          <p style={{ maxWidth: '520px', fontSize: 'clamp(13px, 2vw, 16px)', opacity: 0.45, lineHeight: 1.6, color: text }}>{bio}</p>
        </motion.div>
      </div>

      {experience.length > 0 && (
        <div style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 60px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 'clamp(40px, 6vw, 100px)' }}>
                <motion.div initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: '-80px' }} whileHover={{ y: -8 }}>
                  <div style={{ aspectRatio: '16/9', background: `${accent}08`, marginBottom: '28px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: `1px solid ${text}08` }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${accent}12, transparent)` }} />
                    <div style={{ position: 'absolute', bottom: '28px', left: '28px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 900, color: accent, letterSpacing: '2px', marginBottom: '6px' }}>PROJECT // 0{i + 1}</div>
                      <div style={{ fontFamily: fontDisplay, fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 700, color: text }}>{exp?.company || ''}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 md:p-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: '1400px', height: '90vh',
          background: bg, color: text, overflow: 'hidden',
          position: 'relative', borderRadius: '16px',
          boxShadow: `0 60px 160px -40px ${accent}30, 0 0 0 1px rgba(255,255,255,0.06)`,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Toolbar */}
        <FloatingToolbar
          variant={variant} setVariant={setVariant}
          accent={accent} onExport={onExport} onClose={onClose} userName={firstName}
          isPro={isPro} onDeploy={onDeploy}
        />

        {/* Scrollable content */}
        <div
          id="capture-area"
          ref={scrollRef}
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'hidden',
            position: 'relative', scrollBehavior: 'smooth',
            backgroundColor: bg, color: text, fontFamily: fontBody,
          }}
        >
          {/* Ambient glow */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(800px circle at 50% 0%, ${accent}06, transparent 60%)`, zIndex: 0 }} />

          <div id="portfolio-content-inner" style={{ position: 'relative', zIndex: 1 }}>
            {variant === 1 && renderV1()}
            {variant === 2 && renderV2()}
            {variant === 3 && renderV3()}
          </div>
        </div>

        {/* Synthesis overlay */}
        <AnimatePresence mode="wait">
          {synth && (
            <motion.div key="synth" initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 200, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '36px', height: '36px', border: `1px solid ${accent}`, borderRadius: '4px', marginBottom: '24px' }} />
              <div style={{ fontFamily: fontDisplay, fontSize: '9px', letterSpacing: '6px', fontWeight: 900, color: text, opacity: 0.4 }}>SYNTHESIZING_DESIGN</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `${accent}15`, zIndex: 100 }}>
          <motion.div style={{ height: '100%', background: accent, width: `${progressValue * 100}%`, transition: 'width 0.1s' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
