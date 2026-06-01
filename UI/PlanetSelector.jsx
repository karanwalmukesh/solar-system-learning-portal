// src/components/UI/PlanetSelector.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlanetSelector({ planets, onSelectPlanet, isTraveling }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (planetName) => {
    if (!isTraveling) {
      onSelectPlanet(planetName)
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-2xl text-lg md:text-xl flex items-center gap-2"
          >
            🚀 Travel to Planet
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="glass-effect rounded-2xl p-4 max-w-md"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-lg">Choose your destination! 🌟</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {planets.map((planet) => (
                <motion.button
                  key={planet.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(planet.name)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg p-2 text-white transition-all"
                  style={{ borderLeft: `4px solid ${planet.color}` }}
                >
                  <span className="text-xl">{getPlanetEmoji(planet.name)}</span>
                  <span className="text-sm font-semibold">{planet.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isTraveling && (
        <div className="mt-3 text-center glass-effect rounded-full px-4 py-2">
          <div className="text-white text-sm animate-pulse">
            🚀 On our way! Zooming through space...
          </div>
        </div>
      )}
    </div>
  )
}

function getPlanetEmoji(planetName) {
  const emojis = {
    'Mercury': '☀️',
    'Venus': '💛',
    'Earth': '🌍',
    'Mars': '🔴',
    'Jupiter': '🪐',
    'Saturn': '💍',
    'Uranus': '💚',
    'Neptune': '💙'
  }
  return emojis[planetName] || '🪐'
}