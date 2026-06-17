import { shuffle } from './shuffle'

const SIZES = [[2, 2], [2, 3], [3, 3], [4, 3], [4, 4], [5, 4], [5, 5], [6, 5], [6, 6]]

export function autoVanishGrid(cardCount) {
  for (const [cols, rows] of SIZES) {
    if (cardCount <= cols * rows) return [cols, rows]
  }
  return [6, 6]
}

// Dedupe by lowercase label, shuffle, then cap to the grid size computed
// from the ORIGINAL (pre-dedup) card count - matches v1's exact two-step logic
export function buildVanishPool(cards) {
  const [cols, rows] = autoVanishGrid(cards.length)
  const total = cols * rows
  const seen = new Map()
  cards.forEach(c => {
    const key = c.label.toLowerCase()
    if (!seen.has(key)) seen.set(key, c)
  })
  return shuffle([...seen.values()]).slice(0, total)
}