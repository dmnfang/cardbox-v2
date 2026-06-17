import VanishPreview from './VanishPreview'

function VanishSettings({ S, updateS, cards }) {
  return (
    <>
      <div className="settings-row">
        <div className="settings-block">
          <span className="settings-label">Rounds</span>
          <div className="toggle-group">
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                className={`toggle-pill ${S.vanishRounds === r ? 'active' : ''}`}
                onClick={() => updateS({ vanishRounds: r })}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Card Text</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.vanishShowText ? 'active' : ''}`}
              onClick={() => updateS({ vanishShowText: true })}
            >
              On
            </button>
            <button
              className={`toggle-pill ${!S.vanishShowText ? 'active' : ''}`}
              onClick={() => updateS({ vanishShowText: false })}
            >
              Off
            </button>
          </div>
        </div>
      </div>

      <div className="vanish-info-text">
        The number of vanished cards goes up by one every round. Grid size is set automatically.
      </div>

      <div className="preview-area">
        <span className="settings-label">Grid Preview</span>
        <VanishPreview cards={cards} showText={S.vanishShowText} />
      </div>
    </>
  )
}

export default VanishSettings