import { useState, useRef } from 'react'
import { ArrowFatLeft, X, Trophy, Prohibit, Sparkle } from '@phosphor-icons/react'
import { buildFlipGrid, buildTokenPool, drawFlipToken, FLIP_STOP } from '../lib/flip'
import { spawnConfetti } from '../lib/confetti'

const CONFETTI_COLORS = ['var(--flash)', 'var(--reveal)', 'var(--target)', 'var(--vanish)', 'var(--roll)']

function Flip({ S, cards, onBackToSettings, onExit }) {
  const teamCount = S.flipTeams

  const [scores, setScores] = useState(() => Array(teamCount).fill(0))
  const [currentTeam, setCurrentTeam] = useState(0)
  const [gridCards, setGridCards] = useState(() => buildFlipGrid(cards))
  const [tokenPool, setTokenPool] = useState(() => buildTokenPool())
  const [revealed, setRevealed] = useState(() => Array(6).fill(null))
  const [flipCount, setFlipCount] = useState(0)
  const [turnScore, setTurnScore] = useState(0)
  const [turnOver, setTurnOver] = useState(false)
  const [hitStop, setHitStop] = useState(false)
  const [showEnd, setShowEnd] = useState(false)

  const flippingRef = useRef(false)

  function startNextTurn(nextTeamIdx) {
    setCurrentTeam(nextTeamIdx)
    setGridCards(buildFlipGrid(cards))
    setTokenPool(buildTokenPool())
    setRevealed(Array(6).fill(null))
    setFlipCount(0)
    setTurnScore(0)
    setTurnOver(false)
    setHitStop(false)
  }

  function flipTile(i) {
    if (turnOver || revealed[i] || flippingRef.current) return
    flippingRef.current = true

    const { token, nextPool } = drawFlipToken(tokenPool, flipCount)
    const nextRevealed = [...revealed]
    nextRevealed[i] = token
    setRevealed(nextRevealed)
    setTokenPool(nextPool)
    setFlipCount(c => c + 1)

    if (token === FLIP_STOP) {
      setHitStop(true)
      setTurnOver(true)
      setScores(s => {
        const ns = [...s]
        ns[currentTeam] += turnScore
        return ns
      })
    } else {
      const newTurnScore = turnScore + token
      setTurnScore(newTurnScore)
      if (newTurnScore === 15) {
        spawnConfetti(CONFETTI_COLORS)
        setTurnOver(true)
        setScores(s => {
          const ns = [...s]
          ns[currentTeam] += newTurnScore
          return ns
        })
      }
    }

    setTimeout(() => { flippingRef.current = false }, 300)
  }

  function nextTeam() {
    startNextTurn((currentTeam + 1) % teamCount)
  }

  const rankedScores = scores
    .map((score, i) => ({ team: i + 1, score }))
    .sort((a, b) => b.score - a.score)

  const hasScaffold = S.flipQuestion || S.flipAnswer

  return (
    <div className="mode-screen flip-scope">
      <div className="mode-topbar">
        <button className="nav-btn" onClick={onBackToSettings}>
          <ArrowFatLeft size={18} weight="fill" />
        </button>
        <div className="team-btns">
          {Array.from({ length: teamCount }).map((_, i) => (
            <div key={i} className={`team-btn ${i === currentTeam ? 'active-roll' : ''}`}>
              <span className="team-btn-label">Team {i + 1}</span>
              <span className="team-btn-score">{scores[i]}</span>
            </div>
          ))}
        </div>
        <span className="topbar-counter">Team {currentTeam + 1}'s turn</span>
        <button className="nav-btn" onClick={() => setShowEnd(true)}>
          <X size={18} weight="fill" />
        </button>
      </div>

      <div className="flip-body">
        <div className="flip-scaffold-panel">
          {hasScaffold ? (
            <>
              <span className="flip-scaffold-label">Question</span>
              <div className="flip-scaffold-text">{S.flipQuestion || '—'}</div>
              <span className="flip-scaffold-label flip-scaffold-label-answer">Answer</span>
              <div className="flip-scaffold-text flip-scaffold-answer">{S.flipAnswer || '—'}</div>
            </>
          ) : (
            <>
              <span className="flip-scaffold-label">Practicing</span>
              <div className="flip-scaffold-text">{S.selectedDecks.map(d => d.name).join(', ')}</div>
            </>
          )}

          <div className="flip-scaffold-turn-score">
            <span className="flip-scaffold-turn-score-label">This turn</span>
            <span className="flip-scaffold-turn-score-value">+{turnScore}</span>
          </div>

          {turnOver && (
            <div className={`flip-scaffold-status ${hitStop ? 'flip-scaffold-status-stop' : 'flip-scaffold-status-cleared'}`}>
              {hitStop ? 'Stopped!' : 'Board Cleared!'}
            </div>
          )}

          <button className="flip-next-team-btn" disabled={!turnOver} onClick={nextTeam}>
            Next Team
          </button>
        </div>

        <div className="flip-grid-panel">
          <div className="flip-grid">
            {gridCards.map((card, i) => {
              const token = revealed[i]
              const isFlipped = token !== null
              return (
                <button
                  key={i}
                  className="flip-cell"
                  onClick={() => flipTile(i)}
                  disabled={isFlipped || turnOver}
                >
                  <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flip-card-face flip-card-front">
                      <div className="flip-cell-img">
                        <img src={card.image_url} alt={card.label} />
                      </div>
                      {S.flipShowText && <div className="flip-cell-word">{card.label}</div>}
                    </div>
                    <div className={`flip-card-face flip-card-back ${token === FLIP_STOP ? 'flip-card-back-stop' : ''}`}>
                      {token === FLIP_STOP ? (
                        <>
                          <span className="flip-back-label">Stop!</span>
                          <Prohibit size={80} weight="fill" />
                        </>
                      ) : (
                        <>
                          <span className="flip-back-label">+{token} points</span>
                          <Sparkle size={80} weight="fill" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {showEnd && (
        <div className="roll-overlay">
          <div className="roll-end-modal">
            <div className="roll-end-title">Game Over!</div>
            <div className="roll-end-list">
              {rankedScores.map((s, rank) => (
                <div key={s.team} className="roll-end-row">
                  <div className="roll-end-rank">{rank === 0 ? <Trophy size={20} weight="fill" /> : rank + 1}</div>
                  <div className="roll-end-team">Team {s.team}</div>
                  <div className="roll-end-score">{s.score} pts</div>
                </div>
              ))}
            </div>
            <div className="end-buttons">
              <button className="end-btn end-btn-roll" onClick={onBackToSettings}>Play Again</button>
              <button className="end-btn end-btn-secondary" onClick={onExit}>End Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Flip