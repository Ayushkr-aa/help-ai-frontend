import './EmotionBadge.css'

/**
 * Mapping of emotion labels to emoji + color.
 */
const EMOTION_CONFIG = {
  Anxiety:          { emoji: '😰', color: '#f59e0b' },
  Depression:       { emoji: '😢', color: '#6366f1' },
  Motivation:       { emoji: '🔥', color: '#10b981' },
  Anger:            { emoji: '😠', color: '#ef4444' },
  Fear:             { emoji: '😨', color: '#8b5cf6' },
  'Self-confidence':{ emoji: '💪', color: '#06b6d4' },
  'Career confusion':{ emoji: '🤔', color: '#f97316' },
  Loneliness:       { emoji: '🥺', color: '#a78bfa' },
  Stress:           { emoji: '😩', color: '#ec4899' },
  'Relationship issues':{ emoji: '💔', color: '#f43f5e' },
  'Spiritual confusion':{ emoji: '🕉️', color: '#d97706' },
  Crisis:           { emoji: '🆘', color: '#dc2626' },
  Error:            { emoji: '⚠️', color: '#71717a' },
}

/**
 * EmotionBadge — Displays the detected emotion as a pill badge.
 */
export default function EmotionBadge({ emotion }) {
  const config = EMOTION_CONFIG[emotion] || { emoji: '💭', color: '#71717a' }

  return (
    <span
      className="emotion-badge"
      style={{
        '--badge-color': config.color,
        '--badge-bg': `${config.color}18`,
        '--badge-border': `${config.color}30`,
      }}
    >
      <span className="emotion-emoji">{config.emoji}</span>
      <span className="emotion-label">{emotion}</span>
    </span>
  )
}
