import { useState } from 'react'
import TutorChat from './TutorChat'

const STEPS = [
  { label: 'Theory', status: 'done' },
  { label: 'Drills', status: 'active' },
  { label: 'Speaking', status: 'upcoming' },
  { label: 'Vocabulary', status: 'upcoming' },
  { label: 'Progression', status: 'upcoming' },
]

const SESSION_CONTEXT = `Current session: 7. Topic: Verb Type 3 + KPT NT→NN. Student is on step 2 (Drills). Key verbs: kuunnella, hymyillä, opiskella. Recent error: missed double-vowel for hän in Type 1 (3 times).`

export default function SessionRoom() {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)

  const check = () => {
    const val = answer.trim().toLowerCase()
    if (val === 'kuuntelee') {
      setFeedback({ type: 'correct', text: '✓ Correct. Stem kuuntele- + hän → double the final vowel → kuuntelee.' })
    } else {
      setFeedback({ type: 'wrong', text: `✗ Not quite. The answer is kuuntelee. kuunnella is Type 3 — remove -la to get stem kuuntele-, then hän doubles the vowel. You wrote: "${answer}"` })
    }
  }

  return (
    <div className="page">
      {/* Session header */}
      <div className="card fade-up" style={{ marginBottom: 18 }}>
        <div className="session-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-4)', marginBottom: 8 }}>Session 7 · SKK1</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 10 }}>Verb Type 3 + KPT Gradation</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Conjugation', 'KPT NT→NN', 'Verb stems'].map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <div className="session-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="step-item">
                <div className={`step-dot ${s.status}`}>{s.status === 'done' ? '✓' : i + 1}</div>
                <span style={{ color: s.status === 'active' ? 'var(--text)' : 'var(--text-4)', fontWeight: s.status === 'active' ? 600 : 400 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theory */}
      <div className="theory-block fade-up-1">
        <div className="theory-label">◉ Origin → Logic → Rule → Exceptions</div>
        <div className="logic-flow">
          <div className="logic-step"><div className="logic-step-label">Origin</div><div className="logic-step-value">Two-consonant + a/ä ending</div></div>
          <div className="logic-step"><div className="logic-step-label">Pattern</div><div className="logic-step-value">-lla/-nna/-rra/-sta endings</div></div>
          <div className="logic-step"><div className="logic-step-label">Rule</div><div className="logic-step-value">Remove -a/-ä → get stem</div></div>
          <div className="logic-step" style={{ borderRight: 'none' }}><div className="logic-step-label">Conjugate</div><div className="logic-step-value">Apply normal endings</div></div>
        </div>
        <div className="rule-box">
          <div className="rule-label">The Rule — Verb Type 3</div>
          <p>Verbs ending in <strong>-lla/-llä, -nna/-nnä, -rra/-rrä, -sta/-stä</strong>. Remove the final -a/-ä to get your stem. Then add normal endings. KPT gradation applies: NT → NN in the weak grade.</p>
        </div>
        <div className="exception-box">
          <div className="exc-label">⚠ Exceptions</div>
          <p><strong>juosta</strong> (to run) → irregular stem <strong>juokse-</strong>, not juosta-.<br /><strong>panna</strong> → archaic, spoken Finnish prefers <em>laittaa</em>.<br />KPT does NOT apply to: ST, SK, TK, HK clusters.</p>
        </div>
        <div className="examples-grid">
          {[
            { fi: 'Minä kuuntelen musiikkia.', hi: 'kuuntelen', en: 'I listen to music.' },
            { fi: 'Hän hymyilee aina.', hi: 'hymyilee', en: 'She always smiles.' },
            { fi: 'He opiskelevat suomea.', hi: 'opiskelevat', en: 'They study Finnish.' },
            { fi: 'En kuuntele radiota.', hi: 'kuuntele', en: "I don't listen to the radio." },
          ].map((ex, i) => (
            <div key={i} className="example-card">
              <div className="example-fi">{ex.fi.split(ex.hi).map((part, j, arr) => (
                <span key={j}>{part}{j < arr.length - 1 && <span className="example-hi">{ex.hi}</span>}</span>
              ))}</div>
              <div className="example-en">{ex.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Drill */}
      <div className="drill-block fade-up-2">
        <div className="section-header" style={{ marginBottom: 12 }}>
          <div className="section-title">⚡ Drill 1 of 4 — Fill in the blank</div>
        </div>
        <div className="drill-q">
          Conjugate <strong>kuunnella</strong> for <strong>hän</strong>: <em>"Hän ______ podcastia illalla."</em>
        </div>
        <input className="drill-input" type="text" value={answer} onChange={e => { setAnswer(e.target.value); setFeedback(null) }} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type your answer…" />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={check}>Check ↵</button>
          <button className="btn btn-ghost">🎤 Say it aloud</button>
        </div>
        {feedback && <div className={`drill-feedback ${feedback.type}`}>{feedback.text}</div>}
      </div>

      {/* Tutor */}
      <div className="fade-up-3">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">Ask your tutor</div>
            <div className="section-sub">Confused about anything in this session?</div>
          </div>
        </div>
        <TutorChat sessionContext={SESSION_CONTEXT} />
      </div>
    </div>
  )
}
