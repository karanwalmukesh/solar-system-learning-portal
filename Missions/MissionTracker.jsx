// src/components/Missions/MissionTracker.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Celebration from './Celebration'
import { missionsData, achievementBadges } from '../../data/missionsData'

export default function MissionTracker({ 
  visitedPlanets, 
  learnedPlanets, 
  currentPlanet,
  onMissionComplete 
}) {
  const [missions, setMissions] = useState(missionsData)
  const [completedMissions, setCompletedMissions] = useState([])
  const [selectedMission, setSelectedMission] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedMission, setCompletedMission] = useState(null)
  const [earnedBadges, setEarnedBadges] = useState([])

  // Check mission completion
  useEffect(() => {
    missions.forEach(mission => {
      if (!completedMissions.includes(mission.id) && !mission.completed) {
        let isComplete = false

        switch (mission.type) {
          case 'discovery':
            if (mission.target === 'any_planet' && currentPlanet) {
              isComplete = true
            } else if (mission.target === currentPlanet?.name) {
              isComplete = true
            }
            break

          case 'travel':
            if (mission.target === currentPlanet?.name && visitedPlanets.includes(mission.target)) {
              isComplete = true
            }
            break

          case 'learn':
            if (mission.target === currentPlanet?.name) {
              const planetLearned = learnedPlanets[currentPlanet?.name]
              if (planetLearned && planetLearned >= (mission.requiredFacts || 1)) {
                isComplete = true
              }
            }
            break

          case 'learn_multiple':
            const planetsLearnedCount = Object.values(learnedPlanets).filter(count => count >= 3).length
            if (planetsLearnedCount >= mission.target) {
              isComplete = true
            }
            break

          case 'travel_all':
            if (visitedPlanets.length >= mission.target) {
              isComplete = true
            }
            break
        }

        if (isComplete) {
          completeMission(mission.id)
        }
      }
    })
  }, [visitedPlanets, learnedPlanets, currentPlanet, missions, completedMissions])

  const completeMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId)
    if (mission && !completedMissions.includes(missionId)) {
      setCompletedMissions([...completedMissions, missionId])
      setCompletedMission(mission)
      setShowCelebration(true)
      
      // Add badge
      if (mission.reward?.badge && !earnedBadges.includes(mission.reward.badge)) {
        setEarnedBadges([...earnedBadges, mission.reward.badge])
      }
      
      // Update mission status
      setMissions(missions.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      ))
      
      if (onMissionComplete) {
        onMissionComplete(mission)
      }
      
      // Hide celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false)
        setCompletedMission(null)
      }, 5000)
    }
  }

  const getProgress = () => {
    const total = missions.length
    const completed = completedMissions.length
    return { total, completed, percentage: (completed / total) * 100 }
  }

  const progress = getProgress()

  return (
    <>
      {/* Mission Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedMission(!selectedMission)}
        className="fixed top-20 right-4 z-30 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
      >
        <span className="text-xl">🎯</span>
        <span className="hidden md:inline">Missions</span>
        {progress.completed > 0 && (
          <span className="bg-yellow-400 text-purple-900 rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {progress.completed}
          </span>
        )}
      </motion.button>

      {/* Mission Panel */}
      <AnimatePresence>
        {selectedMission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="fixed inset-0 bg-black/50 z-30"
            />
            
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-40 glass-effect overflow-y-auto pointer-events-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">🎯 Space Missions</h2>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="text-white/70 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>Mission Progress</span>
                    <span>{progress.completed}/{progress.total}</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Badges Earned */}
                {earnedBadges.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-bold mb-2">🏆 Badges Earned</h3>
                    <div className="flex flex-wrap gap-2">
                      {earnedBadges.map(badge => (
                        <motion.div
                          key={badge}
                          whileHover={{ scale: 1.1 }}
                          className="bg-white/10 rounded-lg p-2 text-center"
                          title={achievementBadges[badge]?.description}
                        >
                          <div className="text-2xl">{achievementBadges[badge]?.icon}</div>
                          <div className="text-white text-xs">{badge}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Missions List */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold mb-2">📋 Active Missions</h3>
                  {missions.map(mission => {
                    const isCompleted = completedMissions.includes(mission.id)
                    
                    return (
                      <motion.div
                        key={mission.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl transition-all ${
                          isCompleted 
                            ? 'bg-green-500/20 border border-green-400/50' 
                            : 'bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{mission.title.split(' ')[0]}</div>
                          <div className="flex-1">
                            <h4 className={`font-bold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                              {mission.title}
                            </h4>
                            <p className="text-white/70 text-sm mt-1">{mission.description}</p>
                            
                            {!isCompleted && mission.hint && (
                              <p className="text-yellow-300 text-xs mt-2">
                                💡 Hint: {mission.hint}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-white text-sm">{mission.reward.stars}</span>
                              </div>
                              {mission.reward.badge && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">🏅</span>
                                  <span className="text-white/60 text-xs">{mission.reward.badge}</span>
                                </div>
                              )}
                              {isCompleted && (
                                <span className="text-green-400 text-xs">✓ Completed!</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Celebration Animation */}
      {showCelebration && completedMission && (
        <Celebration mission={completedMission} onClose={() => setShowCelebration(false)} />
      )}
    </>
  )
}