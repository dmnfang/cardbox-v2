function TargetSettings({ S, updateS, cards }) {
  const targetWords = S.targetWords || []

  function isSelected(card) {
    return targetWords.some(w => w.id === card.id)
  }

  function toggleWord(card) {
    if (isSelected(card)) {
      updateS({ targetWords: targetWords.filter(w => w.id !== card.id) })
    } else {
      updateS({ targetWords: [...targetWords, card] })
    }
  }

  // Badge numbers follow grid position among currently-selected tiles,
  // matching v1's renumberBadges() behavior after any deselection
  function badgeNumber(card) {
    const selectedInGridOrder = cards.filter(c => isSelected(c))
    const pos = selectedInGridOrder.findIndex(c => c.id === card.id)
    return pos === -1 ? null : pos + 1
  }

  const n = targetWords.length
  const numRows = Math.ceil(cards.length / 3) || 1

  return (
    <>
      <div className="target-counter-text">
        {n === 0 ? (
          'Select at least 1 keyword to get started'
        ) : (
          <>
            <strong>{n} target word{n > 1 ? 's' : ''}</strong> selected — <strong>{n} round{n > 1 ? 's' : ''}</strong> will be played
          </>
        )}
      </div>
      <div className="preview-area">
        <span className="settings-label">Word List</span>
        <div className="word-picker-grid" style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}>
          {cards.map(card => {
            const selected = isSelected(card)
            return (
              <button
                key={card.id}
                className={`word-tile ${selected ? 'selected' : ''}`}
                onClick={() => toggleWord(card)}
              >
                <div className="word-tile-img">
                  <img src={card.image_url} alt={card.label} />
                </div>
                <div className="word-tile-label">{card.label}</div>
                {selected && <div className="word-tile-badge">{badgeNumber(card)}</div>}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TargetSettings