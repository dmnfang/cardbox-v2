import { shuffle } from './shuffle'

export const FLIP_POINT_VALUES = [5, 4, 3, 2, 1]
export const FLIP_STOP = 'STOP'
export const FLIP_GRID_SIZE = 6

// Builds a 6-card grid for one team's turn. Only repeats cards if the
// deck has fewer than 6 (shouldn't normally happen with real decks).
export function buildFlipGrid(cards) {
  const pool = shuffle([...cards])
  if (pool.length >= FLIP_GRID_SIZE) return pool.slice(0, FLIP_GRID_SIZE)
  const grid = []
  while (grid.length < FLIP_GRID_SIZE) {
    grid.push(...shuffle([...cards]))
  }
  return grid.slice(0, FLIP_GRID_SIZE)
}

// Fresh token pool for a turn: 5 point values + 1 stop card
export function buildTokenPool() {
  return [...FLIP_POINT_VALUES, FLIP_STOP]
}

// Draws one token from the remaining pool. STOP is excluded from the draw
// until flipCount >= 3, so the first 3 flips of any turn are always points -
// this works regardless of which physical tile the team picks, since the
// token isn't assigned to a tile until it's actually flipped.
export function drawFlipToken(pool, flipCount) {
  const available = flipCount < 3 ? pool.filter(t => t !== FLIP_STOP) : pool
  const idx = Math.floor(Math.random() * available.length)
  const token = available[idx]
  const nextPool = [...pool]
  nextPool.splice(nextPool.indexOf(token), 1)
  return { token, nextPool }
}