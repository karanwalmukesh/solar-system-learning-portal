// src/data/badgesData.js
export const badgesData = [
  {
    id: "earth_explorer",
    name: "🌍 Earth Explorer",
    title: "Earth Explorer",
    description: "Learned all about our amazing home planet! You discovered Earth's oceans, atmosphere, and why it's the perfect planet for life.",
    category: "planet",
    planet: "Earth",
    requirement: {
      type: "learn",
      target: "Earth",
      factsRequired: 3
    },
    icon: "🌍",
    color: "#4A90E2",
    backgroundColor: "#1E3A8A",
    rarity: "common",
    points: 50,
    achievementText: "You've mastered Earth facts! Our blue planet is proud of you! 💙"
  },
  {
    id: "mars_explorer",
    name: "🔴 Mars Explorer",
    title: "Mars Explorer",
    description: "Explored the Red Planet! You know about Olympus Mons, the tallest volcano in the solar system, and Mars' two tiny moons.",
    category: "planet",
    planet: "Mars",
    requirement: {
      type: "learn",
      target: "Mars",
      factsRequired: 3
    },
    icon: "🔴",
    color: "#E85D3A",
    backgroundColor: "#7C2D12",
    rarity: "common",
    points: 50,
    achievementText: "You're a true Martian explorer! The red dust welcomes you! 🚀"
  },
  {
    id: "jupiter_explorer",
    name: "🪐 Jupiter Explorer",
    title: "Jupiter Explorer",
    description: "Visited the giant of our solar system! You learned about the Great Red Spot and Jupiter's 79 moons!",
    category: "planet",
    planet: "Jupiter",
    requirement: {
      type: "learn",
      target: "Jupiter",
      factsRequired: 3
    },
    icon: "🪐",
    color: "#D4A574",
    backgroundColor: "#78350F",
    rarity: "uncommon",
    points: 75,
    achievementText: "The giant planet bows to you! You're a giant explorer! 👑"
  },
  {
    id: "venus_explorer",
    name: "💛 Venus Explorer",
    title: "Venus Explorer",
    description: "Braved the hottest planet! You discovered Venus spins backwards and has more volcanoes than any other planet.",
    category: "planet",
    planet: "Venus",
    requirement: {
      type: "learn",
      target: "Venus",
      factsRequired: 3
    },
    icon: "💛",
    color: "#E6B800",
    backgroundColor: "#713F12",
    rarity: "common",
    points: 50,
    achievementText: "You survived the heat! Venus welcomes its bravest explorer! 🔥"
  },
  {
    id: "mercury_explorer",
    name: "☀️ Mercury Explorer",
    title: "Mercury Explorer",
    description: "Conquered the fastest and closest planet to the Sun! You learned about its extreme temperature changes.",
    category: "planet",
    planet: "Mercury",
    requirement: {
      type: "learn",
      target: "Mercury",
      factsRequired: 3
    },
    icon: "☀️",
    color: "#D4A574",
    backgroundColor: "#451A03",
    rarity: "uncommon",
    points: 75,
    achievementText: "You're speedy like Mercury! The Sun's neighbor salutes you! ⚡"
  },
  {
    id: "saturn_explorer",
    name: "💍 Saturn Explorer",
    title: "Saturn Explorer",
    description: "Marveled at the ringed planet! You discovered Saturn's beautiful rings are made of ice and rock particles.",
    category: "planet",
    planet: "Saturn",
    requirement: {
      type: "learn",
      target: "Saturn",
      factsRequired: 3
    },
    icon: "💍",
    color: "#F4D4A0",
    backgroundColor: "#78350F",
    rarity: "uncommon",
    points: 75,
    achievementText: "You've seen the most beautiful rings in the galaxy! Shine on! ✨"
  },
  {
    id: "uranus_explorer",
    name: "💚 Uranus Explorer",
    title: "Uranus Explorer",
    description: "Rolled with the sideways planet! You learned about Uranus' unique rotation and its icy composition.",
    category: "planet",
    planet: "Uranus",
    requirement: {
      type: "learn",
      target: "Uranus",
      factsRequired: 3
    },
    icon: "💚",
    color: "#B0E0E6",
    backgroundColor: "#064E3B",
    rarity: "rare",
    points: 100,
    achievementText: "You've mastered the sideways spin! Keep rolling with knowledge! 🎳"
  },
  {
    id: "neptune_explorer",
    name: "💙 Neptune Explorer",
    title: "Neptune Explorer",
    description: "Rode the strongest winds in the solar system! You explored the stormy blue giant at the edge of our system.",
    category: "planet",
    planet: "Neptune",
    requirement: {
      type: "learn",
      target: "Neptune",
      factsRequired: 3
    },
    icon: "💙",
    color: "#4169E1",
    backgroundColor: "#1E3A8A",
    rarity: "rare",
    points: 100,
    achievementText: "You weathered the storm! Neptune's winds cheer for you! 💨"
  },
  {
    id: "solar_system_master",
    name: "🏆 Solar System Master",
    title: "Solar System Master",
    description: "The ultimate achievement! You've explored ALL 8 planets, learned their secrets, and become a true space expert!",
    category: "master",
    requirement: {
      type: "all_planets",
      target: 8
    },
    icon: "🏆",
    color: "#FFD700",
    backgroundColor: "#991B1B",
    rarity: "legendary",
    points: 500,
    achievementText: "YOU ARE A TRUE SOLAR SYSTEM MASTER! The planets celebrate your greatness! 🌟🌟🌟"
  },
  {
    id: "star_collector",
    name: "⭐ Star Collector",
    title: "Star Collector",
    description: "Collected 500 stars across all missions! Your dedication to space exploration shines bright!",
    category: "milestone",
    requirement: {
      type: "stars",
      target: 500
    },
    icon: "⭐",
    color: "#FBBF24",
    backgroundColor: "#78350F",
    rarity: "epic",
    points: 200,
    achievementText: "You're a star among explorers! Keep shining bright! ✨"
  },
  {
    id: "space_traveler",
    name: "🚀 Space Traveler",
    title: "Space Traveler",
    description: "Traveled to 5 different planets using your spaceship! You're becoming a seasoned astronaut!",
    category: "milestone",
    requirement: {
      type: "travel",
      target: 5
    },
    icon: "🚀",
    color: "#F97316",
    backgroundColor: "#7C2D12",
    rarity: "rare",
    points: 150,
    achievementText: "Your spaceship has seen many worlds! Where to next? 🚀"
  },
  {
    id: "fact_master",
    name: "📚 Fact Master",
    title: "Fact Master",
    description: "Learned 20 amazing facts about our solar system! Your brain is full of space knowledge!",
    category: "milestone",
    requirement: {
      type: "facts",
      target: 20
    },
    icon: "📚",
    color: "#A78BFA",
    backgroundColor: "#4C1D95",
    rarity: "epic",
    points: 250,
    achievementText: "Your brain is a universe of knowledge! Keep learning! 🧠✨"
  }
]

export const badgeCategories = {
  planet: { name: "Planet Explorers", icon: "🪐", color: "#3B82F6" },
  master: { name: "Master Achievements", icon: "🏆", color: "#F59E0B" },
  milestone: { name: "Milestone Awards", icon: "⭐", color: "#10B981" }
}