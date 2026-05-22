import { Sparkles, Heart, Brain, BookOpen, Sunrise } from 'lucide-react'
import './WelcomeScreen.css'
import { useState } from 'react'

const SUGGESTIONS = [
  { icon: <Heart size={18} />, text: "I'm feeling anxious about my future" },
  { icon: <Brain size={18} />, text: "How can I deal with stress at work?" },
  { icon: <BookOpen size={18} />, text: "What does the Bhagavad Gita say about fear?" },
  { icon: <Sunrise size={18} />, text: "I need motivation to keep going" },
]

export default function WelcomeScreen({ onSuggestionClick }) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    const trimmed = input.trim()
    if (trimmed) {
      onSuggestionClick(trimmed)
      setInput('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="welcome" id="welcome-screen">
      {/* Decorative glow */}
      <div className="welcome-glow" />

      <div className="welcome-content">
        <div className="welcome-icon">
          <Sparkles size={36} />
        </div>
        <h1 className="welcome-title">
          Welcome to <span className="accent-text">Help.ai</span>
        </h1>
        <p className="welcome-subtitle">
          Your compassionate AI companion blending ancient wisdom with modern guidance.
          <br />
          Share what's on your mind — I'm here to listen and help. 🙏
        </p>

        {/* Direct input */}
        <div className="welcome-input">
          <input
            type="text"
            placeholder="Ask me anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="input-field"
          />
          <button className="send-button" onClick={handleSend}>Send</button>
        </div>

        <div className="suggestion-grid">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="suggestion-card"
              id={`suggestion-${i}`}
              onClick={() => onSuggestionClick(s.text)}
            >
              <span className="suggestion-icon">{s.icon}</span>
              <span className="suggestion-text">{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
