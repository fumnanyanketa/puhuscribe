import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('ps_theme') || 'light')
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('ps_theme', theme) }, [theme])
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // Navigation — supports params for session routing
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [screenParams, setScreenParams] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (screen, params = {}) => {
    setActiveScreen(screen)
    setScreenParams(params)
    setSidebarOpen(false)
  }

  // Session progress (persisted to localStorage until Phase 3 Supabase)
  const [sessionProgress, setSessionProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ps_session_progress') || '{}') }
    catch { return {} }
  })

  const markSessionComplete = (sessionId) => {
    const updated = { ...sessionProgress, [sessionId]: { complete: true, completedAt: new Date().toISOString() } }
    setSessionProgress(updated)
    localStorage.setItem('ps_session_progress', JSON.stringify(updated))
  }

  // User profile
  const [user] = useState({
    name: 'Fumnanya', initials: 'F',
    level: 'A1+ → A2', course: 'SKK1',
    sessionsComplete: 7, totalSessions: 24,
    streak: 12,
    streakDays: ['done','done','done','done','today','none','none'],
    vocabCount: 214, errorsCount: 8,
  })

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      activeScreen, screenParams, navigate,
      sidebarOpen, openSidebar: () => setSidebarOpen(true), closeSidebar: () => setSidebarOpen(false),
      user,
      sessionProgress, markSessionComplete,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
