'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface MediaItem {
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  createdAt: string;
}

// Confetti component
const Confetti = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(100)].map((_, i) => {
        const startX = Math.random() * dimensions.width;
        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            }}
            initial={{
              y: -100,
              x: startX,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: dimensions.height + 100,
              x: startX + (Math.random() * dimensions.width - dimensions.width / 2),
              rotate: 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

// Sparkles component
const Sparkles = ({ count = 50 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [0, -50],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// Fireworks component
const Fireworks = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => {
        const x = 20 + (i % 5) * 20;
        const y = 20 + Math.floor(i / 5) * 30;
        const colors = ['#ff6b6b', '#4ecdc4', '#f9ca24', '#6c5ce7', '#a29bfe'];
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 3, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {[...Array(12)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((j * 30 * Math.PI) / 180) * 100,
                  y: Math.sin((j * 30 * Math.PI) / 180) * 100,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

// Floating hearts component
const FloatingHearts = () => {
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHeight(window.innerHeight);
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
          }}
          animate={{
            y: [0, -height - 100],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default function UnlockPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);

  const handleUnlock = async () => {
    if (!code || code.length < 10) {
      const errorMsg = 'Please enter a valid code';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.toUpperCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to unlock';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setMedia(data.media || []);
      setUnlocked(true);
      setShowCelebration(true);
      toast.success('Moment unlocked successfully!');

      // Hide celebration after 12 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 12000);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to unlock moment';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleUnlock();
    }
  };

  const openMediaViewer = (index: number) => {
    setSelectedMedia(index);
  };

  const closeMediaViewer = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (selectedMedia === null) return;
    
    if (direction === 'prev') {
      setSelectedMedia(selectedMedia > 0 ? selectedMedia - 1 : media.length - 1);
    } else {
      setSelectedMedia(selectedMedia < media.length - 1 ? selectedMedia + 1 : 0);
    }
  };

  // Handle keyboard navigation in media viewer
  useEffect(() => {
    if (selectedMedia !== null) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedMedia(null);
        } else if (e.key === 'ArrowLeft') {
          setSelectedMedia(selectedMedia > 0 ? selectedMedia - 1 : media.length - 1);
        } else if (e.key === 'ArrowRight') {
          setSelectedMedia(selectedMedia < media.length - 1 ? selectedMedia + 1 : 0);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedMedia, media.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Celebration effects */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <Confetti />
            <Sparkles count={100} />
            <Fireworks />
            <FloatingHearts />
          </>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          {!unlocked ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Unlock Your Moment
                </h1>
                <p className="text-gray-300 mb-8">Enter your Moment Code to reveal the special content</p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Moment Code
                  </label>
                  <motion.input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="UNIKMO-XXXX-XXXX-XXX"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    disabled={loading}
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlock}
                  disabled={loading || !code}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-500 transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Unlock Moment
                      </>
                    )}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 15,
                duration: 0.8
              }}
            >
              {/* Success Header with Celebration */}
              <div className="text-center mb-8 relative">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    type: 'spring', 
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-24 h-24 mx-auto mb-4 relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(34, 197, 94, 0.7)',
                        '0 0 0 20px rgba(34, 197, 94, 0)',
                        '0 0 0 0 rgba(34, 197, 94, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <motion.svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                >
                  🎉 Moment Unlocked! 🎉
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-300 text-lg"
                >
                  Your special content is ready to view
                </motion.p>

                {/* Animated stars around text */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      top: '50%',
                      left: `${20 + i * 12}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>

              {media.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center py-12 text-gray-400"
                >
                  <p>No media has been uploaded for this moment yet.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {media.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.9 + index * 0.15,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="backdrop-blur-xl bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-xl cursor-pointer"
                      onClick={() => openMediaViewer(index)}
                    >
                      {item.type === 'image' && (
                        <motion.img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-64 object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.15 }}
                        />
                      )}
                      {item.type === 'video' && (
                        <motion.div className="relative w-full h-64 bg-black/50 flex items-center justify-center">
                          <motion.video
                            src={item.url}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 + index * 0.15 }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      {item.type === 'audio' && (
                        <motion.div
                          className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.15 }}
                        >
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center">
                              <svg className="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <audio src={item.url} controls className="w-full" />
                        </motion.div>
                      )}
                      {item.type === 'text' && (
                        <motion.div
                          className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 min-h-[256px] flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.15 }}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-blue-300 font-semibold">Text Content</p>
                            <p className="text-blue-400/70 text-sm mt-2">Click to view</p>
                          </div>
                        </motion.div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="bg-white/10 backdrop-blur-md rounded-full p-4"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {selectedMedia !== null && media[selectedMedia] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={closeMediaViewer}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={closeMediaViewer}
              className="absolute top-4 right-4 z-[60] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMedia('prev');
                  }}
                  className="absolute left-4 z-[60] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMedia('next');
                  }}
                  className="absolute right-4 z-[60] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Media Counter */}
            {media.length > 1 && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm"
              >
                {selectedMedia + 1} / {media.length}
              </motion.div>
            )}

            {/* Media Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
            >
              {media[selectedMedia].type === 'image' && (
                <motion.img
                  key={selectedMedia}
                  src={media[selectedMedia].url}
                  alt={`Media ${selectedMedia + 1}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {media[selectedMedia].type === 'video' && (
                <motion.video
                  key={selectedMedia}
                  src={media[selectedMedia].url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {media[selectedMedia].type === 'audio' && (
                <motion.div
                  key={selectedMedia}
                  className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      className="w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mb-8"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg className="w-16 h-16 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    <audio src={media[selectedMedia].url} controls className="w-full" />
                    <p className="text-white/70 text-sm mt-4 text-center">
                      {new Date(media[selectedMedia].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              )}

              {media[selectedMedia].type === 'text' && (
                <motion.iframe
                  key={selectedMedia}
                  src={media[selectedMedia].url}
                  className="w-full h-[90vh] rounded-lg shadow-2xl border border-white/20 bg-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>

            {/* Keyboard hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[60] bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-white/50 text-xs"
            >
              Press ESC to close {media.length > 1 && '• Arrow keys to navigate'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
