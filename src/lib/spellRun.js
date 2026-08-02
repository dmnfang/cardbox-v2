import { shuffle } from './shuffle'

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Builds the word list for one run. Draws from a shuffled deck pool; if the
// chosen word count exceeds the deck size, the pool reshuffles and repeats -
// but never repeats the same word twice in a row when there's more than one
// card to choose from.
export function buildSpellWords(cards, wordCount) {
  const seen = new Set()
  const uniqueCards = []
  cards.forEach(c => {
    const key = c.label.trim().toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueCards.push(c)
    }
  })

  const words = []
  let pool = shuffle([...uniqueCards])
  while (words.length < wordCount) {
    if (pool.length === 0) pool = shuffle([...uniqueCards])
    const next = pool.shift()
    if (words.length > 0 && words[words.length - 1].id === next.id && uniqueCards.length > 1) {
      pool.push(next)
      continue
    }
    words.push(next)
  }
  return words
}

export function isLetterChar(ch) {
  return /[a-zA-Z]/.test(ch)
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toString().padStart(2, '0')}`
}