// src/components/Auth/AuthModal.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../../hooks/useSupabase'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register, login, error } = useSupabase()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    let result
    if (isLogin) {
      result = await login(email, password)
    } else {
      result = await register(email, password, childName, age ? parseInt(age) : null)
    }
    
    setLoading(false)
    
    if (result.success) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="relative w-full max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold text-white">
                  {isLogin ? 'Welcome Back!' : 'Start Your Space Adventure!'}
                </h2>
                <p className="text-white/70 mt-2">
                  {isLogin ? 'Login to continue exploring' : 'Create an account to save your progress'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                  required
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                  required
                />
                
                {!isLogin && (
                  <>
                    <input
                      type="text"
                      placeholder="Child's Name"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                      required
                    />
                    
                    <input
                      type="number"
                      placeholder="Age (optional)"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                    />
                  </>
                )}
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Login 🚀' : 'Start Exploring 🌟')}
                </button>
              </form>
              
              <div className="text-center mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-yellow-300 hover:text-yellow-400 text-sm"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
              
              <div className="mt-6 p-3 bg-white/5 rounded-xl">
                <p className="text-white/60 text-xs text-center">
                  🔒 Your progress, badges, and quiz scores are saved securely!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}