export function getActiveCards(cards, selectedDecks) {
  const deckIds = new Set(selectedDecks.map(d => d.id))
  return cards.filter(c => deckIds.has(c.category_id))
}