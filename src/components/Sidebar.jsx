import { MessageSquarePlus, Sparkles, BookOpen, LogOut, Trash2 } from 'lucide-react'
import './Sidebar.css'

/**
 * Sidebar — Chat session list + branding + user profile + logout.
 */
export default function Sidebar({ sessions, activeSession, onSelectSession, onNewSession, onDeleteSession, user, onLogout }) {
  // Get initial or avatar
  const displayName = user?.displayName || user?.email?.split('@')[0] || "Seeker"
  const photoURL = user?.photoURL
  const email = user?.email || ""

  return (
    <aside className="sidebar" id="sidebar">
      {/* ── Brand ──────────────────────────────── */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Sparkles size={22} className="logo-icon" />
          <span className="logo-text">Help.ai</span>
        </div>
        <p className="sidebar-tagline">Wisdom & Wellbeing</p>
      </div>

      {/* ── New chat button ────────────────────── */}
      <button className="btn-new-chat" id="btn-new-chat" onClick={onNewSession}>
        <MessageSquarePlus size={16} />
        <span>New Conversation</span>
      </button>

      {/* ── Session list ──────────────────────── */}
      <div className="session-list">
        <p className="session-list-label">Recent</p>
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`session-item ${s.id === activeSession ? 'active' : ''}`}
          >
            <div
              className="session-item-click-target"
              onClick={() => onSelectSession(s.id)}
            >
              <BookOpen size={14} className="session-icon" />
              <div className="session-info">
                <span className="session-title">{s.title}</span>
                <span className="session-date">{s.date}</span>
              </div>
            </div>
            {(sessions.length > 1 || s.id !== 'default') && (
              <button
                className="btn-delete-session"
                onClick={(e) => onDeleteSession(s.id, e)}
                title="Delete Conversation"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── User Profile Block & Logout ─────────── */}
      {user && (
        <div className="sidebar-profile-card">
          <div className="profile-details">
            {photoURL ? (
              <img src={photoURL} alt="Avatar" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="profile-meta">
              <span className="profile-name" title={displayName}>{displayName}</span>
              <span className="profile-email" title={email}>{email}</span>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout" title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      )}

      {/* ── Footer ────────────────────────────── */}
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">
          Powered by Ancient Wisdom
          <br />& Modern AI 🙏
        </p>
      </div>
    </aside>
  )
}
