import { useState } from 'react'
import { useCart } from '../context/CartContext'
import SearchBar from './SearchBar'

export default function Header({ onCartClick }) {
  const [searchVisible, setSearchVisible] = useState(false)
  const { count } = useCart()

  return (
    <header className="bg-white border-b border-border-light sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchVisible(!searchVisible)}
            className="text-text-secondary p-1">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <h1 className="font-serif text-lg text-gold">
            Kings & <span className="text-text-primary">Queens</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://wa.me/27680895953?text=Hi+Kings+%26+Queens"
             target="_blank" rel="noreferrer"
             className="flex items-center gap-1.5 bg-green-light border border-green-border text-green-text px-3 py-1.5 rounded-full text-xs font-medium">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/>
            </svg>
            Chat
          </a>
          <button onClick={onCartClick}
            className="bg-gold text-white w-9 h-9 rounded-md flex items-center justify-center relative">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      {searchVisible && <SearchBar />}
    </header>
  )
}