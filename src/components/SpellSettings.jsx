function SpellSettings({ S, updateS }) {
  return (
    <>
      <div className="settings-row">
        <div className="settings-block">
          <span className="settings-label">Word Count</span>
          <div className="toggle-group">
            {[6, 8, 10, 12].map(n => (
              <button
                key={n}
                className={`toggle-pill ${S.spellWordCount === n ? 'active' : ''}`}
                onClick={() => updateS({ spellWordCount: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Total Time</span>
          <div className="toggle-group">
            {[60, 90, 120, 180].map(t => (
              <button
                key={t}
                className={`toggle-pill ${S.spellTotalTime === t ? 'active' : ''}`}
                onClick={() => updateS({ spellTotalTime: t })}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Letter Bonus</span>
          <div className="toggle-group">
            {[3, 5, 8, 10].map(b => (
              <button
                key={b}
                className={`toggle-pill ${S.spellLetterBonus === b ? 'active' : ''}`}
                onClick={() => updateS({ spellLetterBonus: b })}
              >
                +{b}s
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Letter Case</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.spellLetterCase === 'upper' ? 'active' : ''}`}
              onClick={() => updateS({ spellLetterCase: 'upper' })}
            >
              ABC
            </button>
            <button
              className={`toggle-pill ${S.spellLetterCase === 'lower' ? 'active' : ''}`}
              onClick={() => updateS({ spellLetterCase: 'lower' })}
            >
              abc
            </button>
          </div>
        </div>
      </div>

      <div className="spell-info-text">
        The class races the clock to spell {S.spellWordCount} words. Tap letters to fill in the blanks — correct guesses add time, wrong guesses cost nothing but a moment. Spell them all before time runs out, then try to beat your score in a Revenge Round.
      </div>
      <div style={{ flex: 1 }} />
    </>
  )
}

export default SpellSettings