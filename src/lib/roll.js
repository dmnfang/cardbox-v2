export const GRID_MAP = { '4x4': [4, 4], '5x4': [5, 4], '6x4': [6, 4] }

// Row 0 left→right, row 1 right→left, row 2 left→right, etc.
export function buildSnakePath(cols, rows) {
  const path = []
  for (let r = 0; r < rows; r++) {
    const leftToRight = r % 2 === 0
    for (let c = 0; c < cols; c++) {
      const col = leftToRight ? c : cols - 1 - c
      path.push(r * cols + col)
    }
  }
  return path
}

export const ROLL_COLORS = ['var(--reveal)', 'var(--target)', 'var(--vanish)', 'var(--roll)']

export const ROLL_OUTCOMES = [
  { type: 'forward', label: 'forward' },
  { type: 'back', label: 'back' },
  { type: 'stay', label: 'stay' },
]

export const ROLL_WEIGHTS = [30, 30, 40]

export const ROLL_POINT_OPTIONS = [50, 75, 100, 125, 150, 175, 200]

export function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}