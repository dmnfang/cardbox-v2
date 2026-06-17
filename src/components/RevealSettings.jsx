import RevealPreview from './RevealPreview'

function RevealSettings({ S, updateS, cards }) {
  const sample = cards[0]

  return (
    <>
      <div className="settings-row">
        <div className="settings-block">
          <span className="settings-label">Content</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.revealContent === 'image' ? 'active' : ''}`}
              onClick={() => updateS({ revealContent: 'image' })}
            >
              Image
            </button>
            <button
              className={`toggle-pill ${S.revealContent === 'word' ? 'active' : ''}`}
              onClick={() => updateS({ revealContent: 'word' })}
            >
              Word
            </button>
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Grid Size</span>
          <div className="toggle-group">
            {['4x4', '6x4', '8x4', '10x4'].map(g => (
              <button
                key={g}
                className={`toggle-pill ${S.revealGrid === g ? 'active' : ''}`}
                onClick={() => updateS({ revealGrid: g })}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Speed</span>
          <div className="toggle-group">
            {[1, 2, 3].map(s => (
              <button
                key={s}
                className={`toggle-pill-circle ${S.revealSpeed === s ? 'active' : ''}`}
                onClick={() => updateS({ revealSpeed: s })}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="preview-area">
        <span className="settings-label">Card Preview</span>
        <RevealPreview sample={sample} content={S.revealContent} grid={S.revealGrid} speed={S.revealSpeed} />
      </div>
    </>
  )
}

export default RevealSettings