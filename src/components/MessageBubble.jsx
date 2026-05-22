import ReactMarkdown from 'react-markdown'
import EmotionBadge from './EmotionBadge'
import { Sparkles, User } from 'lucide-react'
import './MessageBubble.css'

/**
 * MessageBubble — A single chat message (user or assistant).
 */
export default function MessageBubble({ message, index }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`message-row ${isUser ? 'user' : 'assistant'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Avatar */}
      <div className={`avatar ${isUser ? 'avatar-user' : 'avatar-bot'}`}>
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      {/* Bubble */}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-bot'}`}>
        {/* Emotion badge (bot only) */}
        {!isUser && message.emotion && (
          <EmotionBadge emotion={message.emotion} />
        )}

        {/* Content */}
        <div className="bubble-content markdown-content">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        {/* Sources (bot only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="bubble-sources">
            <span className="sources-label">Sources:</span>
            {message.sources.map((src, i) => (
              <span key={i} className="source-tag">{src}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
