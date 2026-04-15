import { SESSIONS } from '../data/sessions'
import { useApp } from '../contexts/AppContext'

const STATUS_CONFIG = {
  complete: { icon: '✓', label: 'Complete',  color: 'var(--green)',  bg: 'var(--green-bg)',  border: 'var(--green-border)' },
  active:   { icon: '▶', label: 'In Progress', color: 'var(--blue)',   bg: 'var(--blue-bg)',   border: 'var(--blue-border)' },
  locked:   { icon: '🔒', label: 'Locked',    color: 'var(--text-4)', bg: 'var(--surface2)',  border: 'var(--border)' },
}

export default function SessionLibrary() {
  const { navigate, sessionProgress } = useApp()

  const handleSessionClick = (session) => {
    if (session.status === 'locked') return
    navigate('session_flow', { sessionId: session.id })
  }

  const completed = SESSIONS.filter(s => s.status === 'complete').length

  return (
    <div className="page">
      <div className="page-header fade-up">
        <h2>Session Library</h2>
        <p>SKK1 — 24 sessions · {completed} complete · {SESSIONS.length - completed} remaining</p>
      </div>

      {/* Progress overview */}
      <div className="card fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Course Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{completed}/24 sessions</span>
        </div>
        <div style={{ background: 'var(--surface2)', height: 8, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completed / 24) * 100}%`,
            background: 'var(--grad)',
            borderRadius: 10,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {['complete', 'active', 'locked'].map(status => {
            const cfg = STATUS_CONFIG[status]
            const count = SESSIONS.filter(s => s.status === status).length
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.icon}</span>
                <span style={{ color: 'var(--text-3)' }}>{count} {cfg.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Session grid */}
      <div className="fade-up-1" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {SESSIONS.map(session => {
          const cfg = STATUS_CONFIG[session.status]
          const isLocked = session.status === 'locked'
          const isActive = session.status === 'active'

          return (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session)}
              style={{
                background: 'var(--surface)',
                border: `1.5px solid ${isActive ? 'var(--blue)' : cfg.border}`,
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
                cursor: isLocked ? 'default' : 'pointer',
                opacity: isLocked ? 0.55 : 1,
                transition: 'all 0.18s',
                boxShadow: isActive ? '0 4px 16px rgba(79,126,255,0.15)' : 'var(--shadow-xs)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!isLocked) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {/* Active indicator stripe */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'var(--grad)',
                }} />
              )}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: 'var(--text-4)',
                  letterSpacing: 0.5,
                }}>
                  Session {session.id}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  color: cfg.color,
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 20,
                  letterSpacing: 0.3,
                  whiteSpace: 'nowrap',
                }}>
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </div>
              </div>

              {/* Title */}
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: isLocked ? 'var(--text-3)' : 'var(--text)',
                marginBottom: 4,
                lineHeight: 1.3,
              }}>
                {session.title}
              </div>

              {/* Subtitle */}
              <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.5, marginBottom: 12 }}>
                {session.subtitle}
              </div>

              {/* Topics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {session.topics.slice(0, 3).map((t, i) => (
                  <span key={i} style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 20,
                    background: isActive ? 'var(--blue-bg)' : 'var(--surface2)',
                    color: isActive ? 'var(--blue)' : 'var(--text-4)',
                    border: `1px solid ${isActive ? 'var(--blue-border)' : 'var(--border)'}`,
                  }}>{t}</span>
                ))}
                {session.topics.length > 3 && (
                  <span style={{ fontSize: 10, color: 'var(--text-4)', padding: '2px 4px' }}>+{session.topics.length - 3}</span>
                )}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                fontSize: 11, color: 'var(--text-4)',
              }}>
                <span>⏱ {session.duration}</span>
                <span>📚 {session.vocab_count} words</span>
                {isActive && (
                  <button
                    onClick={e => { e.stopPropagation(); navigate('session_flow', { sessionId: session.id }) }}
                    style={{
                      background: 'var(--grad)',
                      color: '#fff', border: 'none',
                      borderRadius: 'var(--r-sm)',
                      padding: '4px 12px',
                      fontSize: 11, fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
