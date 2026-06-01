// src/components/UI/Header.jsx
import React from 'react'

export default function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="glass-effect mx-4 mt-4 md:mx-8 md:mt-6 p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌟 Solar System Adventure 🌟
        </h1>
        <p className="text-center text-white/80 text-sm md:text-base lg:text-lg mt-2">
          Tap on any planet to learn amazing facts!
        </p>
      </div>
    </div>
  )
}