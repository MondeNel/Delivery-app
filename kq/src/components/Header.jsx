import { useCart } from '../context/CartContext'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Header({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 gap-2 sm:gap-4">
        <h1 className="font-serif text-base sm:text-lg text-gold whitespace-nowrap">
          Kings & <span className="text-ink">Queens</span>
        </h1>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <a
            href="https://wa.me/27680895953?text=Hi+Kings+%26+Queens"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1 bg-sage-light border border-sage-border text-sage-text px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
          >
            <FaWhatsapp size={14} />
            <span className="hidden sm:inline">Chat</span>
          </a>

          <button
            onClick={onCartClick}
            className={`bg-gold text-white w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center relative flex-shrink-0 ${count > 0 ? 'cart-pulse' : ''}`}
          >
            <FiShoppingCart size={16} className="sm:text-lg" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-ember text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-3 sm:px-4 pb-3">
        <div className="flex items-center bg-cream-200 rounded-md px-3 py-2 gap-2">
          <FiSearch className="text-ink-muted flex-shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search drinks, food..."
            className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder-ink-muted"
            onChange={(e) => window.dispatchEvent(new CustomEvent('search', { detail: e.target.value }))}
          />
        </div>
      </div>
    </header>
  )
}