// Create src/hooks/useVoiceNarration.js for future voice integration
import { useState, useCallback } from 'react'

// Voice narration architecture for future implementation
export const useVoiceNarration = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [voices, setVoices] = useState([])

  // Check if browser supports speech synthesis
  const checkSupport = useCallback(() => {
    const isSupported = 'speechSynthesis' in window
    setSupported(isSupported)
    
    if (isSupported) {
      // Load available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    return isSupported
  }, [])

  // Speak text with child-friendly settings
  const speak = useCallback((text, options = {}) => {
    if (!supported) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Child-friendly defaults
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1.1
    utterance.volume = options.volume || 1
    
    // Select a child-friendly voice if available
    if (voices.length > 0) {
      const kidFriendlyVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Female')
      )
      if (kidFriendlyVoice) {
        utterance.voice = kidFriendlyVoice
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }, [supported, voices])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [supported])

  return {
    isSpeaking,
    supported,
    voices,
    speak,
    stopSpeaking,
    checkSupport
  }
}