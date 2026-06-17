import FitText from './FitText'

function FlashSettings({ S, updateS, cards }) {
  const sample = cards[0]

  function setOrder(order) {
    updateS({ cardOrder: order })
  }

  function toggleContent(type, on) {
    let { showImage, showWord } = S
    if (type === 'image') showImage = on
    else showWord = on
    // Can't have both off - force the other one on, matching v1's rule
    if (!showImage && !showWord) {
      if (type === 'image') showWord = true
      else showImage = true
    }
    updateS({ showImage, showWord })
  }

  return (
    <>
      <div className="settings-row">
        <div className="settings-block">
          <span className="settings-label">Card Order</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.cardOrder === 'sequential' ? 'active' : ''}`}
              onClick={() => setOrder('sequential')}
            >
              In Order
            </button>
            <button
              className={`toggle-pill ${S.cardOrder === 'shuffle' ? 'active' : ''}`}
              onClick={() => setOrder('shuffle')}
            >
              Shuffle
            </button>
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Image</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.showImage ? 'active' : ''}`}
              onClick={() => toggleContent('image', true)}
            >
              On
            </button>
            <button
              className={`toggle-pill ${!S.showImage ? 'active' : ''}`}
              onClick={() => toggleContent('image', false)}
            >
              Off
            </button>
          </div>
        </div>
        <div className="settings-block">
          <span className="settings-label">Text</span>
          <div className="toggle-group">
            <button
              className={`toggle-pill ${S.showWord ? 'active' : ''}`}
              onClick={() => toggleContent('word', true)}
            >
              On
            </button>
            <button
              className={`toggle-pill ${!S.showWord ? 'active' : ''}`}
              onClick={() => toggleContent('word', false)}
            >
              Off
            </button>
          </div>
        </div>
      </div>

      <div className="preview-area">
        <span className="settings-label">Card Preview</span>
        <div className="card-preview">
          {S.showImage && (
            <div className="flash-img-wrap">
              {sample && <img className="flash-img" src={sample.image_url} alt={sample.label} />}
            </div>
          )}
          {S.showWord && (
            <FitText
              text={sample ? sample.label : ''}
              maxSize={S.showImage ? 220 : 320}
              minSize={32}
              className={`flash-word ${S.showImage ? 'flash-word-paired' : 'flash-word-solo'}`}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default FlashSettings