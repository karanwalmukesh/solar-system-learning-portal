// src/components/Scene/Orbit.jsx
import React from 'react'

export default function Orbit({ radius, color }) {
  const points = []
  const segments = 128
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    points.push(new THREE.Vector3(x, 0, z))
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.3} />
    </line>
  )
}