import { useState, useRef, useEffect } from 'react'
import { CaretLeft, X } from '@phosphor-icons/react'
import FitText from './FitText'
import EndSheet from './EndSheet'
import { shuffle } from '../lib/shuffle'

function Flash({ S, cards, onBackToSettings, onExit }) {
  const orderedCards = useRef(
    S.cardOrder === 'shuffle' ? shuffle(cards) : [...cards]
  )
  const [idx, setIdx] = useState(0)
  const [showEnd, setShowEnd] = useState(false)
  const touchX = useRef(0)

  const flashCards = orderedCards.current
  const card = flashCards[idx]

  function advance() {
    if (idx < flashCards.length - 1) setIdx(i => i + 1)
    else setShowEnd(true)
  }

  function back() {
    if (idx > 0) setIdx(i => i - 1)
  }

  function handleTouchStart(e) {
    touchX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) advance()
      else back()
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance() }
      if (e.key === 'ArrowLeft') back()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  })

  function playAgain() {
    setShowEnd(false)
    setIdx(0)
    onBackToSettings()
  }

  if (!card) return null

  return (
    <div className="mode-screen">
      <div className="mode-topbar">
        <button className="nav-btn" onClick={onBackToSettings}>
          <CaretLeft size={18} weight="fill" />
        </button>
        <span className="topbar-counter">{idx + 1} of {flashCards.length}</span>
        <button className="nav-btn" onClick={onExit}>
          <X size={18} weight="fill" />
        </button>
      </div>

      <div
        className="flash-stage"
        onClick={advance}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flash-card">
          {S.showImage && (
            <div className="flash-img-wrap">
              <img className="flash-img" src={card.image_url} alt={card.label} />
            </div>
          )}
          {S.showWord && (
            <FitText
              text={card.label}
              maxSize={S.showImage ? 220 : 320}
              minSize={32}
              className={`flash-word ${S.showImage ? 'flash-word-paired' : 'flash-word-solo'}`}
            />
          )}
        </div>
      </div>

      {showEnd && (
        <EndSheet
          title="All done!"
          primaryLabel="Play Again"
          primaryClassName="end-btn-flash"
          onPrimary={playAgain}
          onSecondary={onExit}
        />
      )}
    </div>
  )
}

export default Flash