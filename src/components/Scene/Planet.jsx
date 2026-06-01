// src/components/Scene/Planet.jsx
import React, { forwardRef } from 'react'
import { Html } from '@react-three/drei'

const Planet = forwardRef(({ position, size, color, name, onClick }, ref) => {
  return (
    <mesh 
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      cursor="pointer"
    >
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.4}
        roughness={0.6}
        emissive={name === 'Jupiter' ? '#FF9966' : '#000000'}
        emissiveIntensity={name === 'Jupiter' ? 0.2 : 0}
      />
      
      {/* Saturn's Rings */}
      {name === 'Saturn' && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[size * 1.2, size * 0.4, 32, 100]} />
          <meshStandardMaterial color="#D4A574" metalness={0.3} roughness={0.7} />
        </mesh>
      )}
    </mesh>
  )
})

Planet.displayName = 'Planet'

export default Planet