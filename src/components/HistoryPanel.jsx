import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, RotateCcw, X, Sparkles } from 'lucide-react';

export default function HistoryPanel({ history, onRestore, onDelete, onClear, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full z-[3100] flex flex-col"
            style={{
              width: 'min(420px, 100vw)',
              background: 'linear-gradient(160deg, #141416 0%, #0d0d0e 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '-40px 0 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Clock size={14} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Generation Log</div>
                  <div className="text-white font-bold text-sm mt-0.5">Portfolio History</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClear}
                    className="text-[9px] font-black tracking-widest text-white/30 hover:text-red-400 uppercase transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                  >
                    Clear All
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors"
                >
                  <X size={18} className="text-white/60" />
                </motion.button>
              </div>
            </div>

            {/* Stats bar */}
            {history.length > 0 && (
              <div className="px-8 py-3 bg-white/[0.02] border-b border-white/5 flex items-center gap-4">
                <div className="text-[9px] font-black tracking-widest text-white/30 uppercase">
                  {history.length} Portfolio{history.length !== 1 ? 's' : ''} Generated
                </div>
                <div className="flex-1 h-[1px] bg-white/5" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            )}

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center px-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                    <Sparkles size={24} className="text-white/20" />
                  </div>
                  <div>
                    <div className="text-white/40 font-bold text-sm mb-1">No history yet</div>
                    <div className="text-white/20 text-xs leading-relaxed">
                      Generate your first portfolio to start building your creative log.
                    </div>
                  </div>
                </motion.div>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.04 }}
                    className="group relative rounded-2xl border border-white/5 overflow-hidden cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                    whileHover={{ borderColor: `${item.themeData?.accent || '#ccff00'}25`, backgroundColor: 'rgba(255,255,255,0.04)' }}
                  >
                    {/* Color accent strip */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                      style={{ background: item.themeData?.accent || '#ccff00' }}
                    />

                    <div className="pl-5 pr-4 py-4">
                      {/* Name + Role */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm truncate">{item.userData.name || 'Unnamed'}</div>
                          <div
                            className="text-[10px] font-bold uppercase tracking-widest truncate mt-0.5"
                            style={{ color: item.themeData?.accent || '#ccff00', opacity: 0.8 }}
                          >
                            {item.userData.role || 'Unknown Role'}
                          </div>
                        </div>
                        {/* Color preview dots */}
                        <div className="flex gap-1 mt-1 shrink-0">
                          <div
                            className="w-4 h-4 rounded-full border border-white/10"
                            style={{ background: item.themeData?.bg || '#000' }}
                          />
                          <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ background: item.themeData?.accent || '#ccff00' }}
                          />
                        </div>
                      </div>

                      {/* Prompt snippet */}
                      {item.userData.prompt && (
                        <div className="text-[10px] text-white/30 line-clamp-2 leading-relaxed mb-3">
                          {item.userData.prompt}
                        </div>
                      )}

                      {/* Skills preview */}
                      {item.themeData?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.themeData.skills.slice(0, 4).map(s => (
                            <span
                              key={s}
                              className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                              style={{
                                background: `${item.themeData?.accent || '#ccff00'}15`,
                                color: item.themeData?.accent || '#ccff00',
                                border: `1px solid ${item.themeData?.accent || '#ccff00'}25`,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Timestamp + Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] text-white/20 font-bold">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/30 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); onRestore(item); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all"
                            style={{
                              background: `${item.themeData?.accent || '#ccff00'}20`,
                              color: item.themeData?.accent || '#ccff00',
                              border: `1px solid ${item.themeData?.accent || '#ccff00'}30`,
                            }}
                            title="Restore this portfolio"
                          >
                            <RotateCcw size={10} />
                            Restore
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-white/5">
              <div className="text-[9px] font-bold tracking-widest text-white/15 uppercase text-center">
                Stored locally · Auto-saved on generation
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
