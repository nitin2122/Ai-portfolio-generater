import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { signIn, signUp, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setMessage({ type: 'success', text: 'Check your email to confirm your signup!' });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5001] w-full max-w-md"
          >
            <div
              className="relative rounded-2xl border border-white/10 p-8 space-y-6"
              style={{
                background: 'linear-gradient(160deg, rgba(20,20,22,0.95) 0%, rgba(13,13,14,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} className="text-white/60" />
              </motion.button>

              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-white/40 text-sm">
                  {isSignUp ? 'Sign up to download your portfolio' : 'Sign in to download your portfolio'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                )}

                {/* Messages */}
                {(message || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-lg ${
                      (message?.type === 'error' || error)
                        ? 'bg-red-500/10 border border-red-500/30'
                        : 'bg-green-500/10 border border-green-500/30'
                    }`}
                  >
                    <AlertCircle
                      size={18}
                      className={(message?.type === 'error' || error) ? 'text-red-400' : 'text-green-400'}
                    />
                    <p
                      className={`text-sm font-medium ${
                        (message?.type === 'error' || error)
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {message?.text || error}
                    </p>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : isSignUp ? (
                    'Create Account'
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              {/* Toggle signup/signin */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2">
                <span className="text-white/40 text-sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <motion.button
                  whileHover={{ color: '#ccff00' }}
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setMessage(null);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-primary font-bold text-sm hover:underline transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
