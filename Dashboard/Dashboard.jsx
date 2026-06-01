// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, RadialBarChart, RadialBar, Legend
} from 'recharts'
import { planetsData } from '../../data/planetsData'
import { badgesData } from '../../data/badgesData'

export default function Dashboard({ 
  userProfile, 
  planetProgress, 
  earnedBadges, 
  quizScores,
  learningStats,
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [animationKey, setAnimationKey] = useState(0)

  // Prepare data for charts
  const planetVisitData = planetsData.map(planet => ({
    name: planet.name,
    visited: planetProgress?.find(p => p.planet_name === planet.name)?.is_visited || false,
    factsLearned: planetProgress?.find(p => p.planet_name === planet.name)?.facts_learned || 0,
    quizScore: quizScores?.find(q => q.planet_name === planet.name)?.percentage || 0
  }))

  const badgeEarningData = badgesData.map(badge => ({
    name: badge.name,
    earned: earnedBadges?.some(b => b.badge_id === badge.id) || false,
    points: badge.points
  }))

  const weeklyProgressData = learningStats?.slice(0, 7).reverse().map(day => ({
    day: new Date(day.session_date).toLocaleDateString('en-US', { weekday: 'short' }),
    facts: day.facts_learned || 0,
    planets: day.planets_explored || 0,
    missions: day.missions_completed || 0
  })) || []

  const pieData = [
    { name: 'Planets Visited', value: planetVisitData.filter(p => p.visited).length, color: '#4A90E2' },
    { name: 'Planets Not Visited', value: planetVisitData.filter(p => !p.visited).length, color: '#2D3748' }
  ]

  const quizPerformanceData = planetVisitData
    .filter(p => p.quizScore > 0)
    .map(p => ({
      subject: p.name,
      score: p.quizScore,
      fullMark: 100
    }))

  const COLORS = ['#FF6B35', '#4A90E2', '#F4D4A0', '#E85D3A', '#D4A574', '#B0E0E6', '#4169E1', '#E6B800']

  // Calculate overall stats
  const totalPlanets = planetsData.length
  const visitedPlanets = planetVisitData.filter(p => p.visited).length
  const totalBadges = badgesData.length
  const earnedBadgesCount = earnedBadges?.length || 0
  const averageQuizScore = quizPerformanceData.length > 0 
    ? Math.round(quizPerformanceData.reduce((sum, p) => sum + p.score, 0) / quizPerformanceData.length) 
    : 0
  const totalFactsLearned = planetProgress?.reduce((sum, p) => sum + (p.facts_learned || 0), 0) || 0
  const totalStars = userProfile?.total_stars || 0
  const completionPercentage = (visitedPlanets / totalPlanets) * 100

  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [activeTab])

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 hover:border-yellow-400/50 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-white/80 text-sm font-semibold">{title}</h3>
      {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / (title === 'Badges' ? totalBadges : totalPlanets)) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Dashboard Panel */}
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative w-full max-w-6xl h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/20 bg-black/20">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <span>📊</span> Mission Control Dashboard
                </h2>
                <p className="text-white/60 mt-1">
                  {userProfile?.child_name}'s Space Journey
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-2xl transition-all w-10 h-10 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: '🎯' },
                { id: 'planets', name: 'Planets', icon: '🪐' },
                { id: 'badges', name: 'Badges', icon: '🏆' },
                { id: 'quizzes', name: 'Quizzes', icon: '📝' },
                { id: 'progress', name: 'Progress', icon: '📈' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${animationKey}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <StatCard 
                        title="Planets" 
                        value={`${visitedPlanets}/${totalPlanets}`} 
                        icon="🪐" 
                        color="#4A90E2"
                        subtitle={`${Math.round(completionPercentage)}% Complete`}
                      />
                      <StatCard 
                        title="Badges" 
                        value={`${earnedBadgesCount}/${totalBadges}`} 
                        icon="🏆" 
                        color="#F59E0B"
                        subtitle={`${Math.round((earnedBadgesCount/totalBadges)*100)}% Earned`}
                      />
                      <StatCard 
                        title="Facts Learned" 
                        value={totalFactsLearned} 
                        icon="📚" 
                        color="#10B981"
                        subtitle="Keep exploring!"
                      />
                      <StatCard 
                        title="Quiz Average" 
                        value={`${averageQuizScore}%`} 
                        icon="📝" 
                        color="#EC4899"
                        subtitle={`${quizPerformanceData.length} quizzes taken`}
                      />
                      <StatCard 
                        title="Stars" 
                        value={totalStars} 
                        icon="⭐" 
                        color="#FBBF24"
                        subtitle="Mission rewards"
                      />
                    </div>

                    {/* Charts Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Planet Completion Pie Chart */}
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>🪐</span> Planet Exploration
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                              labelStyle={{ color: 'white' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className="text-center text-white/60 text-sm mt-2">
                          {visitedPlanets} out of {totalPlanets} planets visited
                        </p>
                      </motion.div>

                      {/* Weekly Progress Line Chart */}
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>📈</span> Weekly Progress
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={weeklyProgressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                            <XAxis dataKey="day" stroke="#ffffff60" />
                            <YAxis stroke="#ffffff60" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                              labelStyle={{ color: 'white' }}
                            />
                            <Line type="monotone" dataKey="facts" stroke="#10B981" strokeWidth={2} name="Facts" />
                            <Line type="monotone" dataKey="planets" stroke="#4A90E2" strokeWidth={2} name="Planets" />
                            <Line type="monotone" dataKey="missions" stroke="#F59E0B" strokeWidth={2} name="Missions" />
                          </LineChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span>⏰</span> Recent Achievements
                      </h3>
                      <div className="space-y-2">
                        {earnedBadges?.slice(0, 5).map((badge, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                            <span className="text-2xl">{badge.badge_name.split(' ')[0]}</span>
                            <div className="flex-1">
                              <p className="text-white font-semibold">{badge.badge_name}</p>
                              <p className="text-white/40 text-xs">
                                Earned {new Date(badge.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-yellow-400">⭐ +{badge.points_earned}</span>
                          </div>
                        ))}
                        {(!earnedBadges || earnedBadges.length === 0) && (
                          <p className="text-white/40 text-center py-4">
                            Complete missions to earn badges! 🎯
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Planets Tab */}
                {activeTab === 'planets' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {planetsData.map((planet, idx) => {
                      const progress = planetProgress?.find(p => p.planet_name === planet.name)
                      const isVisited = progress?.is_visited || false
                      const factsLearned = progress?.facts_learned || 0
                      const quizScore = quizScores?.find(q => q.planet_name === planet.name)?.percentage || 0
                      
                      return (
                        <motion.div
                          key={planet.name}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                              style={{ backgroundColor: planet.color, boxShadow: `0 0 10px ${planet.color}` }}
                            >
                              {isVisited ? '✅' : '🪐'}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-bold">{planet.name}</h3>
                              <p className="text-white/40 text-xs">{planet.description}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-white/60 text-xs mb-1">
                                <span>Facts Learned</span>
                                <span>{factsLearned}/3</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(factsLearned / 3) * 100}%` }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: planet.color }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-white/60 text-xs mb-1">
                                <span>Quiz Score</span>
                                <span>{quizScore}%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${quizScore}%` }}
                                  className="h-full rounded-full bg-yellow-400"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/40">
                                {isVisited ? '✅ Visited' : '❌ Not visited'}
                              </span>
                              {quizScore >= 80 && <span className="text-green-400">🏆 Mastered!</span>}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Badges Tab */}
                {activeTab === 'badges' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {badgesData.map((badge, idx) => {
                        const isEarned = earnedBadges?.some(b => b.badge_id === badge.id)
                        return (
                          <motion.div
                            key={badge.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className={`relative bg-gradient-to-br rounded-2xl p-4 text-center transition-all ${
                              isEarned 
                                ? 'from-yellow-500/20 to-orange-500/20 border-yellow-400' 
                                : 'from-white/5 to-white/10 border-white/10 opacity-60'
                            } border-2`}
                          >
                            {isEarned && (
                              <div className="absolute top-2 right-2 text-green-400 text-xl">✅</div>
                            )}
                            <div className="text-5xl mb-2">{badge.icon}</div>
                            <h3 className="text-white font-bold text-sm">{badge.title}</h3>
                            <p className="text-white/40 text-xs mt-1">{badge.description.substring(0, 50)}...</p>
                            <div className="mt-2 flex items-center justify-center gap-1">
                              <span className="text-yellow-400 text-xs">⭐</span>
                              <span className="text-white/60 text-xs">{badge.points} pts</span>
                            </div>
                            {!isEarned && (
                              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl">🔒</span>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                    
                    {/* Badge Stats */}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30">
                      <h3 className="text-white font-bold mb-2">🏆 Badge Collection Progress</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-yellow-400">{earnedBadgesCount}</div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(earnedBadgesCount / totalBadges) * 100}%` }}
                              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                            />
                          </div>
                          <p className="text-white/60 text-sm mt-1">
                            {earnedBadgesCount} out of {totalBadges} badges earned
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                  <>
                    {/* Radar Chart */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>📊</span> Quiz Performance by Planet
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={quizPerformanceData}>
                            <PolarGrid stroke="#ffffff30" />
                            <PolarAngleAxis dataKey="subject" stroke="#ffffff60" />
                            <Radar name="Score" dataKey="score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Best Scores */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>🏅</span> Top Quiz Scores
                        </h3>
                        <div className="space-y-3">
                          {quizPerformanceData
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((quiz, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📝'}
                                  </span>
                                  <span className="text-white font-semibold">{quiz.subject}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${quiz.score}%` }}
                                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                                    />
                                  </div>
                                  <span className="text-yellow-400 font-bold">{quiz.score}%</span>
                                </div>
                              </div>
                            ))}
                          {quizPerformanceData.length === 0 && (
                            <p className="text-white/40 text-center py-4">
                              Take quizzes to see your scores! 📝
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quiz History */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span>📜</span> Quiz History
                      </h3>
                      <div className="space-y-2">
                        {quizScores?.slice(0, 10).map((quiz, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-semibold">{quiz.planet_name}</p>
                              <p className="text-white/40 text-xs">
                                {new Date(quiz.completed_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-400 font-bold text-xl">{quiz.percentage}%</p>
                              <p className="text-white/40 text-xs">{quiz.score}/{quiz.total_questions} correct</p>
                            </div>
                          </div>
                        ))}
                        {(!quizScores || quizScores.length === 0) && (
                          <p className="text-white/40 text-center py-4">
                            No quizzes taken yet. Start exploring to test your knowledge! 🚀
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Progress Tab */}
                {activeTab === 'progress' && (
                  <>
                    {/* Learning Streak */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-400/30">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>🔥</span> Learning Streak
                        </h3>
                        <div className="text-center">
                          <div className="text-6xl font-bold text-purple-400 mb-2">
                            {learningStats?.filter(day => day.facts_learned > 0 || day.planets_explored > 0).length || 0}
                          </div>
                          <p className="text-white/60">Active Days</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-400/30">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <span>📚</span> Learning Milestones
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white/80">Facts Mastered</span>
                            <span className="text-green-400 font-bold">{totalFactsLearned} / 24</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Planets Mastered</span>
                            <span className="text-green-400 font-bold">
                              {planetVisitData.filter(p => p.factsLearned >= 3 && p.quizScore >= 80).length} / {totalPlanets}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Mission Completion</span>
                            <span className="text-green-400 font-bold">{userProfile?.total_mission_completed || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Radial Progress Chart */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span>🎯</span> Overall Learning Progress
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="20%" 
                          outerRadius="80%" 
                          data={[
                            { name: 'Planets', value: completionPercentage, fill: '#4A90E2' },
                            { name: 'Badges', value: (earnedBadgesCount / totalBadges) * 100, fill: '#F59E0B' },
                            { name: 'Quizzes', value: averageQuizScore, fill: '#EC4899' },
                            { name: 'Facts', value: (totalFactsLearned / 24) * 100, fill: '#10B981' }
                          ]}
                        >
                          <RadialBar 
                            background 
                            dataKey="value" 
                            angleAxisId={0}
                            label={{ fill: '#fff', position: 'insideStart' }}
                          />
                          <Legend 
                            iconSize={10} 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-400/30">
                      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span>💡</span> Recommendations
                      </h3>
                      <div className="space-y-2">
                        {planetVisitData.filter(p => !p.visited).length > 0 && (
                          <p className="text-white/80">🌟 Visit {planetVisitData.filter(p => !p.visited).map(p => p.name).join(', ')} to complete your collection!</p>
                        )}
                        {planetVisitData.filter(p => p.visited && p.factsLearned < 3).length > 0 && (
                          <p className="text-white/80">📚 Learn more facts about planets you've visited!</p>
                        )}
                        {quizPerformanceData.filter(q => q.score < 70).length > 0 && (
                          <p className="text-white/80">📝 Try retaking quizzes to improve your scores!</p>
                        )}
                        {(earnedBadgesCount < totalBadges / 2) && (
                          <p className="text-white/80">🎯 Complete more missions to earn badges!</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 bg-black/20 text-center">
            <p className="text-white/40 text-xs">
              Last updated: {new Date().toLocaleDateString()} | Keep exploring, space explorer! 🚀
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}