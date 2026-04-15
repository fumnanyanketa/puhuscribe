import { useApp } from '../contexts/AppContext'

const TITLES = {
  dashboard: 'Dashboard',
  sessions: 'Session Library',
  session_flow: 'Session',
  session: 'Session',
  quickdrill: 'Quick Drill',
  vocab: 'Vocabulary Bank',
  reference: 'Quick Reference',
  errors: 'Error Tracker',
  professional: 'Professional Track',
  notes: 'Class Notes',
}

export default function TopBar() {
  const { activeScreen, theme, toggleTheme, openSidebar } = useApp()
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={openSidebar} aria-label="Open menu">☰</button>
        <span className="topbar-title">{TITLES[activeScreen] || ''}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-brand">PuhuScribe</span>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  )
}
