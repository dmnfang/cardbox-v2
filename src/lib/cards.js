export function getDeckCards(cards, selectedDecks) {
  const deckIds = new Set(selectedDecks.map(d => d.id))
  return cards.filter(c => deckIds.has(c.category_id))
}

export function getActiveCards(cards, selectedDecks, disabledCardIds = []) {
  const deckIds = new Set(selectedDecks.map(d => d.id))
  const disabledSet = new Set(disabledCardIds)
  return cards.filter(c => deckIds.has(c.category_id) && !disabledSet.has(c.id))
}