import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light flex justify-around py-2 pb-safe z-30">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-0.5 text-xs ${
          location.pathname === '/' ? 'text-gold' : 'text-text-tertiary'
        }`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Home
      </button>
      <button
        onClick={() => navigate('/orders')}
        className={`flex flex-col items-center gap-0.5 text-xs ${
          location.pathname === '/orders' ? 'text-gold' : 'text-text-tertiary'
        }`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Orders
      </button>
      <button
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center gap-0.5 text-xs ${
          location.pathname === '/profile' ? 'text-gold' : 'text-text-tertiary'
        }`}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        Profile
      </button>
    </nav>
  )
}