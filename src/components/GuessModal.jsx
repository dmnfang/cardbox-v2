import { useState, useRef, useEffect } from 'react'

function GuessModal({ title, wrongGuesses, submitClassName, onSubmit, onClose }) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  function handleSubmit() {
    const text = value.trim()
    if (!text) return
    const correct = onSubmit(text)
    setValue('')
    if (!correct) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="guess-modal">
      <div className="guess-top">
        <div className="guess-title">{title}</div>
        <div className="wrong-guesses">
          {wrongGuesses.map((g, i) => (
            <div key={i} className="wrong-chip">{g}</div>
          ))}
        </div>
        <div className="guess-input-row">
          <button className="guess-close" onClick={onClose}>✕</button>
          <input
            ref={inputRef}
            className={`guess-input ${shake ? 'shake' : ''}`}
            type="text"
            placeholder="Enter a guess.."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={`guess-submit ${submitClassName}`} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuessModal