import { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import './ChatWindow.css'

/**
 * ChatWindow — Message list + input area.
 */
export default function ChatWindow({ messages, isLoading, onSendMessage }) {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window" id="chat-window">
      {/* ── Message list ─────────────────────── */}
      <div className="message-list" id="message-list">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} index={i} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ───────────────────────── */}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  )
}
