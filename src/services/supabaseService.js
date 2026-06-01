// src/services/supabaseService.js
import { supabase } from './supabaseClient'

// Profile Management
export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAchievementsSummary(userId) {
    const { data, error } = await supabase
      .from('user_achievements_summary')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }
}

// Planet Progress Service
export const planetProgressService = {
  async getPlanetProgress(userId, planetName) {
    const { data, error } = await supabase
      .from('planet_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('planet_name', planetName)
      .single()
    
    if (error && error.code !== 'PGRST116') return null
    return data
  },

  async getAllPlanetsProgress(userId) {
    const { data, error } = await supabase
      .from('planet_progress')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async updatePlanetProgress(userId, planetName, updates) {
    // Check if record exists
    const existing = await this.getPlanetProgress(userId, planetName)
    
    if (existing) {
      const { data, error } = await supabase
        .from('planet_progress')
        .update({
          ...updates,
          last_visited: updates.is_visited ? new Date().toISOString() : existing.last_visited,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('planet_progress')
        .insert([{
          user_id: userId,
          planet_name: planetName,
          ...updates,
          last_visited: updates.is_visited ? new Date().toISOString() : null
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  async markPlanetVisited(userId, planetName) {
    return this.updatePlanetProgress(userId, planetName, { 
      is_visited: true,
      times_visited: supabase.sql`times_visited + 1`
    })
  },

  async updateFactsLearned(userId, planetName, factsCount) {
    const existing = await this.getPlanetProgress(userId, planetName)
    const currentFacts = existing?.facts_learned || 0
    
    if (factsCount > currentFacts) {
      return this.updatePlanetProgress(userId, planetName, { 
        facts_learned: factsCount,
        completed_at: factsCount >= 3 ? new Date().toISOString() : null
      })
    }
    return existing
  }
}

// Badges Service
export const badgesService = {
  async getEarnedBadges(userId) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async earnBadge(userId, badge) {
    // Check if already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .single()
    
    if (existing) return null
    
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{
        user_id: userId,
        badge_id: badge.id,
        badge_name: badge.name,
        badge_category: badge.category,
        points_earned: badge.points || 0
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getBadgeCount(userId) {
    const { count, error } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (error) throw error
    return count
  }
}

// Missions Service
export const missionsService = {
  async getUserMissions(userId) {
    const { data, error } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async completeMission(userId, mission) {
    // Check if already completed
    const { data: existing } = await supabase
      .from('user_missions')
      .select('id')
      .eq('user_id', userId)
      .eq('mission_id', mission.id)
      .single()
    
    if (existing) return null
    
    const { data, error } = await supabase
      .from('user_missions')
      .insert([{
        user_id: userId,
        mission_id: mission.id,
        mission_title: mission.title,
        completed: true,
        completed_at: new Date().toISOString(),
        stars_earned: mission.reward?.stars || 0
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Update profile total missions
    await supabase.rpc('increment_mission_count', { user_id: userId })
    
    return data
  }
}

// Quiz Service
export const quizService = {
  async saveQuizScore(userId, planetName, score, totalQuestions, timeTaken = null) {
    const percentage = (score / totalQuestions) * 100
    
    const { data, error } = await supabase
      .from('quiz_scores')
      .upsert([{
        user_id: userId,
        planet_name: planetName,
        score: score,
        total_questions: totalQuestions,
        percentage: percentage,
        time_taken: timeTaken,
        completed_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,planet_name'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update planet progress
    await planetProgressService.updatePlanetProgress(userId, planetName, {
      quiz_score: score,
      quiz_completed: true
    })
    
    return data
  },

  async getQuizScores(userId) {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getBestScore(userId, planetName) {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('planet_name', planetName)
      .order('percentage', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }
}

// Learning Analytics Service
export const analyticsService = {
  async getLearningStats(userId) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
      .limit(30)
    
    if (error) throw error
    return data || []
  },

  async getWeeklyProgress(userId) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('session_date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async recordSession(userId, sessionData) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .upsert([{
        user_id: userId,
        session_date: new Date().toISOString().split('T')[0],
        ...sessionData
      }], {
        onConflict: 'user_id,session_date'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const realtimeService = {
  subscribeToBadges(userId, callback) {
    return supabase
      .channel('badges_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()
  },

  subscribeToPlanetProgress(userId, callback) {
    return supabase
      .channel('planet_progress_channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'planet_progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()
  }
}