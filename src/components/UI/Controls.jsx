// Update src/components/UI/Controls.jsx to support disabled state
import React from 'react'

export default function Controls({ autoRotate, setAutoRotate, showLabels, setShowLabels, disabled = false }) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto">
      <div className="glass-effect flex gap-2 md:gap-4 p-2 md:p-3">
        <button
          onClick={() => !disabled && setAutoRotate(!autoRotate)}
          disabled={disabled}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all touch-target
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${autoRotate 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {autoRotate ? '⏸️ Pause' : '▶️ Auto-Rotate'}
        </button>
        
        <button
          onClick={() => !disabled && setShowLabels(!showLabels)}
          disabled={disabled}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all touch-target
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${showLabels 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {showLabels ? '🏷️ Hide Labels' : '🏷️ Show Labels'}
        </button>
      </div>
    </div>
  )
}