// src/components/Badges/BadgeNotification.jsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BadgeNotification({ badge, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0, rotate: -10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        exit={{ x: 100, opacity: 0, rotate: 10 }}
        className="fixed bottom-20 right-4 z-50 pointer-events-auto"
      >
        <div 
          className="relative rounded-2xl shadow-2xl p-4 max-w-sm overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${badge.backgroundColor}, ${badge.color}E6)`,
            border: `2px solid ${badge.color}`
          }}
        >
          {/* Animated sparkles */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
          
          <div className="flex items-start gap-3">
            <div className="text-5xl animate-bounce">{badge.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-300 text-xs font-bold">NEW BADGE UNLOCKED!</span>
                <span className="text-white/80 text-xs">⭐ +{badge.points}</span>
              </div>
              <h3 className="text-white font-bold text-lg">{badge.title}</h3>
              <p className="text-white/90 text-sm mt-1">{badge.achievementText}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          
          {/* Confetti effect inside */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-shimmer" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}