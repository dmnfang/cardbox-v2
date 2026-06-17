import { GRID_MAP, buildSnakePath, ROLL_COLORS } from '../lib/roll'

function RollPreview({ grid }) {
  const [cols, rows] = GRID_MAP[grid] || [4, 4]
  const path = buildSnakePath(cols, rows)
  const total = cols * rows

  return (
    <div
      className="roll-preview-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: total }).map((_, gridIdx) => {
        const pathPos = path.indexOf(gridIdx)
        const isStart = pathPos === 0
        const isLoop = pathPos === total - 1
        const bg = (isStart || isLoop) ? 'var(--flash)' : ROLL_COLORS[pathPos % ROLL_COLORS.length]
        return <div key={gridIdx} className="roll-preview-cell" style={{ background: bg }} />
      })}
    </div>
  )
}

export default RollPreview