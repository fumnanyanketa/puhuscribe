import { useApp } from '../contexts/AppContext'

const REVIEWS = [
  { word: 'käydä', sub: 'habitual movement · vs. mennä', status: 'due' },
  { word: 'Partitive after negation', sub: 'Minulla ei ole kissaa', status: 'due' },
  { word: 'kauppakeskus', sub: 'shopping centre', status: 'new' },
  { word: 'PAIKALLISSIJAT', sub: 'inessive vs adessive placement', status: 'due' },
]

const FLAGS = [
  { title: '-ssa vs -lla (PAIKALLISSIJAT)', detail: 'Inessive vs adessive — when to use each for places, cities, countries.' },
  { title: 'päästäkseen construction', detail: 'Opiskelen suomea päästäkseni yliopistoon. Purpose clause pattern.' },
  { title: 'Verb type 3 KPT', detail: 'kuunnella NT→NN. Needs drilling before it becomes instinctive.' },
]

export default function Dashboard() {
  const { user, navigate } = useApp()
  const pct = Math.round((user.sessionsComplete / user.totalSessions) * 100)

  return (
    <div className="page">

      {/* Course Hero */}
      <div className="course-hero fade-up" data-course={user.course}>
        <div className="course-tag">Active Course</div>
        <h1>SKK1 — Finnish A1–A2</h1>
        <p>Suomen kielen kurssi · Mon–Thu 09:00–12:30 · No niin 1 · Suomen Mestari 1</p>
        <div className="progress-bar-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-label">
            <span>{user.sessionsComplete} of {user.totalSessions} sessions</span>
            <strong>{pct}% through SKK1</strong>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-3 fade-up-1" style={{ marginBottom: 20 }}>
        <div className="stat-card blue">
          <div className="stat-label">📚 Vocabulary</div>
          <div className="stat-number blue">{user.vocabCount}</div>
          <div className="stat-sub">words learned · 18 due today</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">⚡ Sessions</div>
          <div className="stat-number green">{user.sessionsComplete}</div>
          <div className="stat-sub">complete · next: Verb Type 3</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">△ Error Patterns</div>
          <div className="stat-number amber">{user.errorsCount}</div>
          <div className="stat-sub">recurring patterns tracked</div>
        </div>
      </div>

      {/* Review + Flags */}
      <div className="grid-2 fade-up-2">
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Due for Review</div>
              <div className="section-sub">4 items · spaced repetition</div>
            </div>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => navigate('quickdrill')}>
              Start ⚡
            </button>
          </div>
          {REVIEWS.map((item, i) => (
            <div className="list-row" key={i}>
              <div>
                <div className="row-title">{item.word}</div>
                <div className="row-sub">{item.sub}</div>
              </div>
              <span className={`pill pill-${item.status}`}>{item.status === 'due' ? 'Due' : 'New'}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Flagged in Class</div>
              <div className="section-sub">From today's session</div>
            </div>
            <button className="btn btn-amber" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => navigate('session')}>
              Drill these
            </button>
          </div>
          {FLAGS.map((f, i) => (
            <div className="flag-item" key={i}>
              <div className="flag-dot" />
              <div className="flag-text">
                <strong>{f.title}</strong> — {f.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
