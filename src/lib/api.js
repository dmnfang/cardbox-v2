import { supabase } from './supabase'

export async function fetchCardboxLibrary() {
  const { data: sources, error: sourcesError } = await supabase
    .from('sources')
    .select('id, name, position')
    .order('position')
  if (sourcesError) throw sourcesError

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, source_id, name, position, cards(count)')
    .eq('cardbox_enabled', true)
    .order('position')
  if (categoriesError) throw categoriesError

  const decksBySource = {}
  categories.forEach(cat => {
    const deck = {
      id: cat.id,
      source_id: cat.source_id,
      name: cat.name,
      position: cat.position,
      cardCount: cat.cards?.[0]?.count ?? 0,
    }
    if (!decksBySource[cat.source_id]) decksBySource[cat.source_id] = []
    decksBySource[cat.source_id].push(deck)
  })

  return sources
    .filter(s => decksBySource[s.id]?.length)
    .map(s => ({ ...s, decks: decksBySource[s.id] }))
}

export async function fetchDeckCards(categoryIds) {
  const { data, error } = await supabase
    .from('cards')
    .select('id, category_id, label, image_url, position')
    .in('category_id', categoryIds)
    .order('position')
  if (error) throw error
  return data
}