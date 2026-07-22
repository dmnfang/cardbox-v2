const MAX_COLS = 6
const MAX_ROWS = 5

// Picks a landscape-oriented grid (cols >= rows) that fits cardCount with
// minimal waste, capped at 6 across x 5 down (30 cards). For each row count
// r = 1, 2, 3..., tries cols = r, r+1, r+2 in order and returns the first
// shape whose area covers cardCount. Decks bigger than 30 just get the
// capped grid — the preview only ever shows the first 30.
export function autoFlashGrid(cardCount) {
  if (cardCount <= 0) return [1, 1]
  let r = 1
  while (r <= MAX_ROWS) {
    for (let d = 0; d <= 2; d++) {
      const cols = r + d
      if (cols > MAX_COLS) break
      if (cols * r >= cardCount) return [cols, r]
    }
    r++
  }
  return [MAX_COLS, MAX_ROWS]
}