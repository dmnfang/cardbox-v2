import { useState, useEffect } from 'react'
import { Ghost } from '@phosphor-icons/react'
import { autoVanishGrid } from '../lib/vanishGrid'

function VanishPreview({ cards, showText }) {
  const [cols, rows] = autoVanishGrid(cards.length)
  const total = cols * rows
  const [ghostIdx, setGhostIdx] = useState(0)

  useEffect(() => {
    setGhostIdx(Math.floor(Math.random() * total))
  }, [cards.length, showText, total])

  const sample = cards.slice(0, total)

  return (
    <div
      className="vanish-preview-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`vanish-pcell ${i === ghostIdx ? 'ghost' : ''}`}>
          {i === ghostIdx ? (
            <Ghost size={20} weight="fill" />
          ) : (
            <>
              <div className="vanish-pcell-img">
                <img src={sample[i]?.image_url} alt={sample[i]?.label} />
              </div>
              {showText && <div className="vanish-pcell-word">{sample[i]?.label || ''}</div>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default VanishPreview