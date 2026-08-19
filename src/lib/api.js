import { supabase } from './supabase'

const LETS_TRY_SOURCE_ID = '4de5c7b9-cbe6-4e62-8e94-f53b7cc572be'
const MY_PICTURE_DICTIONARY_SOURCE_ID = '0cbb23ad-42ed-451e-a568-a6c9f6893ab5'

export async function fetchCardboxLibrary() {
  const { data: sources, error: sourcesError } = await supabase
    .from('sources')
    .select('id, name, position')
    .in('id', [LETS_TRY_SOURCE_ID, MY_PICTURE_DICTIONARY_SOURCE_ID])
    .order('position')
  if (sourcesError) throw sourcesError

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, source_id, name, position, cards(count)')
    .in('source_id', [LETS_TRY_SOURCE_ID, MY_PICTURE_DICTIONARY_SOURCE_ID])
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