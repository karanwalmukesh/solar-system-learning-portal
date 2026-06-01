// src/components/Narration/NarrationCard.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NarrationCard({ 
  planet, 
  factIndex, 
  onNext, 
  onPrevious, 
  isPlaying,
  factType = 'educational' // 'educational' or 'fun'
}) {
  const [currentFactIndex, setCurrentFactIndex] = useState(factIndex)
  const [showEmoji, setShowEmoji] = useState(false)

  useEffect(() => {
    setCurrentFactIndex(factIndex)
  }, [factIndex])

  if (!planet) return null

  const educationalFacts = planet.educationalFacts
  const funFact = planet.funFact
  const totalFacts = factType === 'educational' ? educationalFacts.length : 1
  const currentFact = factType === 'educational' 
    ? educationalFacts[currentFactIndex] 
    : funFact

  const handleNext = () => {
    if (factType === 'educational' && currentFactIndex < totalFacts - 1) {
      setCurrentFactIndex(currentFactIndex + 1)
      onNext(currentFactIndex + 1)
      setShowEmoji(true)
      setTimeout(() => setShowEmoji(false), 1000)
    } else if (factType === 'educational' && currentFactIndex === totalFacts - 1) {
      // Auto-advance to fun fact or finish
      onNext('complete')
    } else {
      onNext('complete')
    }
  }

  const handlePrevious = () => {
    if (factType === 'educational' && currentFactIndex > 0) {
      setCurrentFactIndex(currentFactIndex - 1)
      onPrevious(currentFactIndex - 1)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${planet.name}-${factType}-${currentFactIndex}`}
        initial={{ x: 100, opacity: 0, rotateY: 90 }}
        animate={{ x: 0, opacity: 1, rotateY: 0 }}
        exit={{ x: -100, opacity: 0, rotateY: -90 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed right-4 top-20 md:right-8 md:top-24 w-72 md:w-96 z-30 pointer-events-auto"
      >
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-400/50">
          
          {/* Header with planet name */}
          <div 
            className="p-4 text-center border-b border-white/20"
            style={{ backgroundColor: `${planet.color}30` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{currentFact.icon}</span>
              <h3 className="text-white font-bold text-lg">
                {factType === 'educational' ? '📚 Did You Know?' : '🎉 Fun Fact!'}
              </h3>
              <span className="text-3xl">{planet.icon || '🪐'}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {planet.name}
            </h2>
            {factType === 'educational' && (
              <div className="flex justify-center gap-1 mt-2">
                {educationalFacts.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentFactIndex 
                        ? 'w-6 bg-yellow-400' 
                        : 'w-3 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Fact content */}
          <div className="p-5 min-h-[200px] flex flex-col">
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-sm md:text-base leading-relaxed mb-4"
            >
              {currentFact.fact}
            </motion.p>
            
            {/* Pronunciation guide */}
            {planet.pronunciation && factType === 'educational' && currentFactIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 rounded-lg p-2 mb-3"
              >
                <p className="text-yellow-300 text-xs">
                  🔊 Say it: {planet.pronunciation}
                </p>
              </motion.div>
            )}
            
            {/* Difficulty badge */}
            <div className="mt-auto">
              <div className="flex justify-between items-center text-xs text-white/60 mb-3">
                <span>
                  {factType === 'educational' && (
                    <>Difficulty: {getDifficultyStars(planet.difficultyLevel)}</>
                  )}
                </span>
                <span>
                  {factType === 'educational' && (
                    <>Fact {currentFactIndex + 1} of {totalFacts}</>
                  )}
                </span>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex gap-2">
                {factType === 'educational' && currentFactIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  {factType === 'educational' && currentFactIndex === totalFacts - 1 
                    ? '🎉 See Fun Fact →' 
                    : factType === 'fun' 
                    ? '✨ Close ✨'
                    : 'Next Fact →'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Animated emoji on fact change */}
          {showEmoji && (
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -100, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 text-6xl pointer-events-none"
              style={{ x: '-50%', y: '-50%' }}
            >
              🌟
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function getDifficultyStars(level) {
  if (level === 'beginner') return '⭐ Easy peasy!'
  if (level === 'intermediate') return '⭐⭐ Just right!'
  return '⭐⭐⭐ Super learner!'
}