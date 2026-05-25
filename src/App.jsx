import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './auth/firebase'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import WelcomeScreen from './components/WelcomeScreen'
import Auth from './components/Auth'
import './App.css'

const DEFAULT_SESSIONS = [
  { id: 'default', title: 'New Conversation', date: new Date().toLocaleDateString() },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Map of sessionId → messages persisted in localStorage
  const [messageMap, setMessageMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sessionMessages') || '{}')
    } catch {
      return {}
    }
  })

  // Sessions list persisted in localStorage
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('sessionList')
      return saved ? JSON.parse(saved) : DEFAULT_SESSIONS
    } catch {
      return DEFAULT_SESSIONS
    }
  })

  const [activeSession, setActiveSession] = useState('default')
  const [messages, setMessages] = useState(messageMap[activeSession] || [])
  const [isLoading, setIsLoading] = useState(false)

  // Persist messageMap to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sessionMessages', JSON.stringify(messageMap))
  }, [messageMap])

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sessionList', JSON.stringify(sessions))
  }, [sessions])

  // Load messages for the active session
  useEffect(() => {
    setMessages(messageMap[activeSession] || [])
  }, [activeSession, messageMap])

  // Listen to Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  /** Append a message to the current session */
  const appendMessage = useCallback((msg) => {
    setMessageMap((prev) => {
      const updated = prev[activeSession] ? [...prev[activeSession], msg] : [msg]
      return { ...prev, [activeSession]: updated }
    })
  }, [activeSession])

  /**
   * Rename the active session if it still has the default title.
   * Called immediately when the user sends a message so the sidebar
   * shows the query text instead of "New Conversation".
   */
  const renameSessionIfDefault = useCallback((text) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession && s.title === 'New Conversation'
          ? { ...s, title: text.slice(0, 40) + (text.length > 40 ? '…' : '') }
          : s
      )
    )
  }, [activeSession])

  /** Send a message to the backend */
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading || !user) return

      // Rename the session in the sidebar right away
      renameSessionIfDefault(text)

      const userMsg = { role: 'user', content: text, timestamp: Date.now() }
      appendMessage(userMsg)
      setIsLoading(true)

      try {
        const token = await user.getIdToken()
        const baseUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
        const res = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ session_id: activeSession, message: text }),
        })
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const data = await res.json()
        const botMsg = {
          role: 'assistant',
          content: data.answer,
          emotion: data.emotion,
          sources: data.sources || [],
          timestamp: Date.now(),
        }
        appendMessage(botMsg)
      } catch (err) {
        const errorMsg = {
          role: 'assistant',
          content: `⚠️ Something went wrong: ${err.message}. Please check your connection or try again later.`,
          emotion: 'Error',
          sources: [],
          timestamp: Date.now(),
        }
        appendMessage(errorMsg)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, activeSession, user, appendMessage, renameSessionIfDefault]
  )

  /** Create a new chat session */
  const newSession = useCallback(() => {
    const id = `session_${Date.now()}`
    setSessions((prev) => [
      { id, title: 'New Conversation', date: new Date().toLocaleDateString() },
      ...prev,
    ])
    setActiveSession(id)
  }, [])

  /** Delete a specific chat session */
  const deleteSession = useCallback((sessionIdToDelete, e) => {
    if (e) e.stopPropagation();

    // 1. Remove messages from messageMap
    setMessageMap((prev) => {
      const updated = { ...prev }
      delete updated[sessionIdToDelete]
      return updated
    })

    // 2. Remove from sessions list and adjust activeSession
    setSessions((prevSessions) => {
      const filtered = prevSessions.filter((s) => s.id !== sessionIdToDelete)
      const nextSessions = filtered.length === 0 ? DEFAULT_SESSIONS : filtered
      
      setActiveSession((prevActive) => {
        if (prevActive === sessionIdToDelete) {
          return nextSessions[0].id
        }
        return prevActive
      })
      
      return nextSessions
    })
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setActiveSession('default')
      setSessions(DEFAULT_SESSIONS)
      setMessageMap({})
      localStorage.removeItem('sessionMessages')
      localStorage.removeItem('sessionList')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner" />
        <p>Aligning with spiritual energies...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />
  }

  return (
    <div className="app-layout">
      <Sidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={setActiveSession}
        onNewSession={newSession}
        onDeleteSession={deleteSession}
        user={user}
        onLogout={handleLogout}
      />
      <main className="app-main">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen onSuggestionClick={sendMessage} />
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={sendMessage} />
        )}
      </main>
    </div>
  )
}
