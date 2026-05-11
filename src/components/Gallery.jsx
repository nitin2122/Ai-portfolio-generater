import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Template definitions ───────────────────────────────────────────────────
const templates = [
  {
    id: 'kinetic-noir',
    title: 'Kinetic Noir',
    system: '01',
    tag: 'Dark · Terminal · Cinematic',
    bg: '#060608',
    accent: '#c8ff00',
    text: '#f0f0f0',
    prompt: 'TEMPLATE_1: Kinetic Noir. Theme: Ultra-dark (#060608). Accent: Electric lime (#c8ff00). Typography: Space Grotesk bold display, Manrope body. Layout: Full-bleed hero, split-screen experience section, terminal-style skills list. Cinematic & technical.',
  },
  {
    id: 'luminary',
    title: 'Luminary',
    system: '02',
    tag: 'Light · Editorial · Magazine',
    bg: '#faf7f2',
    accent: '#c4933f',
    text: '#1a1614',
    prompt: 'TEMPLATE_2: Luminary Editorial. Theme: Warm cream (#faf7f2). Accent: Antique gold (#c4933f). Typography: Cormorant Garamond serif display, Inter body. Layout: Asymmetric magazine grid, large pull-quote hero, editorial project showcase. Premium & warm.',
  },
  {
    id: 'luminous-gradient',
    title: 'Luminous',
    system: '03',
    tag: 'Gradient · Glassmorphism · Modern',
    bg: '#0f0a1f',
    accent: '#a78bfa',
    text: '#f3f0ff',
    prompt: 'TEMPLATE_3: Luminous Gradient. Theme: Deep purple (#0f0a1f). Accent: Soft purple (#a78bfa). Typography: Inter bold display, Inter body. Layout: Gradient overlays, glassmorphic cards, fluid blob backgrounds, smooth animations. Modern & ethereal.',
  },
  {
    id: 'zen-minimal',
    title: 'Zen',
    system: '04',
    tag: 'Minimal · Whitespace · Zen',
    bg: '#fefbf7',
    accent: '#6b7280',
    text: '#1f2937',
    prompt: 'TEMPLATE_4: Zen Minimal. Theme: Off-white (#fefbf7). Accent: Slate gray (#6b7280). Typography: Grotesk display, Inter body. Layout: Generous whitespace, single-column layout, subtle borders, high legibility. Minimalist & calm.',
  },
  {
    id: 'neon-grid',
    title: 'Neon Grid',
    system: '05',
    tag: 'Cyberpunk · Grid · Tech',
    bg: '#0d0221',
    accent: '#ff006e',
    text: '#e0aaff',
    prompt: 'TEMPLATE_5: Neon Grid. Theme: Deep cyber-purple (#0d0221). Accent: Hot pink (#ff006e). Typography: Space Mono display, Space Mono body. Layout: Grid pattern background, tech borders, neon glows, cyberpunk aesthetic. Futuristic & bold.',
  },
];

// ─── Kinetic Noir Preview ──────────────────────────────────────────────────
function KineticNoirPreview({ t, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg, overflow: 'hidden' }}>
      {/* Scanline texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
        pointerEvents: 'none',
      }} />

      {/* Left: vertical nav strip */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={active ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '72px',
          borderRight: `1px solid ${t.accent}20`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '40px', padding: '32px 0',
        }}
      >
        <div style={{ writingMode: 'vertical-rl', fontSize: '8px', fontWeight: 900, letterSpacing: '4px', color: t.accent, opacity: 0.6, textTransform: 'uppercase' }}>PORTFOLIO</div>
        <div style={{ width: '1px', flex: 1, background: `linear-gradient(to bottom, ${t.accent}00, ${t.accent}40, ${t.accent}00)` }} />
        <div style={{ fontSize: '8px', fontWeight: 900, color: t.text, opacity: 0.3, writingMode: 'vertical-rl' }}>2026</div>
      </motion.div>

      {/* Main content */}
      <div style={{ position: 'absolute', inset: 0, left: '72px', padding: '36px 40px 36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '5px', color: t.accent, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div style={{ width: '20px', height: '1px', background: t.accent }} />
          Creative Director
        </motion.div>

        {/* Big heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 'clamp(32px, 5vw, 68px)', fontWeight: 900, lineHeight: 0.88, color: t.text, letterSpacing: '-0.03em', marginBottom: '20px' }}
        >
          DEFINING<br />THE FUTURE<br /><span style={{ color: t.accent, WebkitTextStroke: `1px ${t.accent}`, WebkitTextFillColor: 'transparent' }}>OF DESIGN.</span>
        </motion.div>

        {/* Terminal skills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{ fontFamily: 'monospace', fontSize: '9px', color: t.accent, opacity: 0.7, display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}
        >
          {['> Strategy', '> Design', '> Code', '> Vision'].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </motion.div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{ padding: '8px 20px', borderRadius: '100px', background: t.accent, color: '#000', fontSize: '9px', fontWeight: 900, letterSpacing: '2px' }}>VIEW WORK →</div>
          <div style={{ fontSize: '8px', color: t.text, opacity: 0.3, fontWeight: 700, letterSpacing: '2px' }}>12 PROJECTS</div>
        </motion.div>
      </div>

      {/* Right glow */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', background: `radial-gradient(ellipse at right center, ${t.accent}08, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `linear-gradient(${t.accent} 1px, transparent 1px), linear-gradient(90deg, ${t.accent} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
    </div>
  );
}

// ─── Luminary Preview ──────────────────────────────────────────────────────
function LuminaryPreview({ t, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg, overflow: 'hidden', fontFamily: 'Georgia, serif' }}>
      {/* Top rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', height: '1px', background: t.accent, transformOrigin: 'left', opacity: 0.4 }}
      />

      {/* Magazine header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ position: 'absolute', top: '52px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ fontSize: '11px', fontWeight: 900, color: t.accent, letterSpacing: '-0.01em', fontStyle: 'italic' }}>Portfolio</div>
        <div style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '3px', color: t.text, opacity: 0.4, textTransform: 'uppercase' }}>Issue No. I · 2026</div>
      </motion.div>

      {/* Main split layout */}
      <div style={{ position: 'absolute', inset: 0, top: '80px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Left: text */}
        <div style={{ padding: '24px 32px 24px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: `1px solid ${t.accent}20` }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(24px, 3.5vw, 52px)', fontWeight: 700, lineHeight: 0.95, color: t.text, letterSpacing: '-0.02em', marginBottom: '16px', fontStyle: 'italic' }}
          >
            Crafting<br />the art of<br /><span style={{ color: t.accent, fontStyle: 'normal' }}>tomorrow.</span>
          </motion.h2>
        </div>

        {/* Right: decorative element */}
        <div style={{ padding: '24px 40px 24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={active ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0.8, opacity: 0, rotate: -5 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', width: '100%', maxWidth: '200px' }}
          >
            <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '50%', border: `1px solid ${t.accent}30`, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${t.accent}20, ${t.bg})`,
              }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '8px', height: '8px', borderRadius: '50%', background: t.accent }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Luminous Gradient Preview ────────────────────────────────────────────
function LuminousGradientPreview({ t, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg, overflow: 'hidden' }}>
      {/* Animated gradient blobs */}
      <motion.div
        animate={active ? { y: [0, 20, -20, 0] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 60% 40%, ${t.accent}30, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content card with glassmorphism */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '280px',
            padding: '32px',
            borderRadius: '24px',
            background: `rgba(255, 255, 255, 0.05)`,
            border: `1px solid ${t.accent}40`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 8px 32px ${t.accent}15, inset 0 1px 1px ${t.accent}20`,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ fontSize: '28px', fontWeight: 900, color: t.text, marginBottom: '12px', lineHeight: 1.2 }}
          >
            Modern Aesthetics
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ fontSize: '11px', color: t.text, opacity: 0.7, marginBottom: '16px', lineHeight: 1.6 }}
          >
            Fluid gradients and glassmorphic design create a contemporary, ethereal aesthetic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
          >
            {['Design', 'Motion', 'AI'].map((s) => (
              <span key={s} style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '1px',
                padding: '6px 12px',
                borderRadius: '100px',
                border: `1px solid ${t.accent}50`,
                color: t.accent,
                textTransform: 'uppercase'
              }}>{s}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Zen Minimal Preview ────────────────────────────────────────────────────
function ZenMinimalPreview({ t, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg, overflow: 'hidden' }}>
      {/* Subtle grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${t.accent}08 1px, transparent 1px), linear-gradient(90deg, ${t.accent}08 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        opacity: 0.5,
      }} />

      {/* Single column layout */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            height: '2px',
            width: '40px',
            background: t.accent,
            marginBottom: '24px',
            transformOrigin: 'center',
          }}
        />

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontSize: '32px',
            fontWeight: 300,
            color: t.text,
            marginBottom: '16px',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          Simple<br />Elegance
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            fontSize: '11px',
            color: t.text,
            maxWidth: '180px',
            lineHeight: 1.8,
            letterSpacing: '0.01em',
            marginBottom: '24px',
          }}
        >
          Minimalist design celebrating whitespace and typography.
        </motion.p>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            height: '1px',
            width: '40px',
            background: t.accent,
            opacity: 0.3,
            transformOrigin: 'center',
          }}
        />
      </div>
    </div>
  );
}

// ─── Neon Grid Preview ────────────────────────────────────────────────────
function NeonGridPreview({ t, active }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.bg, overflow: 'hidden' }}>
      {/* Animated grid background */}
      <motion.div
        animate={active ? { opacity: 0.4 } : { opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${t.accent}40 1px, transparent 1px), linear-gradient(90deg, ${t.accent}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Center panel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            padding: '32px',
            border: `2px solid ${t.accent}`,
            borderRadius: '8px',
            background: `${t.bg}cc`,
            boxShadow: `0 0 20px ${t.accent}40, inset 0 0 20px ${t.accent}15`,
            maxWidth: '280px',
          }}
        >
          {/* Corner accents */}
          {[
            { top: '-8px', left: '-8px', w: '12px', h: '12px' },
            { top: '-8px', right: '-8px', w: '12px', h: '12px' },
            { bottom: '-8px', left: '-8px', w: '12px', h: '12px' },
            { bottom: '-8px', right: '-8px', w: '12px', h: '12px' },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: pos.w,
                height: pos.h,
                border: `1px solid ${t.accent}`,
                borderRadius: '2px',
              }}
            />
          ))}

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              fontSize: '24px',
              fontWeight: 900,
              color: t.text,
              marginBottom: '12px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            CYBER NEXUS
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              fontSize: '9px',
              color: t.text,
              fontFamily: 'monospace',
              opacity: 0.8,
              marginBottom: '12px',
            }}
          >
            » Future · Code · Vision
          </motion.div>

          <motion.div
            animate={active ? { boxShadow: `0 0 15px ${t.accent}` } : { boxShadow: `0 0 5px ${t.accent}20` }}
            style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
              marginTop: '12px',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export default function Gallery({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="gallery" className="py-32 bg-[#0a0a0b] text-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="h-[1px] w-10 bg-primary" />
              <span className="text-[9px] font-black tracking-[0.5em] text-primary uppercase">Architectural Systems</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
              Prototypes<span className="text-primary">.</span>
            </h2>
          </div>
          <p className="text-white/40 text-base max-w-xs font-medium leading-relaxed mb-1">
            Five distinct design philosophies. Hover to preview. Click to generate.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => {
            const previews = [KineticNoirPreview, LuminaryPreview, LuminousGradientPreview, ZenMinimalPreview, NeonGridPreview];
            const Preview = previews[i];
            const isHovered = hovered === t.id;

            return (
              <motion.div
                key={t.id}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect({ prompt: t.prompt, templateId: t.id, bg: t.bg, accent: t.accent, text: t.text })}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="cursor-pointer group"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: isHovered ? `1px solid ${t.accent}40` : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isHovered ? `0 40px 80px -20px ${t.accent}25` : '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.4s, box-shadow 0.4s',
                  }}
                >
                  {/* Preview */}
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: t.bg }}>
                    <Preview t={t} active={isHovered} />
                    <AnimatePresence>
                      {!isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute', inset: 0, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)',
                          }}
                        >
                          <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '4px', color: '#fff', textTransform: 'uppercase', opacity: 0.6 }}>
                            Hover to Preview
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info bar */}
                  <div style={{
                    background: '#111113',
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.accent, boxShadow: `0 0 8px ${t.accent}80` }} />
                        <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{t.title}</span>
                        <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>// {t.system}</span>
                      </div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '1px', paddingLeft: '18px' }}>{t.tag}</div>
                    </div>

                    <motion.div
                      animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        padding: '8px 18px', borderRadius: '100px',
                        background: t.accent, color: '#000',
                        fontSize: '9px', fontWeight: 900, letterSpacing: '1.5px',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}
                    >
                      Generate →
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
