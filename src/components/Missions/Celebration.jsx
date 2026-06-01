// src/components/Missions/Celebration.jsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Celebration({ mission, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  // Create confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`
  }))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      >
        {/* Confetti */}
        {confetti.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: -50,
              rotate: 0
            }}
            animate={{ 
              y: window.innerHeight + 100,
              rotate: 360 * 3
            }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear"
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ backgroundColor: particle.color }}
          />
        ))}
        
        {/* Main Celebration Card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4 pointer-events-auto"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Mission Complete!
          </motion.h2>
          
          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="text-2xl font-bold text-yellow-200 mb-3"
          >
            {mission.title}
          </motion.h3>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-white/20 rounded-full px-4 py-2">
                <span className="text-yellow-300 text-2xl">⭐</span>
                <span className="text-white font-bold ml-1">+{mission.reward.stars}</span>
              </div>
              {mission.reward.badge && (
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <span className="text-2xl">🏅</span>
                  <span className="text-white font-bold ml-1">{mission.reward.badge}</span>
                </div>
              )}
            </div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.3, repeat: 3 }}
              className="text-6xl"
            >
              🌟
            </motion.div>
            
            <p className="text-white text-lg">
              You're becoming a real astronaut! 🚀
            </p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all"
          >
            Continue Exploring ✨
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}