import { useState } from 'react'
import Home from './components/Home'
import Prelaunch from './components/Prelaunch'
import LoadingModal from './components/LoadingModal'
import Flash from './components/Flash'
import Reveal from './components/Reveal'
import Target from './components/Target'
import Vanish from './components/Vanish'
import Roll from './components/Roll'
import { fetchDeckCards } from './lib/api'

function App() {
  const [screen, setScreen] = useState('home')
  const [pending, setPending] = useState(null) // { mode, cards } - set right before loading
  const [S, setS] = useState({
    selectedDecks: [],
    cards: [],
    mode: null,
    cardOrder: 'sequential',
    showImage: true,
    showWord: true,
    revealContent: 'image',
    revealGrid: '4x4',
    revealSpeed: 1,
    targetWords: [],
    vanishRounds: 1,
    vanishShowText: true,
    rollTeams: 2,
    rollGrid: '4x4',
  })

  function updateS(patch) {
    setS(prev => ({ ...prev, ...patch }))
  }

  async function handleLaunch(mode, decks) {
    const cards = await fetchDeckCards(decks.map(d => d.id))
    updateS({ selectedDecks: decks, cards, mode })
    setScreen('prelaunch')
  }

  function handleBackHome() {
    setScreen('home')
  }

  function handleLaunchGame(mode, cards) {
    setPending({ mode, cards })
    setScreen('loading')
  }

  function handleLoadingDone() {
    setScreen(pending.mode)
  }

  function handleBackToSettings() {
    setScreen('prelaunch')
  }

  if (screen === 'loading') {
    return <LoadingModal cards={pending.cards} mode={pending.mode} onDone={handleLoadingDone} />
  }

  if (screen === 'flash') {
    return (
      <Flash
        S={S}
        cards={pending.cards}
        onBackToSettings={handleBackToSettings}
        onExit={handleBackHome}
      />
    )
  }

  if (screen === 'reveal') {
    return (
      <Reveal
        S={S}
        cards={pending.cards}
        onBackToSettings={handleBackToSettings}
        onExit={handleBackHome}
      />
    )
  }

  if (screen === 'target') {
    return (
      <Target
        S={S}
        cards={pending.cards}
        onBackToSettings={handleBackToSettings}
        onExit={handleBackHome}
      />
    )
  }

  if (screen === 'vanish') {
    return (
      <Vanish
        S={S}
        cards={pending.cards}
        onBackToSettings={handleBackToSettings}
        onExit={handleBackHome}
      />
    )
  }

  if (screen === 'roll') {
    return (
      <Roll
        S={S}
        cards={pending.cards}
        onBackToSettings={handleBackToSettings}
        onExit={handleBackHome}
      />
    )
  }

  if (screen === 'prelaunch') {
    return <Prelaunch S={S} updateS={updateS} onBack={handleBackHome} onLaunch={handleLaunchGame} />
  }

  return <Home onLaunch={handleLaunch} />
}

export default App