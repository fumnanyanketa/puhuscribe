import { useState, useRef, useEffect } from 'react'
import { callClaude } from '../api/claude'
import { useApp } from '../contexts/AppContext'

function renderMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:var(--surface3);padding:1px 5px;border-radius:4px;font-size:13px">$1</code>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px">')
    .replace(/\n/g, '<br/>')
}

const WELCOME = `Moi! I'm your Finnish tutor inside **PuhuScribe**.

I know you're in **SKK1** at A1–A2, and I know your weak spots. Here's what we can do right now:

- Start a **full session** (7-step structure)
- **Drill** a specific grammar point
- Explain anything with **origin → logic → rule → exceptions**
- **Conversation practice** in Finnish

What would you like to work on today?`

export default function TutorChat({ sessionContext = null }) {
  const { user } = useApp()
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const reply = await callClaude({ messages: next.slice(-12), user, sessionContext })
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch(e) { setError(e.message) }
    finally { setLoading(false); inputRef.current?.focus() }
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="tutor-chat">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div>
          <div className="chat-title">AI Tutor</div>
          <div className="chat-status"><span className="status-dot"/>{loading ? 'Thinking...' : 'Ready'}</div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'tutor'}`}>
            <div className="msg-avatar">{msg.role === 'user' ? user.initials : '🤖'}</div>
            <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: `<p>${renderMsg(msg.content)}</p>` }} />
          </div>
        ))}
        {loading && (
          <div className="message tutor">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble">
              <div className="typing-indicator">
                <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', color: 'var(--red)', padding: '10px 14px', borderRadius: 'var(--r-sm)', fontSize: 13 }}>
            ⚠ {error}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
        <textarea ref={inputRef} className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Type or dictate — Enter to send…" rows={1} disabled={loading} />
        <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()} style={{ alignSelf: 'flex-end', padding: '10px 16px' }}>
          {loading ? '…' : '→'}
        </button>
      </div>
    </div>
  )
}
