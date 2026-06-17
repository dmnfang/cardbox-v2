import { useState, useRef, useEffect } from 'react'
import { ArrowFatLeft, X, Eye, ArrowRight, Play, Pause } from '@phosphor-icons/react'
import FitText from './FitText'
import EndSheet from './EndSheet'
import GuessModal from './GuessModal'
import { shuffle } from '../lib/shuffle'
import { spawnConfetti } from '../lib/confetti'

const REV_SPEED = { 1: 1400, 2: 800, 3: 500 }
const SQ_COLORS = ['var(--flash)', 'var(--reveal)', 'var(--target)', 'var(--vanish)']
const GRID_MAP = { '4x4': [4, 4], '6x4': [6, 4], '8x4': [8, 4], '10x4': [10, 4] }

function Reveal({ S, cards, onBackToSettings, onExit }) {
  // Reveal always shuffles, regardless of the cardOrder setting (that's Flash-only in v1)
  const revealCards = useRef(shuffle(cards))
  const [cols, rows] = GRID_MAP[S.revealGrid] || [4, 4]
  const total = cols * rows

  const [idx, setIdx] = useState(0)
  const [gone, setGone] = useState(() => Array(total).fill(false))
  const [paused, setPaused] = useState(false)
  const [done, setDone] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const [showGuess, setShowGuess] = useState(false)
  const [wrongGuesses, setWrongGuesses] = useState([])
  const [squareRect, setSquareRect] = useState(null)

  const timerRef = useRef(null)
  const imgRef = useRef(null)
  const cardRef = useRef(null)

  const card = revealCards.current[idx]

  // Timer removes a random remaining square
  useEffect(() => {
    if (paused || done) return
    timerRef.current = setInterval(() => {
      setGone(prev => {
        const remaining = prev.map((g, i) => (g ? -1 : i)).filter(i => i !== -1)
        if (!remaining.length) return prev
        const pick = remaining[Math.floor(Math.random() * remaining.length)]
        const next = [...prev]
        next[pick] = true
        return next
      })
    }, REV_SPEED[S.revealSpeed] || 800)
    return () => clearInterval(timerRef.current)
  }, [paused, done, idx, S.revealSpeed])

  // All squares gone -> done
  useEffect(() => {
    if (gone.length && gone.every(Boolean) && !done) {
      setDone(true)
    }
  }, [gone, done])

  // Fit the squares overlay exactly to the rendered image bounds (image mode only)
  useEffect(() => {
    if (S.revealContent !== 'image') {
      setSquareRect(null)
      return
    }
    function fit() {
      const img = imgRef.current
      const cardEl = cardRef.current
      if (!img || !cardEl || !img.naturalWidth) return
      const padding = 24
      const cardRectBox = cardEl.getBoundingClientRect()
      const cw = cardRectBox.width - padding * 2
      const ch = cardRectBox.height - padding * 2
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
      const renderedW = img.naturalWidth * scale
      const renderedH = img.naturalHeight * scale
      setSquareRect({
        left: padding + (cw - renderedW) / 2,
        top: padding + (ch - renderedH) / 2,
        width: renderedW,
        height: renderedH,
      })
    }
    const img = imgRef.current
    if (img?.complete && img.naturalWidth) fit()
    else if (img) img.onload = fit
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [S.revealContent, idx])

  function removeSquare(i) {
    setGone(prev => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  function revealAll() {
    clearInterval(timerRef.current)
    setGone(Array(total).fill(true))
  }

  function togglePause() {
    if (!paused) {
      setPaused(true)
      setShowGuess(true)
    } else {
      setPaused(false)
    }
  }

  function closeGuessModal() {
    setShowGuess(false)
    setPaused(false)
  }

  function handleGuess(text) {
    const correct = card.label.trim().toLowerCase() === text.trim().toLowerCase()
    if (correct) {
      setShowGuess(false)
      setWrongGuesses([])
      revealAll()
      spawnConfetti(['var(--flash)', 'var(--reveal)', 'var(--target)', 'var(--vanish)'])
      setPaused(false)
      return true
    }
    setWrongGuesses(prev => [...prev, text])
    return false
  }

  function actionTap() {
    if (done) advance()
    else revealAll()
  }

  function advance() {
    if (idx < revealCards.current.length - 1) {
      setIdx(i => i + 1)
      setGone(Array(total).fill(false))
      setDone(false)
      setPaused(false)
      setWrongGuesses([])
      setSquareRect(null)
    } else {
      setShowEnd(true)
    }
  }

  function playAgain() {
    setShowEnd(false)
    setIdx(0)
    onBackToSettings()
  }

  if (!card) return null

  const squaresStyle = S.revealContent === 'image'
    ? (squareRect
      ? {
          position: 'absolute',
          left: squareRect.left,
          top: squareRect.top,
          width: squareRect.width,
          height: squareRect.height,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }
      : {
          position: 'absolute',
          inset: 24,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        })
    : {
        position: 'absolute',
        inset: 24,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }

  return (
    <div className="mode-screen">
      <div className="mode-topbar">
        <button className="nav-btn" onClick={onBackToSettings}>
          <ArrowFatLeft size={18} weight="fill" />
        </button>
        <button className="nav-btn" onClick={togglePause}>
          {paused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
        </button>
        <span className="topbar-counter">{idx + 1} of {revealCards.current.length}</span>
        <button className="nav-btn" onClick={actionTap}>
          {done ? <ArrowRight size={18} weight="fill" /> : <Eye size={18} weight="fill" />}
        </button>
        <button className="nav-btn" onClick={onExit}>
          <X size={18} weight="fill" />
        </button>
      </div>

      <div className="reveal-stage">
        <div className={`reveal-card ${done ? 'revealed' : ''}`} ref={cardRef}>
          <div className="reveal-content">
            {S.revealContent === 'image' ? (
              <img ref={imgRef} src={card.image_url} alt={card.label} />
            ) : (
              <FitText text={card.label} maxSize={320} minSize={32} className="reveal-word" />
            )}
          </div>
          <div className="reveal-squares" style={squaresStyle}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={`${idx}-${i}`}
                className={`reveal-sq ${gone[i] ? 'gone' : ''}`}
                style={{ background: SQ_COLORS[(i + Math.floor(i / cols)) % SQ_COLORS.length] }}
                onClick={() => removeSquare(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {showGuess && (
        <GuessModal
          title="What is the card?"
          wrongGuesses={wrongGuesses}
          submitClassName="guess-submit-reveal"
          onSubmit={handleGuess}
          onClose={closeGuessModal}
        />
      )}

      {showEnd && (
        <EndSheet
          title="All done!"
          primaryLabel="Play Again"
          primaryClassName="end-btn-reveal"
          onPrimary={playAgain}
          onSecondary={onExit}
        />
      )}
    </div>
  )
}

export default Reveal