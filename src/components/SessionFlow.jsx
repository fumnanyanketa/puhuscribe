import { useState, useRef, useEffect } from 'react'
import { getSession } from '../data/sessions'
import { callClaude } from '../api/claude'
import { useApp } from '../contexts/AppContext'

// ── STEP LABELS ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: 'Theory',       icon: '◉' },
  { id: 1, label: 'Drills',       icon: '⚡' },
  { id: 2, label: 'Speaking',     icon: '🎤' },
  { id: 3, label: 'Vocabulary',   icon: '📚' },
  { id: 4, label: 'Conversation', icon: '💬' },
  { id: 5, label: 'Check',        icon: '✓' },
  { id: 6, label: 'Complete',     icon: '🎉' },
]

// ── STEP INDICATOR ─────────────────────────────────────────────────────────
function StepBar({ currentStep }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '14px 20px',
      marginBottom: 20,
      boxShadow: 'var(--shadow-sm)',
      overflowX: 'auto',
    }}>
      {STEPS.map((step, i) => {
        const isDone = i < currentStep
        const isActive = i === currentStep
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '0 10px',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isDone ? 13 : 14,
                fontWeight: 700,
                background: isDone ? 'var(--green)' : isActive ? 'var(--grad)' : 'var(--surface2)',
                border: isDone ? '2px solid var(--green)' : isActive ? 'none' : '2px solid var(--border)',
                color: isDone || isActive ? '#fff' : 'var(--text-4)',
                transition: 'all 0.2s',
              }}>
                {isDone ? '✓' : step.icon}
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--blue)' : isDone ? 'var(--green)' : 'var(--text-4)',
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 28, height: 2, flexShrink: 0,
                background: i < currentStep ? 'var(--green)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── STEP 0: THEORY ─────────────────────────────────────────────────────────
function TheoryStep({ session, onNext }) {
  const [tutorQuestion, setTutorQuestion] = useState('')
  const [tutorReply, setTutorReply] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useApp()

  const ask = async () => {
    if (!tutorQuestion.trim() || loading) return
    setLoading(true)
    try {
      const reply = await callClaude({
        messages: [{ role: 'user', content: `I'm studying ${session.title}. ${tutorQuestion}` }],
        user,
        sessionContext: `Session ${session.id}: ${session.title}. Teaching: ${session.topics.join(', ')}`,
      })
      setTutorReply(reply)
    } catch(e) { setTutorReply('Sorry, could not connect to tutor.') }
    finally { setLoading(false) }
  }

  const { theory } = session
  const renderText = (text) => text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
  ))

  return (
    <div className="theory-layout">
      <div className="theory-section">
        <div className="theory-section-label">📌 Origin</div>
        <p className="theory-section-body">{renderText(theory.origin)}</p>
      </div>
      <div className="theory-section">
        <div className="theory-section-label">💡 The Logic</div>
        <p className="theory-section-body">{renderText(theory.logic)}</p>
      </div>
      <div className="theory-section theory-section--rule">
        <div className="theory-section-label">📐 The Rule</div>
        <p className="theory-section-body">{renderText(theory.rule)}</p>
        {theory.rule_table && (
          <div className="theory-table-wrap">
            <table className="theory-table">
              <thead>
                <tr>{theory.rule_table[0].map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {theory.rule_table.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 1 ? 'theory-table-fi' : j === 2 ? 'theory-table-neg' : ''}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {theory.exceptions && theory.exceptions.length > 0 && (
        <div className="theory-exceptions">
          <div className="theory-section-label">⚠ Exceptions & Watch-outs</div>
          {theory.exceptions.map((ex, i) => (
            <div key={i} className="theory-exception-row">
              <strong>{ex.word}</strong>
              <span>{ex.fix}</span>
            </div>
          ))}
        </div>
      )}
      <div className="theory-section">
        <div className="theory-section-label">✏ Examples in context</div>
        <div className="session-examples-grid">
          {theory.examples.map((ex, i) => (
            <div key={i} className="theory-example-card">
              <div className="theory-example-fi">
                {ex.fi.split(ex.hi).map((part, j, arr) => (
                  <span key={j}>{part}{j < arr.length - 1 && <span className="theory-highlight">{ex.hi}</span>}</span>
                ))}
              </div>
              <div className="theory-example-en">{ex.en}</div>
            </div>
          ))}
        </div>
      </div>
      {theory.puhekieli && theory.puhekieli.length > 0 && (
        <div className="theory-puhekieli">
          <div className="theory-section-label">💬 Puhekieli — Spoken Finnish</div>
          <p className="theory-puhekieli-intro">Standard Finnish is what you write and read. Spoken Finnish (puhekieli) is what people actually say on the street, at the gym, on public transport. Both matter.</p>
          {theory.puhekieli.map((p, i) => (
            <div key={i} className={`puhekieli-row${i < theory.puhekieli.length - 1 ? ' puhekieli-row--bordered' : ''}`}>
              <div className="puhekieli-col">
                <span className="puhekieli-col-label">Standard</span>
                <span className="puhekieli-col-value">{p.standard}</span>
              </div>
              <div className="puhekieli-arrow">→</div>
              <div className="puhekieli-col">
                <span className="puhekieli-col-label puhekieli-col-label--spoken">Spoken</span>
                <span className="puhekieli-col-value puhekieli-col-value--spoken">{p.spoken}</span>
              </div>
              {p.note && <div className="puhekieli-note">{p.note}</div>}
            </div>
          ))}
        </div>
      )}
      <div className="theory-ask-tutor">
        <div className="theory-ask-label">🤖 Something unclear? Ask your tutor</div>
        <div className="theory-ask-row">
          <input className="drill-input" placeholder="e.g. Why does hän get a double vowel?" value={tutorQuestion} onChange={e => setTutorQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} />
          <button className="btn btn-soft" onClick={ask} disabled={loading}>{loading ? '…' : 'Ask →'}</button>
        </div>
        {tutorReply && (
          <div className="theory-tutor-reply" dangerouslySetInnerHTML={{ __html: `<p>${tutorReply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>` }} />
        )}
      </div>
      <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
        I've read the theory — Start Drills ⚡
      </button>
    </div>
  )
}


// ── STEP 1: DRILLS ─────────────────────────────────────────────────────────
function DrillsStep({ session, onNext }) {
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})
  const [allDone, setAllDone] = useState(false)

  const check = (drill) => {
    const userAnswer = (answers[drill.id] || '').trim().toLowerCase()
    const correct = drill.answer.toLowerCase()
    // flexible matching — accept answer if it's contained or contains the key part
    const isCorrect = userAnswer === correct ||
      correct.includes(userAnswer) ||
      userAnswer.includes(correct.split(' ')[0])

    const newResults = { ...results, [drill.id]: { correct: isCorrect, shown: true } }
    setResults(newResults)

    // Check if all drills attempted
    if (Object.keys(newResults).length === session.drills.length) {
      setAllDone(true)
    }
  }

  const correctCount = Object.values(results).filter(r => r.correct).length

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          ⚡ {session.drills.length} Drills
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
          Answer each one, then check. Complete all to continue.
        </div>
      </div>

      {session.drills.map((drill, i) => {
        const result = results[drill.id]
        return (
          <div key={drill.id} style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '20px', marginBottom: 14,
            boxShadow: 'var(--shadow-xs)',
            borderColor: result ? (result.correct ? 'var(--green)' : 'var(--red)') : 'var(--border)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-4)', marginBottom: 8 }}>
              Drill {i + 1} · {drill.type === 'fill_blank' ? 'Fill in the blank' : drill.type === 'translation' ? 'Translate' : 'Negation'}
            </div>

            <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--text)' }}>{drill.prompt}</strong>
              {drill.sentence && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{drill.sentence}"</div>}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: result ? 10 : 0 }}>
              <input
                className="drill-input"
                style={{ flex: 1 }}
                value={answers[drill.id] || ''}
                onChange={e => setAnswers({ ...answers, [drill.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && !result && check(drill)}
                placeholder="Your answer…"
                disabled={!!result}
              />
              {!result && (
                <button className="btn btn-primary" onClick={() => check(drill)}>Check</button>
              )}
            </div>

            {result && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--r-sm)',
                background: result.correct ? 'var(--green-bg)' : 'var(--red-bg)',
                border: `1px solid ${result.correct ? 'var(--green-border)' : 'var(--red-border)'}`,
                borderLeft: `3px solid ${result.correct ? 'var(--green)' : 'var(--red)'}`,
                fontSize: 13, lineHeight: 1.6,
                color: result.correct ? 'var(--green)' : 'var(--red)',
              }}>
                {result.correct
                  ? `✓ Correct! ${drill.hint}`
                  : `✗ The answer is: "${drill.answer}" — ${drill.hint}`
                }
              </div>
            )}
          </div>
        )
      })}

      {allDone && (
        <div>
          <div style={{
            background: correctCount >= 3 ? 'var(--green-bg)' : 'var(--amber-bg)',
            border: `1px solid ${correctCount >= 3 ? 'var(--green-border)' : 'var(--amber-border)'}`,
            borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: 16,
            fontSize: 14, fontWeight: 600,
            color: correctCount >= 3 ? 'var(--green)' : 'var(--amber)',
          }}>
            {correctCount}/{session.drills.length} correct
            {correctCount >= 3 ? ' — Great work! Moving on.' : ' — Review the corrections above, then continue.'}
          </div>
          <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            Next: Speaking Activation 🎤
          </button>
        </div>
      )}
    </div>
  )
}

// ── STEP 2: SPEAKING ───────────────────────────────────────────────────────
function SpeakingStep({ session, onNext }) {
  const [spoken, setSpoken] = useState({})

  const speak = (text, id) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'fi-FI'
      u.rate = 0.85
      speechSynthesis.speak(u)
      setSpoken(prev => ({ ...prev, [id]: true }))
    }
  }

  const speakingItems = [
    ...session.theory.examples.map((ex, i) => ({ id: `ex${i}`, text: ex.fi, label: ex.en })),
  ]

  const allListened = speakingItems.every(item => spoken[item.id])

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🎤 Speaking Activation</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
          Press the speaker to hear each sentence. Then say it aloud yourself.
          Focus on getting the double vowel right for <strong>hän</strong> forms.
        </div>
      </div>

      {speakingItems.map((item) => (
        <div key={item.id} style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '16px 18px', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: 'var(--shadow-xs)',
          borderColor: spoken[item.id] ? 'var(--green-border)' : 'var(--border)',
        }}>
          <button
            onClick={() => speak(item.text, item.id)}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: spoken[item.id] ? 'var(--green)' : 'var(--grad)',
              color: '#fff', fontSize: 18, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79,126,255,0.3)',
              transition: 'all 0.15s',
            }}
          >
            {spoken[item.id] ? '✓' : '🔊'}
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{item.text}</div>
            <div style={{ fontSize: 12, color: 'var(--text-4)', fontStyle: 'italic', marginTop: 2 }}>{item.label}</div>
          </div>
        </div>
      ))}

      <div style={{ margin: '20px 0 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 10 }}>
          Now try these yourself — say them out loud:
        </div>
        {[
          'Minä kuuntelen podcasteja aamuisin.',
          'Hän hymyilee, kun hän näkee kavereitaan.',
          'Me emme opiskele suomea viikonloppuna.',
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '10px 14px',
            fontSize: 14, fontWeight: 500, color: 'var(--text-2)',
            marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}>
            <span>{s}</span>
            <button onClick={() => speak(s, `speak${i}`)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-4)',
              transition: 'color 0.15s',
            }}>🔊</button>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
        Next: Vocabulary 📚
      </button>
    </div>
  )
}

// ── STEP 3: VOCABULARY ─────────────────────────────────────────────────────
function VocabStep({ session, onNext }) {
  const [revealed, setRevealed] = useState({})

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'fi-FI'; u.rate = 0.8
      speechSynthesis.speak(u)
    }
  }

  const allRevealed = session.vocab.every(v => revealed[v.fi])

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>📚 {session.vocab.length} New Words</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
          Reveal each card, say the word aloud, then read the memory anchor. These will appear in your review queue tomorrow.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
        {session.vocab.map((word) => {
          const isRevealed = revealed[word.fi]
          return (
            <div
              key={word.fi}
              onClick={() => { setRevealed(prev => ({ ...prev, [word.fi]: true })); speak(word.fi) }}
              style={{
                background: isRevealed ? 'var(--surface)' : 'var(--grad)',
                border: `1.5px solid ${isRevealed ? 'var(--border)' : 'transparent'}`,
                borderRadius: 'var(--r-lg)',
                padding: '16px',
                cursor: isRevealed ? 'default' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isRevealed ? 'var(--shadow-xs)' : '0 4px 12px rgba(79,126,255,0.3)',
                minHeight: 100,
              }}
            >
              {!isRevealed ? (
                <div style={{ color: '#fff', textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>?</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Tap to reveal</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{word.fi}</div>
                    <button onClick={(e) => { e.stopPropagation(); speak(word.fi) }} style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--blue)'
                    }}>🔊</button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>{word.en}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--blue)', fontStyle: 'italic',
                    background: 'var(--blue-bg)', padding: '4px 8px',
                    borderRadius: 'var(--r-sm)', lineHeight: 1.5,
                  }}>
                    💡 {word.memory}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', background: 'var(--surface2)', padding: '2px 6px', borderRadius: 10 }}>{word.type}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allRevealed && (
        <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          Next: Micro-Conversation 💬
        </button>
      )}
      {!allRevealed && (
        <div style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center' }}>
          Reveal all {session.vocab.length} cards to continue — {Object.keys(revealed).length}/{session.vocab.length} revealed
        </div>
      )}
    </div>
  )
}

// ── STEP 4: CONVERSATION ───────────────────────────────────────────────────
function ConversationStep({ session, onNext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: session.conversation.starter }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [turns, setTurns] = useState(0)
  const { user } = useApp()
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    const newTurns = turns + 1

    try {
      const systemContext = `You are a Finnish person having a casual conversation. Setup: ${session.conversation.setup}. 
Keep responses short (1-3 sentences). Respond in Finnish. If the student makes a grammar error, gently correct it naturally within your response. After ${3 - newTurns <= 0 ? 'this turn' : `${3 - newTurns} more turn(s)`}, start wrapping up the conversation naturally.`
      const reply = await callClaude({
        messages: next.slice(-8),
        user,
        sessionContext: systemContext,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setTurns(newTurns)
    } catch(e) { setMessages(prev => [...prev, { role: 'assistant', content: 'Anteeksi, en kuullut. (Sorry, connection error.)' }]) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>💬 Micro-Conversation</div>
        <div style={{
          background: 'var(--blue-bg)', border: '1px solid var(--blue-border)',
          borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--text-2)',
        }}>
          <strong>Setup:</strong> {session.conversation.setup}
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 16,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '16px 20px', maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? 'var(--surface2)' : 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: msg.role === 'user' ? 10 : 14, fontWeight: 700, color: msg.role === 'user' ? 'var(--text-3)' : '#fff', flexShrink: 0 }}>
                {msg.role === 'user' ? 'F' : '🇫🇮'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--r-lg)', fontSize: 13.5, lineHeight: 1.65, background: msg.role === 'user' ? 'var(--grad)' : 'var(--surface2)', color: msg.role === 'user' ? '#fff' : 'var(--text-2)', border: msg.role === 'user' ? 'none' : '1px solid var(--border)' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ fontSize: 12, color: 'var(--text-4)', fontStyle: 'italic' }}>Finnish person is typing…</div>}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', gap: 8 }}>
          <input
            className="drill-input"
            style={{ flex: 1 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Vastaa suomeksi… (Answer in Finnish)"
            disabled={loading}
          />
          <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>→</button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 16 }}>
        Example response: <em>"{session.conversation.example_response}"</em>
      </div>

      {turns >= 2 && (
        <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          Continue to Progression Check ✓
        </button>
      )}
    </div>
  )
}

// ── STEP 5: PROGRESSION CHECK ──────────────────────────────────────────────
function ProgressionCheck({ session, onPass, onFail }) {
  const { user } = useApp()
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const allAnswered = session.progression_check.questions.every(q => answers[q.id]?.trim())

  const submit = async () => {
    if (!allAnswered || loading) return
    setLoading(true)

    const questionsAndAnswers = session.progression_check.questions.map(q => (
      `Q: ${q.text}\nA: ${answers[q.id]}`
    )).join('\n\n')

    const evaluationPrompt = `You are evaluating a student's progression check for the Finnish language session: "${session.title}".

The session covered: ${session.topics.join(', ')}

Here are the student's answers:

${questionsAndAnswers}

Evaluate each answer. Be strict but fair. For each question:
- Mark it PASS or FAIL
- Give a brief explanation (1-2 sentences)

Then give:
- Overall score: X/5
- Overall verdict: PASS (if 4 or 5 correct) or FAIL (if 3 or fewer correct)
- If FAIL: specify exactly what to review

Format your response exactly like this:
Q1: PASS/FAIL — [explanation]
Q2: PASS/FAIL — [explanation]
Q3: PASS/FAIL — [explanation]
Q4: PASS/FAIL — [explanation]
Q5: PASS/FAIL — [explanation]

SCORE: X/5
VERDICT: PASS or FAIL
${answers ? 'WEAK_POINTS: [list points to review, or NONE]' : ''}`

    try {
      const evaluation = await callClaude({
        messages: [{ role: 'user', content: evaluationPrompt }],
        user,
        sessionContext: `Evaluating progression check for Session ${session.id}: ${session.title}`,
      })

      const passed = evaluation.includes('VERDICT: PASS')
      const scoreMatch = evaluation.match(/SCORE:\s*(\d+)\/5/)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null

      setResult({ passed, score, evaluation })

      if (passed) {
        setTimeout(() => onPass({ score, evaluation }), 1500)
      }
    } catch(e) {
      setResult({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  if (result && !result.error) {
    return (
      <div>
        <div style={{
          background: result.passed ? 'var(--green-bg)' : 'var(--amber-bg)',
          border: `2px solid ${result.passed ? 'var(--green)' : 'var(--amber)'}`,
          borderRadius: 'var(--r-lg)', padding: '24px',
          textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{result.passed ? '🎉' : '💪'}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: result.passed ? 'var(--green)' : 'var(--amber)', marginBottom: 4 }}>
            {result.passed ? 'Session Complete!' : 'Not Quite Yet'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>
            Score: {result.score}/5 — {result.passed ? 'Next session unlocked' : 'Review and try again'}
          </div>
        </div>

        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '16px',
          fontSize: 13, lineHeight: 1.8, color: 'var(--text-2)',
          marginBottom: 16,
          whiteSpace: 'pre-line',
        }}>
          {result.evaluation}
        </div>

        {!result.passed && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => { setResult(null); setAnswers({}) }} style={{ flex: 1, justifyContent: 'center' }}>
              Retry Check
            </button>
            <button className="btn btn-amber" onClick={() => onFail(result)} style={{ flex: 1, justifyContent: 'center' }}>
              Review Weak Points
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>✓ Progression Check</div>
        <div style={{
          background: 'var(--blue-bg)', border: '1px solid var(--blue-border)',
          borderRadius: 'var(--r-sm)', padding: '10px 14px',
          fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6,
        }}>
          {session.progression_check.instructions} Score 4/5 or higher to unlock the next session. Your answers will be evaluated by the AI tutor.
        </div>
      </div>

      {session.progression_check.questions.map((q, i) => (
        <div key={q.id} style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '18px 20px', marginBottom: 14,
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--blue)', marginBottom: 8 }}>
            Question {i + 1}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.65, fontWeight: 500 }}>
            {q.text}
          </div>
          <textarea
            className="drill-input"
            style={{ resize: 'vertical', minHeight: 80 }}
            placeholder="Write your answer in Finnish…"
            value={answers[q.id] || ''}
            onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
          />
        </div>
      ))}

      <button
        className="btn btn-primary"
        onClick={submit}
        disabled={!allAnswered || loading}
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14 }}
      >
        {loading ? 'AI is evaluating your answers…' : 'Submit for Evaluation →'}
      </button>

      {result?.error && (
        <div style={{ marginTop: 10, color: 'var(--red)', fontSize: 13 }}>Error: {result.error}</div>
      )}
    </div>
  )
}

// ── STEP 6: COMPLETE ───────────────────────────────────────────────────────
function CompleteStep({ session, checkResult, onNavigateLibrary }) {
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'fi-FI'; speechSynthesis.speak(u)
    }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 8 }}>
        Session {session.id} Complete!
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
        Score: {checkResult?.score}/5 · Session {session.id + 1} is now unlocked.
      </p>

      {/* Summary */}
      <div className="session-complete-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { icon: '📚', value: session.vocab_count, label: 'Words learned' },
          { icon: '⚡', value: session.drills.length, label: 'Drills completed' },
          { icon: '✓', value: `${checkResult?.score}/5`, label: 'Check score' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '16px', boxShadow: 'var(--shadow-xs)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.5px' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Preview of next session */}
      <div style={{
        background: 'var(--surface)', border: '1.5px solid var(--blue-border)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px', marginBottom: 24, textAlign: 'left',
        boxShadow: '0 4px 16px rgba(79,126,255,0.1)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--blue)', marginBottom: 6 }}>
          🔓 Up Next — Session {session.id + 1}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>PAIKALLISSIJAT — -ssa vs -lla</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 3 }}>Inessive and adessive — the full placement system</div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onNavigateLibrary} style={{ flex: 1, justifyContent: 'center' }}>
          Session Library
        </button>
        <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={() => speak('Hienoa työtä! Jatka niin!')}>
          🔊 Hienoa työtä! (Great work!)
        </button>
      </div>
    </div>
  )
}

// ── MAIN SESSION FLOW ──────────────────────────────────────────────────────
export default function SessionFlow({ sessionId = 7 }) {
  const { navigate } = useApp()
  const session = getSession(sessionId)
  const [currentStep, setCurrentStep] = useState(0)
  const [checkResult, setCheckResult] = useState(null)

  if (!session || !session.theory) {
    return (
      <div className="page">
        <div className="page-header">
          <h2>Session {sessionId}</h2>
          <p>Full session content coming soon. Check back after the next update.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('sessions')}>← Back to Library</button>
      </div>
    )
  }

  const handleNext = () => setCurrentStep(prev => prev + 1)

  const handlePass = (result) => {
    setCheckResult(result)
    setCurrentStep(6)
  }

  const handleFail = (result) => {
    setCheckResult(result)
    // Stay on progression check, show weak points
  }

  const stepComponents = {
    0: <TheoryStep session={session} onNext={handleNext} />,
    1: <DrillsStep session={session} onNext={handleNext} />,
    2: <SpeakingStep session={session} onNext={handleNext} />,
    3: <VocabStep session={session} onNext={handleNext} />,
    4: <ConversationStep session={session} onNext={handleNext} />,
    5: <ProgressionCheck session={session} onPass={handlePass} onFail={handleFail} />,
    6: <CompleteStep session={session} checkResult={checkResult} onNavigateLibrary={() => navigate('sessions')} />,
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate('sessions')}
          className="btn btn-ghost"
          style={{ padding: '6px 12px', fontSize: 12 }}
        >
          ← Library
        </button>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-4)' }}>
            Session {session.id} · SKK1
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px' }}>{session.title}</div>
        </div>
      </div>

      {/* Step bar */}
      <StepBar currentStep={currentStep} />

      {/* Step content */}
      <div className="card" style={{ minHeight: 400 }}>
        {stepComponents[currentStep]}
      </div>
    </div>
  )
}
