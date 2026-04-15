import { useApp } from './contexts/AppContext'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './components/Dashboard'
import SessionLibrary from './components/SessionLibrary'
import SessionFlow from './components/SessionFlow'
import TutorChat from './components/TutorChat'
import {
  QuickDrill, VocabBank, QuickReference,
  ErrorTracker, ProfessionalTrack, ClassNotes,
} from './components/Screens'

function Screen() {
  const { activeScreen, screenParams } = useApp()
  switch(activeScreen) {
    case 'dashboard':    return <Dashboard />
    case 'sessions':     return <SessionLibrary />
    case 'session_flow': return <SessionFlow sessionId={screenParams.sessionId || 7} />
    case 'session':      return <SessionFlow sessionId={7} />
    case 'quickdrill':   return <QuickDrill />
    case 'vocab':        return <VocabBank />
    case 'reference':    return <QuickReference />
    case 'errors':       return <ErrorTracker />
    case 'professional': return <ProfessionalTrack />
    case 'notes':        return <ClassNotes />
    case 'tutor':        return <div className="page"><TutorChat /></div>
    default:             return <Dashboard />
  }
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        <Screen />
      </main>
    </div>
  )
}
