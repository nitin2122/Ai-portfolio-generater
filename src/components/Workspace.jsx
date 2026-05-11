import React, { useState } from 'react';
import { Sparkles, Loader2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Workspace({ onGenerate, isGenerating, userData, setUserData }) {
  const [logs, setLogs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.prompt || !userData.name || !userData.role) return;
    
    // Simulate neural logs with unique timestamps captured at submission time
    const now = new Date();
    setLogs([
      { msg: 'Initializing Neural Link...',      time: new Date(now.getTime() + 0).toLocaleTimeString() },
      { msg: 'Analyzing Role Precision...',       time: new Date(now.getTime() + 800).toLocaleTimeString() },
      { msg: 'Mapping Aesthetic DNA...',          time: new Date(now.getTime() + 1600).toLocaleTimeString() },
      { msg: 'Synthesizing Content Layers...',    time: new Date(now.getTime() + 2400).toLocaleTimeString() },
      { msg: 'Finalizing Visual Polish...',       time: new Date(now.getTime() + 3200).toLocaleTimeString() },
    ]);
    
    onGenerate(userData);
  };

  return (
    <section id="workspace" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-primary mb-4"
          >
            <Cpu size={16} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Neural Engine V2</span>
          </motion.div>
          <h2 className="text-5xl font-display font-bold mb-6">Creative Interface</h2>
          <p className="text-text-dim max-w-2xl mx-auto text-lg">
            Command the AI to architect your digital identity. Define your aesthetic, and witness the synthesis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="glass p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-primary tracking-widest uppercase">Identity Name</label>
                  <input 
                    type="text" 
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Julian Vaus"
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-primary tracking-widest uppercase">Professional Role</label>
                  <input 
                    type="text" 
                    value={userData.role}
                    onChange={(e) => setUserData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Visual Architect"
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-primary tracking-widest uppercase">Artistic Vision</label>
                  {userData.prompt && userData.prompt.includes('portfolio') && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold uppercase tracking-widest">
                      Theme Synced
                    </span>
                  )}
                </div>
                <textarea 
                  value={userData.prompt}
                  onChange={(e) => setUserData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe the aesthetic mood, color palette, and layout style..."
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary/50 transition-colors min-h-[150px] resize-none"
                />
              </div>

              {isGenerating && (
                <div className="bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-[10px] text-text-dim overflow-hidden">
                  <div className="flex flex-col gap-1">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.8 }}
                      >
                        <span className="text-primary opacity-50 mr-2">[{log.time}]</span> {log.msg}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className={`btn-primary w-full flex items-center justify-center gap-4 ${isGenerating || !userData.prompt || !userData.name || !userData.role ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isGenerating || !userData.prompt || !userData.name || !userData.role}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    SYNTHESIZING DESIGN...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    INITIALIZE GENERATION
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
