import { useState, useRef } from 'react'
import { Send, Loader } from 'lucide-react'
import './ChatInput.css'

/**
 * ChatInput — Text input with send button.
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-area" id="chat-input-form" onSubmit={handleSubmit}>
      <div className="chat-input-wrapper">
        <textarea
          ref={inputRef}
          className="chat-input"
          id="chat-input"
          placeholder="Share what's on your mind..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          autoFocus
        />
        <button
          type="submit"
          className={`btn-send ${text.trim() && !disabled ? 'active' : ''}`}
          id="btn-send"
          disabled={!text.trim() || disabled}
        >
          {disabled ? <Loader size={18} className="spin" /> : <Send size={18} />}
        </button>
      </div>
      <p className="input-disclaimer">
        Help.ai blends ancient wisdom with modern guidance. Not a substitute for professional help.
      </p>
    </form>
  )
}
