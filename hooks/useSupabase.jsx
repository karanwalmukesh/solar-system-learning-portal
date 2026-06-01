// src/hooks/useSupabase.js
import { useState, useEffect, useCallback } from 'react'
import { 
  supabase, 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser 
} from '../services/supabaseClient'
import {
  profileService,
  planetProgressService,
  badgesService,
  missionsService,
  quizService,
  analyticsService,
  realtimeService
} from '../services/supabaseService'

export const useSupabase = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser) {
        await loadProfile(currentUser.id)
      }
      
      setLoading(false)
    }
    
    initAuth()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null
        setUser(currentUser)
        
        if (currentUser) {
          await loadProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId) => {
    try {
      const profileData = await profileService.getProfile(userId)
      setProfile(profileData)
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  const register = useCallback(async (email, password, childName, age) => {
    setLoading(true)
    setError(null)
    
    const result = await signUp(email, password, childName, age)
    
    if (result.success) {
      setUser(result.data.user)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
    return result
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    
    const result = await signIn(email, password)
    
    if (result.success) {
      setUser(result.data.user)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
    return result
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    const result = await signOut()
    if (result.success) {
      setUser(null)
      setProfile(null)
    }
    setLoading(false)
    return result
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return null
    
    try {
      const updated = await profileService.updateProfile(user.id, updates)
      setProfile(updated)
      return updated
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [user])

  // Planet progress methods
  const updatePlanetProgress = useCallback(async (planetName, updates) => {
    if (!user) return null
    return await planetProgressService.updatePlanetProgress(user.id, planetName, updates)
  }, [user])

  const markPlanetVisited = useCallback(async (planetName) => {
    if (!user) return null
    return await planetProgressService.markPlanetVisited(user.id, planetName)
  }, [user])

  const updateFactsLearned = useCallback(async (planetName, factsCount) => {
    if (!user) return null
    return await planetProgressService.updateFactsLearned(user.id, planetName, factsCount)
  }, [user])

  // Badge methods
  const earnBadge = useCallback(async (badge) => {
    if (!user) return null
    return await badgesService.earnBadge(user.id, badge)
  }, [user])

  const getEarnedBadges = useCallback(async () => {
    if (!user) return []
    return await badgesService.getEarnedBadges(user.id)
  }, [user])

  // Mission methods
  const completeMission = useCallback(async (mission) => {
    if (!user) return null
    return await missionsService.completeMission(user.id, mission)
  }, [user])

  // Quiz methods
  const saveQuizScore = useCallback(async (planetName, score, totalQuestions, timeTaken) => {
    if (!user) return null
    return await quizService.saveQuizScore(user.id, planetName, score, totalQuestions, timeTaken)
  }, [user])

  // Analytics
  const getLearningStats = useCallback(async () => {
    if (!user) return []
    return await analyticsService.getLearningStats(user.id)
  }, [user])

  return {
    user,
    profile,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updatePlanetProgress,
    markPlanetVisited,
    updateFactsLearned,
    earnBadge,
    getEarnedBadges,
    completeMission,
    saveQuizScore,
    getLearningStats,
    isAuthenticated: !!user
  }
}