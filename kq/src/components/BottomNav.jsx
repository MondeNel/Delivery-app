import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()
  const { user, isAdmin } = useAuth()
  const hasItems = count > 0

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 flex justify-around py-2 pb-safe z-30">
      <button
        onClick={() => navigate('/')}
        disabled={hasItems}
        className={`flex flex-col items-center gap-0.5 text-xs ${hasItems ? 'opacity-40 pointer-events-none' : ''} ${location.pathname === '/' ? 'text-gold' : 'text-ink-muted'}`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Home
      </button>

      {/* Show Admin for admin users, Orders for regular users */}
      {isAdmin ? (
        <button
          onClick={() => navigate('/admin')}
          className={`flex flex-col items-center gap-0.5 text-xs ${location.pathname === '/admin' ? 'text-gold' : 'text-ink-muted'}`}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Admin
        </button>
      ) : (
        <button
          onClick={() => navigate('/orders')}
          disabled={hasItems}
          className={`flex flex-col items-center gap-0.5 text-xs ${hasItems ? 'opacity-40 pointer-events-none' : ''} ${location.pathname === '/orders' ? 'text-gold' : 'text-ink-muted'}`}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Orders
        </button>
      )}

      {/* Profile stays the same */}
      <button
        onClick={() => navigate('/profile')}
        disabled={hasItems}
        className={`flex flex-col items-center gap-0.5 text-xs ${hasItems ? 'opacity-40 pointer-events-none' : ''} ${location.pathname === '/profile' ? 'text-gold' : 'text-ink-muted'}`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        Profile
      </button>
    </nav>
  )
}