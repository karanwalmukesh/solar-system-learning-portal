// src/data/missionsData.js
export const missionsData = [
  {
    id: 1,
    title: "🌍 Welcome Space Explorer!",
    description: "Click on any planet to learn about it!",
    type: "discovery",
    target: "any_planet",
    reward: { stars: 1, badge: "🌟 Explorer" },
    difficulty: "easy",
    hint: "Try tapping on the colorful planets!"
  },
  {
    id: 2,
    title: "🚀 First Mission: Visit Mars",
    description: "Travel to the Red Planet using your spaceship!",
    type: "travel",
    target: "Mars",
    reward: { stars: 3, badge: "🔴 Martian Explorer" },
    difficulty: "easy",
    hint: "Click 'Travel to Planet' and choose Mars!"
  },
  {
    id: 3,
    title: "👑 Find the Giant",
    description: "Find the LARGEST planet in our solar system!",
    type: "discovery",
    target: "Jupiter",
    reward: { stars: 3, badge: "👑 Giant Hunter" },
    difficulty: "easy",
    hint: "It's the biggest one - you can't miss it!"
  },
  {
    id: 4,
    title: "💍 Ring Detective",
    description: "Find the planet with beautiful rings!",
    type: "discovery",
    target: "Saturn",
    reward: { stars: 3, badge: "💍 Ring Master" },
    difficulty: "easy",
    hint: "Look for the planet wearing a sparkly ring!"
  },
  {
    id: 5,
    title: "☀️ Hot Pursuit",
    description: "Visit the planet closest to the Sun!",
    type: "travel",
    target: "Mercury",
    reward: { stars: 4, badge: "☀️ Sun Kissed" },
    difficulty: "medium",
    hint: "It's the smallest and fastest planet!"
  },
  {
    id: 6,
    title: "🌊 Blue Planet",
    description: "Learn 3 facts about our home planet Earth!",
    type: "learn",
    target: "Earth",
    requiredFacts: 3,
    reward: { stars: 4, badge: "🌍 Earth Guardian" },
    difficulty: "medium",
    hint: "Our beautiful blue marble!"
  },
  {
    id: 7,
    title: "💨 Wind Rider",
    description: "Travel to the windiest planet in the solar system!",
    type: "travel",
    target: "Neptune",
    reward: { stars: 4, badge: "💨 Storm Chaser" },
    difficulty: "medium",
    hint: "This blue planet has super fast winds!"
  },
  {
    id: 8,
    title: "🎭 Rolling Wonder",
    description: "Visit the planet that rolls on its side!",
    type: "travel",
    target: "Uranus",
    reward: { stars: 4, badge: "🎭 Sideways Explorer" },
    difficulty: "medium",
    hint: "It looks like it's taking a nap while orbiting!"
  },
  {
    id: 9,
    title: "🌟 Star Student",
    description: "Learn all the fun facts about any 3 planets!",
    type: "learn_multiple",
    target: 3,
    reward: { stars: 5, badge: "🌟 Star Student" },
    difficulty: "hard",
    hint: "Open the info cards and read the fun facts!"
  },
  {
    id: 10,
    title: "🚀 Grand Tour",
    description: "Travel to ALL 8 planets!",
    type: "travel_all",
    target: 8,
    reward: { stars: 10, badge: "🏆 Master Astronaut" },
    difficulty: "hard",
    hint: "Visit Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune!"
  }
]

export const achievementBadges = {
  "🌟 Explorer": { icon: "🌟", color: "#FFD700", description: "Started your space adventure!" },
  "🔴 Martian Explorer": { icon: "🔴", color: "#FF6B35", description: "Visited the Red Planet!" },
  "👑 Giant Hunter": { icon: "👑", color: "#D4A574", description: "Found the biggest planet!" },
  "💍 Ring Master": { icon: "💍", color: "#F4D4A0", description: "Discovered Saturn's beautiful rings!" },
  "☀️ Sun Kissed": { icon: "☀️", color: "#FFAA00", description: "Braved the heat of Mercury!" },
  "🌍 Earth Guardian": { icon: "🌍", color: "#4A90E2", description: "Learned about our home planet!" },
  "💨 Storm Chaser": { icon: "💨", color: "#4169E1", description: "Rode the winds of Neptune!" },
  "🎭 Sideways Explorer": { icon: "🎭", color: "#B0E0E6", description: "Visited the rolling planet!" },
  "🌟 Star Student": { icon: "🌟", color: "#FFD700", description: "Mastered planet facts!" },
  "🏆 Master Astronaut": { icon: "🏆", color: "#C0C0C0", description: "Visited every planet in the solar system!" }
}