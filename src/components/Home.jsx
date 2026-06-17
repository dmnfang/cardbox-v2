import { useState, useEffect } from 'react'
import { Lightning, Eye, Crosshair as TargetIcon, Ghost, DiceFive, CheckFat as Check } from '@phosphor-icons/react'
import { fetchCardboxLibrary } from '../lib/api'

const MODES = [
  { id: 'flash',  label: 'Flash',  icon: Lightning,  className: 'mode-btn-flash' },
  { id: 'reveal', label: 'Reveal', icon: Eye,        className: 'mode-btn-reveal' },
  { id: 'target', label: 'Target', icon: TargetIcon, className: 'mode-btn-target' },
  { id: 'vanish', label: 'Vanish', icon: Ghost,      className: 'mode-btn-vanish' },
  { id: 'roll',   label: 'Roll',   icon: DiceFive,   className: 'mode-btn-roll' },
]

function Home({ onLaunch }) {
  const [groups, setGroups] = useState([])
  const [activeGroupId, setActiveGroupId] = useState(null)
  const [selectedDecks, setSelectedDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCardboxLibrary()
      .then(data => {
        setGroups(data)
        if (data.length) setActiveGroupId(data[0].id)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const activeGroup = groups.find(g => g.id === activeGroupId)

  function toggleDeck(deck) {
    setSelectedDecks(prev =>
      prev.some(d => d.id === deck.id)
        ? prev.filter(d => d.id !== deck.id)
        : [...prev, deck]
    )
  }

  if (loading) return <div className="home-loading">Loading library…</div>
  if (error) return <div className="home-error">Couldn't load decks: {error}</div>

  return (
    <div className="home-screen">
      <div className="decks-panel">
        <h1 className="panel-title">Decks</h1>

        <div className="decks-header-row">
          <div className="group-tabs">
            {groups.map(g => (
              <button
                key={g.id}
                className={`group-pill ${g.id === activeGroupId ? 'active' : ''}`}
                onClick={() => setActiveGroupId(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
          {selectedDecks.length > 0 && (
            <button className="clear-btn" onClick={() => setSelectedDecks([])}>
              Clear
            </button>
          )}
        </div>

        <div className="deck-grid">
          {activeGroup?.decks.map(deck => {
            const isSelected = selectedDecks.some(d => d.id === deck.id)
            return (
              <div
                key={deck.id}
                className={`deck-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleDeck(deck)}
              >
                <div className="deck-card-header">
                  <span className="deck-card-title">{deck.name}</span>
                  <div className="deck-dot">
                    <Check size={14} weight="fill" />
                  </div>
                </div>
                <div className="deck-chip">{deck.cardCount} cards</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="modes-panel">
        <h2 className="panel-title">Modes</h2>
        <p className="modes-hint">
          {selectedDecks.length === 0
            ? 'Select at least 1 deck'
            : <><strong>{selectedDecks.length}</strong> {selectedDecks.length === 1 ? 'deck' : 'decks'} selected</>}
        </p>
        <div className="modes-list">
          {MODES.map(mode => {
            const Icon = mode.icon
            const disabled = selectedDecks.length === 0
            return (
              <button
                key={mode.id}
                className={`mode-btn ${mode.className}`}
                disabled={disabled}
                onClick={() => onLaunch(mode.id, selectedDecks)}
              >
                <Icon size={20} weight="fill" />
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home