// src/hooks/useBadgeSystem.js
import { useState, useEffect, useCallback } from 'react'
import { badgesData } from '../data/badgesData'

const STORAGE_KEY = 'solar_system_badges'

export const useBadgeSystem = () => {
  const [earnedBadges, setEarnedBadges] = useState([])
  const [userProgress, setUserProgress] = useState({
    learnedPlanets: {},
    visitedPlanets: [],
    totalStars: 0,
    totalFactsLearned: 0,
    missionsCompleted: 0
  })

  // Load saved data on mount
  useEffect(() => {
    loadSavedData()
  }, [])

  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        setEarnedBadges(data.earnedBadges || [])
        setUserProgress(data.userProgress || {
          learnedPlanets: {},
          visitedPlanets: [],
          totalStars: 0,
          totalFactsLearned: 0,
          missionsCompleted: 0
        })
      }
    } catch (error) {
      console.error('Error loading badge data:', error)
    }
  }

  const saveData = useCallback((badges, progress) => {
    try {
      const data = {
        earnedBadges: badges,
        userProgress: progress,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving badge data:', error)
    }
  }, [])

  const checkBadgeEligibility = useCallback((badge, currentProgress) => {
    const requirement = badge.requirement
    
    switch (requirement.type) {
      case 'learn':
        const factsLearned = currentProgress.learnedPlanets[requirement.target] || 0
        return factsLearned >= requirement.factsRequired
      
      case 'all_planets':
        const allPlanets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']
        const visitedCount = currentProgress.visitedPlanets.length
        return visitedCount >= requirement.target
      
      case 'stars':
        return currentProgress.totalStars >= requirement.target
      
      case 'travel':
        return currentProgress.visitedPlanets.length >= requirement.target
      
      case 'facts':
        return currentProgress.totalFactsLearned >= requirement.target
      
      default:
        return false
    }
  }, [])

  const updateProgress = useCallback((newProgress) => {
    const updatedProgress = { ...userProgress, ...newProgress }
    setUserProgress(updatedProgress)
    
    // Check for newly earned badges
    const newlyEarned = []
    const updatedBadges = [...earnedBadges]
    
    badgesData.forEach(badge => {
      if (!updatedBadges.includes(badge.id) && checkBadgeEligibility(badge, updatedProgress)) {
        updatedBadges.push(badge.id)
        newlyEarned.push(badge)
      }
    })
    
    if (newlyEarned.length > 0) {
      setEarnedBadges(updatedBadges)
      saveData(updatedBadges, updatedProgress)
      
      // Return newly earned badges for celebration
      return newlyEarned
    }
    
    saveData(updatedBadges, updatedProgress)
    return []
  }, [userProgress, earnedBadges, checkBadgeEligibility, saveData])

  const addLearnedFact = useCallback((planetName, factCount) => {
    const currentFacts = userProgress.learnedPlanets[planetName] || 0
    if (factCount > currentFacts) {
      const newTotalFacts = userProgress.totalFactsLearned + (factCount - currentFacts)
      return updateProgress({
        learnedPlanets: {
          ...userProgress.learnedPlanets,
          [planetName]: factCount
        },
        totalFactsLearned: newTotalFacts
      })
    }
    return []
  }, [userProgress, updateProgress])

  const addVisitedPlanet = useCallback((planetName) => {
    if (!userProgress.visitedPlanets.includes(planetName)) {
      return updateProgress({
        visitedPlanets: [...userProgress.visitedPlanets, planetName]
      })
    }
    return []
  }, [userProgress, updateProgress])

  const addStars = useCallback((stars) => {
    return updateProgress({
      totalStars: userProgress.totalStars + stars
    })
  }, [userProgress, updateProgress])

  const completeMission = useCallback(() => {
    return updateProgress({
      missionsCompleted: userProgress.missionsCompleted + 1
    })
  }, [userProgress, updateProgress])

  const getEarnedBadgesList = useCallback(() => {
    return badgesData.filter(badge => earnedBadges.includes(badge.id))
  }, [earnedBadges])

  const getLockedBadgesList = useCallback(() => {
    return badgesData.filter(badge => !earnedBadges.includes(badge.id))
  }, [earnedBadges])

  const getBadgeProgress = useCallback((badge) => {
    const requirement = badge.requirement
    
    switch (requirement.type) {
      case 'learn':
        const current = userProgress.learnedPlanets[requirement.target] || 0
        return { current, target: requirement.factsRequired, percentage: (current / requirement.factsRequired) * 100 }
      
      case 'all_planets':
        const visitedCount = userProgress.visitedPlanets.length
        return { current: visitedCount, target: requirement.target, percentage: (visitedCount / requirement.target) * 100 }
      
      case 'stars':
        return { current: userProgress.totalStars, target: requirement.target, percentage: (userProgress.totalStars / requirement.target) * 100 }
      
      case 'travel':
        const travelCount = userProgress.visitedPlanets.length
        return { current: travelCount, target: requirement.target, percentage: (travelCount / requirement.target) * 100 }
      
      case 'facts':
        return { current: userProgress.totalFactsLearned, target: requirement.target, percentage: (userProgress.totalFactsLearned / requirement.target) * 100 }
      
      default:
        return { current: 0, target: 100, percentage: 0 }
    }
  }, [userProgress])

  const resetProgress = useCallback(() => {
    const resetData = {
      earnedBadges: [],
      userProgress: {
        learnedPlanets: {},
        visitedPlanets: [],
        totalStars: 0,
        totalFactsLearned: 0,
        missionsCompleted: 0
      }
    }
    setEarnedBadges([])
    setUserProgress(resetData.userProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData))
  }, [])

  return {
    earnedBadges: getEarnedBadgesList(),
    lockedBadges: getLockedBadgesList(),
    userProgress,
    addLearnedFact,
    addVisitedPlanet,
    addStars,
    completeMission,
    updateProgress,
    getBadgeProgress,
    resetProgress,
    totalBadges: badgesData.length,
    earnedCount: earnedBadges.length,
    completionPercentage: (earnedBadges.length / badgesData.length) * 100
  }
}