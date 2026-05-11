import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onAuthClick }) {
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-12 py-6 flex justify-between items-center z-[100] bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
      <div className="text-2xl font-bold font-display text-primary tracking-widest">
        AIPF<span className="text-white">.</span>
      </div>
      <div className="flex gap-8 items-center">
        <a href="#gallery" className="text-[10px] font-bold tracking-[0.2em] hover:text-primary transition-colors">GALLERY</a>
        <a href="#workspace" className="text-[10px] font-bold tracking-[0.2em] hover:text-primary transition-colors">WORKSPACE</a>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-[9px] text-white/60 font-bold">
              {user?.email}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 text-white/70 hover:text-white transition-all text-[9px] font-bold tracking-widest"
            >
              <LogOut size={14} />
              SIGN OUT
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAuthClick}
            className="btn-primary !px-6 !py-2 !text-[10px]"
          >
            SIGN IN
          </motion.button>
        )}
      </div>
    </nav>
  );
}
