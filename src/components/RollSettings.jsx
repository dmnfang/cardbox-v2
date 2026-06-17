import RollPreview from './RollPreview'

function RollSettings({ S, updateS }) {
  return (
    <>
      <div className="settings-row">
        <div className="settings-block">
          <span className="settings-label">Teams</span>
          <div className="toggle-group">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                className={`toggle-pill ${S.rollTeams === n ? 'active' : ''}`}
                onClick={() => updateS({ rollTeams: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Grid Size</span>
          <div className="toggle-group">
            {['4x4', '5x4', '6x4'].map(g => (
              <button
                key={g}
                className={`toggle-pill ${S.rollGrid === g ? 'active' : ''}`}
                onClick={() => updateS({ rollGrid: g })}
              >
                {g.replace('x', '×')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="preview-area">
        <span className="settings-label">Board Preview</span>
        <RollPreview grid={S.rollGrid} />
      </div>
    </>
  )
}

export default RollSettings