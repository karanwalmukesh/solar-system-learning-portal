// src/components/Scene/PlanetLabel.jsx
import React from 'react'
import { Billboard, Text } from '@react-three/drei'

export default function PlanetLabel({ position, name, color }) {
  return (
    <Billboard position={position} follow={true}>
      <Text
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        font="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff"
      >
        {name}
      </Text>
    </Billboard>
  )
}