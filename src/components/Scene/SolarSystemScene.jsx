// Update src/components/Scene/SolarSystemScene.jsx to pass distance data
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Planet from './Planet'
import Orbit from './Orbit'
import PlanetLabel from './PlanetLabel'
import { planetsData } from '../../data/planetsData'

export default function SolarSystemScene({ onPlanetClick, showLabels }) {
  const planetsRef = useRef([])

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    planetsRef.current.forEach((planet, index) => {
      if (planet) {
        const planetData = planetsData[index]
        const angle = elapsedTime * planetData.speed
        const x = Math.cos(angle) * planetData.distance
        const z = Math.sin(angle) * planetData.distance
        planet.position.set(x, 0, z)
        planet.rotation.y += 0.01
      }
    })
  })

  const handlePlanetClick = (planetData) => {
    // Pass full planet data including distance
    onPlanetClick({
      ...planetData,
      distanceFromSun: planetData.distance
    })
  }

  return (
    <group>
      {/* Sun at Center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FF6600" 
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.4}
        />
        <pointLight intensity={1.5} distance={50} decay={1} color="#FFAA44" />
      </mesh>
      
      {/* Sun Glow Effect */}
      <mesh position={[0, 0, 0]} scale={1.2}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FF8800" 
          transparent 
          opacity={0.15}
          side={2}
        />
      </mesh>

      {/* Planets */}
      {planetsData.map((planet, index) => (
        <group key={planet.name}>
          <Orbit radius={planet.distance} color={planet.orbitColor} />
          
          <Planet
            ref={el => planetsRef.current[index] = el}
            position={[planet.distance, 0, 0]}
            size={planet.size}
            color={planet.color}
            name={planet.name}
            onClick={() => handlePlanetClick(planet)}
          />
          
          {showLabels && (
            <PlanetLabel
              position={[planet.distance, planet.size + 0.3, 0]}
              name={planet.name}
              color={planet.labelColor}
            />
          )}
        </group>
      ))}
    </group>
  )
}