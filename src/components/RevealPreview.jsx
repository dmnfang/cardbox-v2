import { useState, useEffect, useRef } from 'react'
import { shuffle } from '../lib/shuffle'
import FitText from './FitText'

const SQ_COLORS = ['var(--flash)', 'var(--reveal)', 'var(--target)', 'var(--vanish)']
const GRID_MAP = { '4x4': [4, 4], '6x4': [6, 4], '8x4': [8, 4], '10x4': [10, 4] }
const SPEED_MS = { 1: 800, 2: 400, 3: 150 }

function RevealPreview({ sample, content, grid, speed }) {
  const [cols, rows] = GRID_MAP[grid] || [4, 4]
  const total = cols * rows
  const [gone, setGone] = useState(Array(total).fill(false))
  const orderRef = useRef([])
  const stepRef = useRef(0)

  useEffect(() => {
    setGone(Array(total).fill(false))
    orderRef.current = shuffle([...Array(total).keys()])
    stepRef.current = 0

    let interval
    let restartTimeout

    function tick() {
      if (stepRef.current >= orderRef.current.length) {
        clearInterval(interval)
        restartTimeout = setTimeout(() => {
          setGone(Array(total).fill(false))
          orderRef.current = shuffle([...Array(total).keys()])
          stepRef.current = 0
          interval = setInterval(tick, SPEED_MS[speed] || 800)
        }, 1000)
        return
      }
      const idx = orderRef.current[stepRef.current]
      setGone(prev => {
        const next = [...prev]
        next[idx] = true
        return next
      })
      stepRef.current++
    }

    interval = setInterval(tick, SPEED_MS[speed] || 800)
    return () => {
      clearInterval(interval)
      clearTimeout(restartTimeout)
    }
  }, [total, speed, grid])

  if (!sample) return null

  return (
    <div className="card-preview">
      {content === 'image' ? (
        <div className="flash-img-wrap">
          <img className="flash-img" src={sample.image_url} alt={sample.label} />
        </div>
      ) : (
        <FitText text={sample.label} maxSize={320} minSize={32} className="flash-word flash-word-solo" />
      )}
      <div
        className="card-preview-reveal"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="reveal-preview-sq"
            style={{
              background: SQ_COLORS[(i + Math.floor(i / cols)) % SQ_COLORS.length],
              opacity: gone[i] ? 0 : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default RevealPreview