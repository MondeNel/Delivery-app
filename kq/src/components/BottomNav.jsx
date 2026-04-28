import { useNavigate, useLocation } from 'react-router-dom' // Ensure this line is present
import { useCart } from '../context/CartContext'

const NavItem = ({ label, icon, onClick, active, badge }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 flex-1 py-1 transition-colors relative"
  >
    {/* Active indicator dot */}
    {active && (
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full animate-in zoom-in" />
    )}

    <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
      active ? 'bg-gold/10' : 'hover:bg-cream-200'
    }`}>
      <svg
        width="20" height="20"
        fill="none"
        stroke={active ? '#B8860B' : '#9B8F85'}
        strokeWidth={active ? '2.5' : '1.8'}
        viewBox="0 0 24 24"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-ember text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          {badge}
        </span>
      )}
    </div>

    <span className={`text-[10px] font-bold tracking-tight ${active ? 'text-gold' : 'text-ink-ghost'}`}>
      {label}
    </span>
  </button>
)

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()

  const tabs = [
    {
      label: 'Home', path: '/',
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    },
    {
      label: 'Orders', path: '/orders',
      icon: '<path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
      // Showing cart count on the Orders tab acts as a nudge to checkout
      badge: count,
    },
    {
      label: 'Profile', path: '/profile',
      icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-cream-300 flex items-stretch pb-safe z-30 h-20 px-2"
      style={{ boxShadow: '0 -10px 25px rgba(26,22,18,0.04)' }}
    >
      {tabs.map(tab => (
        <NavItem
          key={tab.path}
          label={tab.label}
          path={tab.path}
          icon={tab.icon}
          onClick={() => navigate(tab.path)}
          active={location.pathname === tab.path}
          badge={tab.badge}
        />
      ))}
    </nav>
  )
}