import { Sparkles } from 'lucide-react'
import './TypingIndicator.css'

/**
 * TypingIndicator — Animated dots shown while the bot is thinking.
 */
export default function TypingIndicator() {
  return (
    <div className="message-row assistant" id="typing-indicator">
      <div className="avatar avatar-bot">
        <Sparkles size={16} />
      </div>
      <div className="bubble bubble-bot typing-bubble">
        <div className="typing-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  )
}
