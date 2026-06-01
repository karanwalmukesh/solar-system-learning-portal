// src/components/Badges/BadgeCollection.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BadgeDisplay from './BadgeDisplay'
import { badgeCategories } from '../../data/badgesData'

export default function BadgeCollection({ earnedBadges, lockedBadges, userProgress, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState(null)

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🏆' },
    ...Object.entries(badgeCategories).map(([key, value]) => ({
      id: key,
      name: value.name,
      icon: value.icon,
      color: value.color
    }))
  ]

  const filterBadges = (badges) => {
    if (selectedCategory === 'all') return badges
    return badges.filter(badge => badge.category === selectedCategory)
  }

  const filteredEarned = filterBadges(earnedBadges)
  const filteredLocked = filterBadges(lockedBadges)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        {/* Badge Collection Panel */}
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          className="relative w-full max-w-5xl h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <span>🏆</span> Badge Collection
              </h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-2xl transition-all"
              >
                ✕
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl">{earnedBadges.length}</div>
                <div className="text-white/70 text-sm">Badges Earned</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl">{userProgress.totalStars || 0}</div>
                <div className="text-white/70 text-sm">Stars Collected</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl">{Math.round((earnedBadges.length / (earnedBadges.length + lockedBadges.length)) * 100)}%</div>
                <div className="text-white/70 text-sm">Complete</div>
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Badge Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Earned Badges */}
            {filteredEarned.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                  <span>✅</span> Earned Badges ({filteredEarned.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredEarned.map(badge => (
                    <BadgeDisplay key={badge.id} badge={badge} size="medium" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Locked Badges */}
            {filteredLocked.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white/60 mb-4 flex items-center gap-2">
                  <span>🔒</span> Locked Badges ({filteredLocked.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 opacity-60">
                  {filteredLocked.map(badge => (
                    <div key={badge.id} className="relative">
                      <BadgeDisplay badge={badge} size="medium" showTooltip={false} />
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">🔒</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {filteredEarned.length === 0 && filteredLocked.length === 0 && (
              <div className="text-center text-white/60 py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p>No badges in this category yet!</p>
                <p className="text-sm mt-2">Keep exploring to earn badges!</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/20 bg-black/20">
            <p className="text-white/60 text-sm text-center">
              💡 Complete missions and learn facts to earn more badges!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}