import { useCart } from '../context/CartContext'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Header({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="bg-white border-b border-border-light sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Logo */}
        <h1 className="font-serif text-lg text-gold whitespace-nowrap">
          Kings & <span className="text-text-primary">Queens</span>
        </h1>

        {/* Search bar – middle */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="flex items-center bg-cream rounded-md px-3 py-2 gap-2">
            <FiSearch className="text-text-tertiary" size={14} />
            <input
              type="text"
              placeholder="Search drinks, food..."
              className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder-text-tertiary"
              onChange={(e) => window.dispatchEvent(new CustomEvent('search', { detail: e.target.value }))}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href="https://wa.me/27680895953?text=Hi+Kings+%26+Queens"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 bg-green-light border border-green-border text-green-text px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
          >
            <FaWhatsapp size={14} />
            Chat
          </a>

          {/* Cart with badge */}
          <button
            onClick={onCartClick}
            className="bg-gold text-white w-9 h-9 rounded-md flex items-center justify-center relative"
          >
            <FiShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}