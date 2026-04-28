import { useCart } from '../context/CartContext'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Header({ onCartClick, searchQuery, onSearch }) {
  const { count } = useCart()

  return (
    <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 gap-2 sm:gap-4">
        <h1 className="font-serif text-base sm:text-lg text-gold whitespace-nowrap font-bold">
          Kings & <span className="text-ink">Queens</span>
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://wa.me/27680895953?text=Hi+Kings+%26+Queens"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 bg-[#E7F3EF] border border-[#D1E7DD] text-[#075E54] px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95"
          >
            <FaWhatsapp size={14} />
            <span className="hidden sm:inline">Chat</span>
          </a>

          <button
            onClick={onCartClick}
            className={`bg-gold text-white w-9 h-9 rounded-xl flex items-center justify-center relative transition-all active:scale-90 ${count > 0 ? 'shadow-lg shadow-gold/20' : ''}`}
          >
            <FiShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-ember text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-in zoom-in">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar - Integrated Prop Control */}
      <div className="px-3 sm:px-4 pb-3">
        <div className="flex items-center bg-cream-200 rounded-xl px-3 py-2.5 gap-2 focus-within:ring-1 focus-within:ring-gold/30 transition-all">
          <FiSearch className="text-ink-ghost flex-shrink-0" size={16} />
          <input
            type="text"
            value={searchQuery}
            placeholder="Search drinks, food..."
            className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder-ink-muted font-medium"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}