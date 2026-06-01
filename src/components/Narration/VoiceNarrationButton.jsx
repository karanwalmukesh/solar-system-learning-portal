// src/components/Narration/VoiceNarrationButton.jsx (Architecture for future voice feature)
import React, { useState } from 'react'
import { motion } from 'framer-motion'

// This component is ready for future Web Speech API integration
export default function VoiceNarrationButton({ text, onSpeak, isSpeaking, disabled }) {
  const [isHovered, setIsHovered] = useState(false)

  // Voice narration architecture:
  // 1. Web Speech API for browser-based voice
  // 2. AWS Polly for premium voices (future)
  // 3. Google Text-to-Speech (future)
  // 4. Offline mode with basic voices
  
  const voiceConfig = {
    // Current: Browser's native speech synthesis
    engine: 'web-speech',
    voice: 'child-friendly',
    rate: 0.9, // Slightly slower for kids
    pitch: 1.1, // Slightly higher pitch
    volume: 1
  }

  const handleClick = () => {
    if (!disabled && onSpeak) {
      onSpeak(text, voiceConfig)
    }
  }

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      disabled={disabled || isSpeaking}
      className={`relative p-2 rounded-full transition-all ${
        isSpeaking 
          ? 'bg-green-500 animate-pulse' 
          : 'bg-white/20 hover:bg-white/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="text-2xl">
        {isSpeaking ? '🔊' : '🔈'}
      </span>
      
      {/* Tooltip for future feature */}
      {isHovered && !isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap"
        >
          Listen to fact 🔊
        </motion.div>
      )}
    </motion.button>
  )
}