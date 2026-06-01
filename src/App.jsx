// Update src/App.jsx to integrate badge system
import React, { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import SolarSystemScene from './components/Scene/SolarSystemScene'
import Spaceship from './components/Spaceship/Spaceship'
import Header from './components/UI/Header'
import PlanetInfoCard from './components/UI/PlanetInfoCard'
import Controls from './components/UI/Controls'
import PlanetSelector from './components/UI/PlanetSelector'
import MissionTracker from './components/Missions/MissionTracker'
import BadgeCollection from './components/Badges/BadgeCollection'
import BadgeNotification from './components/Badges/BadgeNotification'
import { useBadgeSystem } from './hooks/useBadgeSystem'
import { planetsData } from './data/planetsData'

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [targetPlanet, setTargetPlanet] = useState(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [isTraveling, setIsTraveling] = useState(false)
  const [showBadgeCollection, setShowBadgeCollection] = useState(false)
  const [newBadge, setNewBadge] = useState(null)
  
  // Badge system
  const {
    earnedBadges,
    lockedBadges,
    userProgress,
    addLearnedFact,
    addVisitedPlanet,
    addStars,
    completeMission,
    getBadgeProgress
  } = useBadgeSystem()

  const handleTravelToPlanet = useCallback((planetName) => {
    setTargetPlanet(planetName)
    setIsTraveling(true)
    setSelectedPlanet(null)
  }, [])

  const handleArrival = useCallback(() => {
    setIsTraveling(false)
    if (targetPlanet) {
      const newBadges = addVisitedPlanet(targetPlanet)
      if (newBadges && newBadges.length > 0) {
        setNewBadge(newBadges[0])
      }
    }
    setTargetPlanet(null)
  }, [targetPlanet, addVisitedPlanet])

  const handlePlanetClick = useCallback((planet) => {
    if (!isTraveling) {
      setSelectedPlanet(planet)
    }
  }, [isTraveling])

  const handleLearnComplete = useCallback(async (planetName, factsCount) => {
    const newBadges = await addLearnedFact(planetName, factsCount)
    if (newBadges && newBadges.length > 0) {
      // Show first new badge (can be queued for multiple)
      setNewBadge(newBadges[0])
    }
  }, [addLearnedFact])

  const handleMissionComplete = useCallback((mission) => {
    if (mission.reward?.stars) {
      addStars(mission.reward.stars)
    }
    completeMission()
  }, [addStars, completeMission])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-space-dark to-space-purple">
      <Header />
      
      {/* Badge Collection Button */}
      <button
        onClick={() => setShowBadgeCollection(true)}
        className="fixed top-20 left-4 z-30 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
      >
        <span className="text-xl">🏆</span>
        <span className="hidden md:inline">Badges</span>
        {earnedBadges.length > 0 && (
          <span className="bg-white text-purple-900 rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {earnedBadges.length}
          </span>
        )}
      </button>
      
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 60 }}
          shadows
          gl={{ antialias: true }}
        >
          <Suspense fallback={<Html center>Loading Solar System...</Html>}>
            <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffaa66" />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            
            <SolarSystemScene 
              onPlanetClick={handlePlanetClick}
              showLabels={showLabels && !isTraveling}
            />
            
            <Spaceship 
              targetPlanet={targetPlanet}
              onArrival={handleArrival}
              planetsData={planetsData}
            />
            
            {!isTraveling && (
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                enableDamping={true}
                dampingFactor={0.05}
                zoomSpeed={1.2}
                rotateSpeed={0.8}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10 pointer-events-none">
        <PlanetInfoCard 
          planet={selectedPlanet} 
          onClose={() => setSelectedPlanet(null)}
          onLearnComplete={handleLearnComplete}
        />
        
        <Controls 
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          disabled={isTraveling}
        />
        
        <PlanetSelector 
          planets={planetsData}
          onSelectPlanet={handleTravelToPlanet}
          isTraveling={isTraveling}
        />
        
        <MissionTracker
          visitedPlanets={userProgress.visitedPlanets}
          learnedPlanets={userProgress.learnedPlanets}
          currentPlanet={selectedPlanet}
          onMissionComplete={handleMissionComplete}
        />
      </div>
      
      {/* Badge Collection Modal */}
      {showBadgeCollection && (
        <BadgeCollection
          earnedBadges={earnedBadges}
          lockedBadges={lockedBadges}
          userProgress={userProgress}
          onClose={() => setShowBadgeCollection(false)}
        />
      )}
      
      {/* New Badge Notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}
      
      <div className="fixed bottom-4 left-4 z-10 pointer-events-none md:hidden">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">
          🏆 Earn badges by exploring!
        </div>
      </div>
    </div>
  )
}

export default App