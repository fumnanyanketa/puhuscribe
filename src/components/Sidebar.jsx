import { useApp } from '../contexts/AppContext'

const NAV = [
  { section: 'Learn' },
  { id: 'sessions',     icon: '◫', label: 'All Sessions' },
  { id: 'dashboard',    icon: '⌂', label: 'Dashboard' },
  { id: 'session',      icon: '▶', label: 'Current Session', badge: 'S7' },
  { id: 'quickdrill',   icon: '⚡', label: 'Quick Drill', badge: '5', badgeColor: 'amber' },
  { section: 'Reference' },
  { id: 'vocab',        icon: '◈', label: 'Vocabulary Bank' },
  { id: 'reference',    icon: '◉', label: 'Quick Reference', badge: '✓', badgeColor: 'green' },
  { id: 'errors',       icon: '△', label: 'Error Tracker', badge: '8', badgeColor: 'amber' },
  { section: 'My Tracks' },
  { id: 'professional', icon: '◆', label: 'Professional Track' },
  { id: 'notes',        icon: '≡', label: 'Class Notes' },
]

export default function Sidebar() {
  const { user, activeScreen, navigate, sidebarOpen, closeSidebar } = useApp()
  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">PuhuScribe</div>
          <div className="logo-sub">by Fumnanya</div>
        </div>
        <div className="sidebar-user">
          <div className="avatar">{user.initials}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-level">{user.level} · {user.course}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) return <div key={i} className="nav-section-label">{item.section}</div>
            return (
              <div key={item.id} className={`nav-item ${activeScreen === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className={`nav-badge ${item.badgeColor || ''}`}>{item.badge}</span>}
              </div>
            )
          })}
        </nav>
        <div className="streak-widget">
          <div className="streak-top">
            <span style={{ fontSize: 24 }}>🔥</span>
            <div className="streak-meta">
              <div className="streak-count">{user.streak}</div>
              <div className="streak-label">day streak</div>
            </div>
          </div>
          <div className="streak-days">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className={`day-dot ${user.streakDays[i]}`}>{d}</div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
