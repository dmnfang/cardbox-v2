import { useEffect } from 'react'
import { useImagePreloader } from '../lib/useImagePreloader'

function LoadingModal({ cards, mode, onDone }) {
  const urls = cards.map(c => c.image_url).filter(Boolean)
  const { loaded, total, done } = useImagePreloader(urls)

  useEffect(() => {
    if (done) {
      // Tiny pause so the bar visibly reaches 100% rather than jump-cutting away
      const t = setTimeout(onDone, 200)
      return () => clearTimeout(t)
    }
  }, [done])

  const pct = total === 0 ? 100 : Math.round((loaded / total) * 100)

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-label">Loading cards…</div>
        <div className="loading-bar-track">
          <div
            className={`loading-bar-fill loading-bar-fill-${mode}`}
            style={{ '--progress': `${pct}%` }}
          />
        </div>
        <div className="loading-count">{loaded} / {total} images</div>
      </div>
    </div>
  )
}

export default LoadingModal