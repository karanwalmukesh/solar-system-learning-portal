// src/components/Spaceship/Spaceship.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function Spaceship({ targetPlanet, onArrival, planetsData }) {
  const spaceshipRef = useRef()
  const engineParticlesRef = useRef()
  const [isTraveling, setIsTraveling] = useState(false)
  const [travelProgress, setTravelProgress] = useState(0)
  const [startPosition, setStartPosition] = useState(new THREE.Vector3(0, 2, 0))
  const [targetPosition, setTargetPosition] = useState(null)
  const [arrivalCountdown, setArrivalCountdown] = useState(null)

  useFrame(({ clock, camera }) => {
    if (!spaceshipRef.current) return

    // Update engine particles
    if (engineParticlesRef.current && isTraveling) {
      engineParticlesRef.current.rotation.z += 0.1
    }

    // Travel animation
    if (isTraveling && targetPosition) {
      const newProgress = travelProgress + 0.008
      
      if (newProgress >= 1) {
        // Arrived at planet
        setIsTraveling(false)
        setTravelProgress(0)
        if (onArrival) onArrival()
        
        // Show celebration effect
        setArrivalCountdown(60)
        
        // Play arrival animation
        if (spaceshipRef.current) {
          spaceshipRef.current.scale.set(1.2, 1.2, 1.2)
          setTimeout(() => {
            if (spaceshipRef.current) {
              spaceshipRef.current.scale.set(1, 1, 1)
            }
          }, 300)
        }
      } else {
        setTravelProgress(newProgress)
        
        // Interpolate position
        const currentX = startPosition.x + (targetPosition.x - startPosition.x) * newProgress
        const currentZ = startPosition.z + (targetPosition.z - startPosition.z) * newProgress
        const currentY = startPosition.y + (targetPosition.y - startPosition.y) * newProgress
        
        spaceshipRef.current.position.set(currentX, currentY, currentZ)
        
        // Camera follows spaceship
        if (camera) {
          const offsetX = Math.sin(clock.elapsedTime * 0.5) * 2
          const offsetY = Math.cos(clock.elapsedTime * 0.3) * 1.5
          camera.position.lerp(
            new THREE.Vector3(currentX - 8, currentY + 3 + offsetY, currentZ + 5 + offsetX),
            0.05
          )
          camera.lookAt(currentX, currentY, currentZ)
        }
        
        // Spinning effect during travel
        spaceshipRef.current.rotation.y += 0.05
        spaceshipRef.current.rotation.z = Math.sin(clock.elapsedTime * 10) * 0.1
      }
    }
    
    // Update arrival countdown
    if (arrivalCountdown !== null && arrivalCountdown > 0) {
      setArrivalCountdown(arrivalCountdown - 1)
    } else if (arrivalCountdown === 0) {
      setArrivalCountdown(null)
    }
    
    // Idle animation
    if (!isTraveling && spaceshipRef.current) {
      spaceshipRef.current.position.y = 2 + Math.sin(clock.elapsedTime * 2) * 0.1
      spaceshipRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.05
      spaceshipRef.current.rotation.x = Math.sin(clock.elapsedTime * 1.2) * 0.03
    }
  })

  useEffect(() => {
    if (targetPlanet && planetsData) {
      const planet = planetsData.find(p => p.name === targetPlanet)
      if (planet && !isTraveling) {
        // Calculate target position at current orbit angle
        const angle = performance.now() / 1000 * planet.speed
        const targetX = Math.cos(angle) * planet.distance
        const targetZ = Math.sin(angle) * planet.distance
        
        setTargetPosition(new THREE.Vector3(targetX, planet.size + 1, targetZ))
        setStartPosition(spaceshipRef.current?.position.clone() || new THREE.Vector3(0, 2, 0))
        setIsTraveling(true)
        setTravelProgress(0)
      }
    }
  }, [targetPlanet, planetsData])

  return (
    <group>
      {/* Spaceship */}
      <mesh ref={spaceshipRef} position={[0, 2, 0]} castShadow>
        {/* Body */}
        <mesh>
          <coneGeometry args={[0.8, 1.5, 32]} />
          <meshStandardMaterial color="#FF4444" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Cockpit */}
        <mesh position={[0, 0.4, 0.6]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#88CCFF" metalness={0.3} roughness={0.1} emissive="#4488AA" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Wings */}
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[1.2, 0.1, 0.5]} />
          <meshStandardMaterial color="#FF6666" metalness={0.7} />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[1.2, 0.1, 0.5]} />
          <meshStandardMaterial color="#FF6666" metalness={0.7} />
        </mesh>
        
        {/* Tail fin */}
        <mesh position={[0, 0.3, -0.7]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshStandardMaterial color="#FF4444" />
        </mesh>
        
        {/* Engine glow */}
        <mesh position={[0, -0.2, -0.8]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#FF6600" emissive="#FF4400" emissiveIntensity={0.8} />
        </mesh>
        
        {/* Engine particles */}
        <group ref={engineParticlesRef}>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[Math.sin(i * Math.PI * 2 / 8) * 0.2, Math.cos(i * Math.PI * 2 / 8) * 0.2, -1.2]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#FFAA44" emissive="#FF6600" emissiveIntensity={0.6} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
        
        {/* Decorative stripes */}
        <mesh position={[0, -0.3, 0.3]} scale={[0.6, 0.05, 0.8]}>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="#FFDD88" metalness={0.5} />
        </mesh>
        
        {/* Window */}
        <mesh position={[0, 0.1, 0.9]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#AADDFF" emissive="#4488AA" emissiveIntensity={0.3} />
        </mesh>
      </mesh>
      
      {/* Arrival Celebration Effect */}
      {arrivalCountdown !== null && arrivalCountdown > 0 && (
        <Html position={[targetPosition?.x || 0, (targetPosition?.y || 0) + 2, targetPosition?.z || 0]}>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
            <div className="text-center">
              <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
              <div className="text-2xl md:text-4xl font-bold text-yellow-300 mt-4 animate-pulse">
                WE ARRIVED! 🚀
              </div>
              <div className="text-white text-lg mt-2">✨ Mission Complete! ✨</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}