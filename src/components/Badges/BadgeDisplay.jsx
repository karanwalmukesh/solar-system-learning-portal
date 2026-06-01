// src/components/Badges/BadgeDisplay.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { badgeCategories } from '../../data/badgesData'

export default function BadgeDisplay({ badge, size = 'medium', showTooltip = true }) {
  const [showDetails, setShowDetails] = useState(false)

  const sizes = {
    small: { width: 'w-16', text: 'text-xs', icon: 'text-2xl' },
    medium: { width: 'w-24', text: 'text-sm', icon: 'text-4xl' },
    large: { width: 'w-32', text: 'text-base', icon: 'text-5xl' }
  }

  const sizeClass = sizes[size] || sizes.medium

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowDetails(true)}
        onHoverEnd={() => setShowDetails(false)}
        className={`${sizeClass.width} cursor-pointer`}
      >
        <div
          className="relative rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${badge.backgroundColor}, ${badge.color}80)`,
            border: `2px solid ${badge.color}`
          }}
        >
          <div className="p-3 text-center">
            <div className={sizeClass.icon}>{badge.icon}</div>
            <p className={`${sizeClass.text} text-white font-bold mt-1 truncate`}>
              {badge.title}
            </p>
            <div className="absolute top-1 right-1">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: badge.color }}
              />
            </div>
          </div>
          
          {/* Rarity indicator */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ 
              background: badge.rarity === 'common' ? '#10B981' :
                        badge.rarity === 'uncommon' ? '#3B82F6' :
                        badge.rarity === 'rare' ? '#8B5CF6' :
                        badge.rarity === 'epic' ? '#EC4899' : '#F59E0B'
            }}
          />
        </div>
      </motion.div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {showDetails && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black/90 backdrop-blur rounded-lg p-2 pointer-events-none"
          >
            <p className="text-white text-xs font-semibold">{badge.title}</p>
            <p className="text-white/70 text-xs mt-1">{badge.description.substring(0, 60)}...</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-white/60 text-xs">{badge.points} points</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}