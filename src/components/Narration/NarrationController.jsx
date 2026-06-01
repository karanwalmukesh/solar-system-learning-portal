// src/components/Narration/NarrationController.jsx
import React, { useState, useEffect } from 'react'
import NarrationCard from './NarrationCard'

export default function NarrationController({ planet, onComplete, autoAdvance = true }) {
  const [isActive, setIsActive] = useState(false)
  const [factType, setFactType] = useState('educational')
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [narrationQueue, setNarrationQueue] = useState([])

  useEffect(() => {
    if (planet && !isActive) {
      // Start narration when planet is selected
      setIsActive(true)
      setFactType('educational')
      setCurrentFactIndex(0)
      
      // Prepare narration queue for future voice feature
      const queue = []
      planet.educationalFacts.forEach((fact, idx) => {
        queue.push({
          type: 'educational',
          text: fact.fact,
          index: idx,
          icon: fact.icon
        })
      })
      queue.push({
        type: 'fun',
        text: planet.funFact.fact,
        icon: planet.funFact.icon
      })
      setNarrationQueue(queue)
    }
  }, [planet])

  const handleNext = (nextIndex) => {
    if (nextIndex === 'complete') {
      if (factType === 'educational') {
        // Move to fun fact
        setFactType('fun')
        setCurrentFactIndex(0)
      } else {
        // Narration complete
        setIsActive(false)
        if (onComplete) onComplete()
      }
    } else {
      setCurrentFactIndex(nextIndex)
    }
  }

  const handlePrevious = (prevIndex) => {
    setCurrentFactIndex(prevIndex)
  }

  if (!isActive || !planet) return null

  return (
    <NarrationCard
      planet={planet}
      factIndex={currentFactIndex}
      factType={factType}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isPlaying={true}
    />
  )
}