import React from 'react';
import { motion } from 'framer-motion';

// ─── T1: KINETIC NOIR — dark terminal, left nav strip, huge display type ──────
export function KineticNoir({ t, u }) {
  const { bg='#060608', text='#f0f0f0', accent='#c8ff00', bio='', skills=[], experience=[] } = t;
  const fd = t.fontDisplay || 'Space Grotesk'; const fb = t.fontBody || 'Manrope';
  const name = u?.name || 'DESIGNER'; const role = u?.role || 'Creative Director';
  const [first, ...rest] = name.split(' ');
  return (
    <div style={{ background: bg, color: text, fontFamily: `'${fb}',sans-serif`, minHeight: '100%', display: 'flex' }}>
      {/* Left rail */}
      <div style={{ width: 56, background: `${text}04`, borderRight: `1px solid ${accent}18`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, gap: 40, flexShrink: 0 }}>
        {['P','W','C'].map(l => <span key={l} style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, color: `${text}30`, writingMode: 'vertical-rl' }}>{l}</span>)}
        <div style={{ flex: 1 }} />
        <div style={{ width: 1, height: 48, background: `${accent}40` }} />
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: 'clamp(32px,5vw,72px) clamp(24px,5vw,64px)' }}>
        {/* Nav */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(48px,8vw,100px)' }}>
          <span style={{ fontFamily: `'${fd}',sans-serif`, fontWeight: 900, fontSize: 'clamp(16px,2vw,22px)', letterSpacing: -1, color: text }}>{first}<span style={{ color: accent }}>.</span></span>
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 4, color: `${text}40` }}>SYS://PORTFOLIO</span>
        </motion.div>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 6, color: accent, marginBottom: 20 }}>{role.toUpperCase()}</div>
          <h1 style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(40px,8vw,110px)', fontWeight: 900, lineHeight: 0.88, letterSpacing: -4, color: text, marginBottom: 40 }}>
            {first.toUpperCase()}<br /><span style={{ color: accent }}>{(rest.join(' ') || 'STUDIO').toUpperCase()}</span>
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, marginBottom: 64 }}>
            <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', lineHeight: 1.7, color: text, opacity: 0.55 }}>{bio || `${name} — ${role}`}</p>
            <div>
              <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: 5, color: accent, marginBottom: 12 }}>CORE_SKILLS[]</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map(s => <span key={s} style={{ padding: '4px 12px', border: `1px solid ${text}20`, borderRadius: 2, fontSize: 9, fontWeight: 700, color: text, letterSpacing: 2, textTransform: 'uppercase', fontFamily: `monospace` }}>{s}</span>)}
              </div>
            </div>
          </div>
        </motion.div>
        {/* Experience */}
        {experience.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ margin: '-60px' }}
            style={{ borderTop: `1px solid ${text}10`, padding: '28px 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: 4, color: accent, marginBottom: 8 }}>0{i+1} // {e.duration}</div>
              <div style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(18px,3vw,36px)', fontWeight: 900, letterSpacing: -1, color: text }}>{(e.role||'').toUpperCase()}</div>
              <p style={{ fontSize: 12, color: text, opacity: 0.4, marginTop: 6 }}>{e.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accent }}>{e.company}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── T2: LUMINARY — cream editorial, serif heavy, magazine grid ───────────────
export function Luminary({ t, u }) {
  const { bg='#faf7f2', text='#1a1614', accent='#c4933f', bio='', aboutText='', skills=[], experience=[] } = t;
  const fd = t.fontDisplay || 'Cormorant Garamond'; const fb = t.fontBody || 'Inter';
  const name = u?.name || 'Designer'; const role = u?.role || 'Creative Director';
  const [first, ...rest] = name.split(' ');
  return (
    <div style={{ background: bg, color: text, fontFamily: `'${fb}',sans-serif`, minHeight: '100%' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: `1px solid ${text}12` }}>
        <span style={{ fontFamily: `'${fd}',serif`, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, color: text }}>{name}</span>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Work','About','Contact'].map(n => <span key={n} style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: `${text}50`, cursor: 'pointer' }}>{n}</span>)}
        </div>
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 3, color: accent }}>ISSUE 01 — 2026</span>
      </div>
      {/* Hero — asymmetric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', minHeight: '55vh', borderBottom: `1px solid ${text}12` }}>
        <div style={{ padding: 'clamp(40px,6vw,80px)', borderRight: `1px solid ${text}12`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 6, color: accent, marginBottom: 16, textTransform: 'uppercase' }}>{role}</div>
          <h1 style={{ fontFamily: `'${fd}',serif`, fontSize: 'clamp(48px,7vw,96px)', fontWeight: 700, lineHeight: 0.9, letterSpacing: -2, color: text, marginBottom: 32 }}>
            {first}<br /><em style={{ color: accent }}>{rest.join(' ') || 'Studio'}</em>
          </h1>
          <blockquote style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 20, fontFamily: `'${fd}',serif`, fontSize: 'clamp(16px,2vw,22px)', fontStyle: 'italic', color: text, opacity: 0.7, lineHeight: 1.5 }}>
            "{bio || aboutText || 'Design is the silent ambassador of your brand.'}"
          </blockquote>
        </div>
        <div style={{ padding: 'clamp(40px,6vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 5, color: `${text}40`, marginBottom: 20, textTransform: 'uppercase' }}>Expertise</div>
            {skills.map(s => <div key={s} style={{ padding: '10px 0', borderBottom: `1px solid ${text}10`, fontSize: 13, fontWeight: 500, color: text, letterSpacing: 0.5 }}>{s}</div>)}
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontFamily: `'${fd}',serif`, fontWeight: 700, color: bg }}>{first[0]}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Experience — editorial cards */}
      <div style={{ padding: 'clamp(40px,5vw,60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 32 }}>
        {experience.map((e, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} style={{ background: `${text}04`, borderRadius: 2, padding: 28, border: `1px solid ${text}08` }}>
            <div style={{ fontFamily: `'${fd}',serif`, fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: text, marginBottom: 4 }}>{e.company}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: accent, textTransform: 'uppercase', marginBottom: 12 }}>{e.role}</div>
            <div style={{ fontSize: 11, color: `${text}40`, marginBottom: 10 }}>{e.duration}</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: text, opacity: 0.6 }}>{e.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── T3: LUMINOUS — deep purple, glassmorphism cards, gradient blobs ──────────
export function Luminous({ t, u }) {
  const { bg='#0f0a1f', text='#f3f0ff', accent='#a78bfa', bio='', skills=[], experience=[] } = t;
  const fd = t.fontDisplay || 'Inter'; const fb = t.fontBody || 'Inter';
  const name = u?.name || 'Designer'; const role = u?.role || 'Creative Director';
  const glass = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 20 };
  return (
    <div style={{ background: bg, color: text, fontFamily: `'${fb}',sans-serif`, minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient blobs */}
      <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: `${accent}20`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: '#818cf820', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Centered hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(60px,8vw,100px) 40px', textAlign: 'center', minHeight: '50vh' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} style={{ ...glass, padding: 'clamp(32px,5vw,56px) clamp(40px,6vw,80px)', maxWidth: 640 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 6, color: accent, marginBottom: 16 }}>{role.toUpperCase()}</div>
            <h1 style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, letterSpacing: -2, color: text, marginBottom: 20, lineHeight: 1 }}>{name}</h1>
            <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', lineHeight: 1.7, color: text, opacity: 0.6, marginBottom: 28 }}>{bio || `${role} with a passion for beautiful interfaces.`}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {skills.slice(0,5).map(s => <span key={s} style={{ padding: '6px 16px', borderRadius: 100, border: `1px solid ${accent}40`, fontSize: 10, fontWeight: 700, color: accent }}>{s}</span>)}
            </div>
          </motion.div>
        </div>
        {/* Glass cards grid */}
        <div style={{ padding: '0 clamp(24px,5vw,60px) 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {experience.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6, boxShadow: `0 24px 48px ${accent}20` }}
              viewport={{ margin: '-40px' }} style={{ ...glass, padding: 28, transition: 'all 0.3s' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 14, fontWeight: 900, color: accent }}>0{i+1}</div>
              <div style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(16px,2vw,20px)', fontWeight: 800, color: text, marginBottom: 4 }}>{e.company}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: accent, marginBottom: 8 }}>{e.role?.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: `${text}40`, marginBottom: 12 }}>{e.duration}</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: text, opacity: 0.55 }}>{e.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── T4: ZEN — off-white, hairline borders, maximum whitespace, DM Sans ───────
export function Zen({ t, u }) {
  const { bg='#fefbf7', text='#1f2937', accent='#6b7280', bio='', skills=[], experience=[] } = t;
  const fd = t.fontDisplay || 'DM Sans'; const fb = t.fontBody || 'DM Sans';
  const name = u?.name || 'Designer'; const role = u?.role || 'Creative Director';
  const hr = { height: 1, background: `${text}10`, border: 'none', margin: '0' };
  return (
    <div style={{ background: bg, color: text, fontFamily: `'${fb}',sans-serif`, minHeight: '100%' }}>
      {/* Minimal nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '28px 48px', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, color: `${text}50`, textTransform: 'uppercase' }}>{role}</span>
        <span style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 16, fontWeight: 700, color: text }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, color: `${text}30` }}>2026</span>
      </div>
      <hr style={hr} />
      {/* Hero — centered, generous space */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(60px,10vw,120px) 48px', textAlign: 'center' }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(44px,9vw,120px)', fontWeight: 300, letterSpacing: -3, lineHeight: 0.9, color: text, marginBottom: 40 }}>
          {name.split(' ').map((w, i) => <span key={i} style={{ display: 'block', fontWeight: i === 0 ? 700 : 300 }}>{w}</span>)}
        </motion.h1>
        <p style={{ maxWidth: 440, fontSize: 'clamp(14px,1.8vw,17px)', lineHeight: 1.8, color: text, opacity: 0.5, fontWeight: 300 }}>{bio || `Thoughtful work for considered people.`}</p>
      </div>
      <hr style={hr} />
      {/* Two-column: skills + work */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
        <div style={{ padding: 48, borderRight: `1px solid ${text}10` }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 5, color: `${text}40`, marginBottom: 28, textTransform: 'uppercase' }}>Disciplines</div>
          {skills.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${text}08` }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent }} />
              <span style={{ fontSize: 13, fontWeight: 400, color: text }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 48 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 5, color: `${text}40`, marginBottom: 28, textTransform: 'uppercase' }}>Selected Work</div>
          {experience.map((e, i) => (
            <motion.div key={i} whileHover={{ x: 4 }} style={{ padding: '24px 0', borderBottom: `1px solid ${text}08`, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontFamily: `'${fd}',sans-serif`, fontSize: 'clamp(16px,2vw,22px)', fontWeight: 600, color: text }}>{e.company}</span>
                <span style={{ fontSize: 11, color: `${text}35` }}>{e.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: accent, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{e.role}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: text, opacity: 0.5 }}>{e.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── T5: NEON GRID — cyberpunk, Space Mono, grid bg, neon glows ───────────────
export function NeonGrid({ t, u }) {
  const { bg='#0d0221', text='#e0aaff', accent='#ff006e', bio='', skills=[], experience=[] } = t;
  const fd = t.fontDisplay || 'Space Mono'; const fb = t.fontBody || 'Space Mono';
  const name = u?.name || 'USER_001'; const role = u?.role || 'CREATIVE_DEV';
  const neon = (c) => `0 0 8px ${c}80, 0 0 24px ${c}40`;
  const gridBg = `repeating-linear-gradient(${text}06 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,${text}06 0 1px,transparent 1px 40px)`;
  return (
    <div style={{ background: bg, backgroundImage: gridBg, color: text, fontFamily: `'${fb}',monospace`, minHeight: '100%' }}>
      {/* HUD header */}
      <div style={{ borderBottom: `1px solid ${accent}40`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: `0 1px 0 ${accent}20` }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: accent, textShadow: neon(accent) }}>SYS://PORTFOLIO_v2.0</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['[ABOUT]','[WORK]','[CONTACT]'].map(n => <span key={n} style={{ fontSize: 9, color: `${text}50`, cursor: 'pointer' }}>{n}</span>)}
        </div>
        <span style={{ fontSize: 9, color: `${text}40` }}>USER: {name.toUpperCase()}</span>
      </div>
      {/* Main grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100% - 44px)' }}>
        {/* Left terminal panel */}
        <div style={{ borderRight: `1px solid ${accent}30`, padding: 24, background: `${bg}cc` }}>
          <div style={{ fontSize: 9, color: accent, marginBottom: 16, textShadow: neon(accent) }}>$ whoami</div>
          <div style={{ fontSize: 11, color: text, marginBottom: 8 }}>&gt; {name}</div>
          <div style={{ fontSize: 11, color: `${text}60`, marginBottom: 24 }}>&gt; {role}</div>
          <div style={{ fontSize: 9, color: accent, marginBottom: 12 }}>$ skills --list</div>
          {skills.map(s => <div key={s} style={{ fontSize: 10, color: `${text}70`, marginBottom: 4 }}>&gt; {s}</div>)}
          <div style={{ marginTop: 24, padding: '12px 16px', border: `1px solid ${accent}40`, borderRadius: 4, fontSize: 9, color: accent, textShadow: neon(accent), background: `${accent}08` }}>
            STATUS: AVAILABLE
          </div>
        </div>
        {/* Right content */}
        <div style={{ padding: 40 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontSize: 9, color: accent, marginBottom: 12 }}>$ cat profile.txt</div>
            <h1 style={{ fontFamily: `'${fd}',monospace`, fontSize: 'clamp(28px,4vw,56px)', fontWeight: 700, letterSpacing: -1, color: text, textShadow: neon(text), marginBottom: 16, lineHeight: 1.1 }}>{name.toUpperCase()}</h1>
            <div style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: 3, marginBottom: 24, textShadow: neon(accent) }}>{role.toUpperCase()}</div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: `${text}70`, marginBottom: 40, maxWidth: 480 }}>{bio || `// ${role} — building interfaces at the edge of human-machine interaction.`}</p>
          </motion.div>
          {/* Experience log */}
          <div style={{ fontSize: 9, color: accent, marginBottom: 16, textShadow: neon(accent) }}>$ cat experience.log</div>
          {experience.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: '-40px' }}
              style={{ border: `1px solid ${text}15`, borderRadius: 4, padding: '16px 20px', marginBottom: 12, background: `${text}03` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: text }}>{e.company?.toUpperCase()}</span>
                <span style={{ fontSize: 9, color: `${text}40` }}>{e.duration}</span>
              </div>
              <div style={{ fontSize: 9, color: accent, marginBottom: 8, textShadow: neon(accent) }}>ROLE: {e.role?.toUpperCase()}</div>
              <p style={{ fontSize: 11, color: `${text}55`, lineHeight: 1.6 }}>{e.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
