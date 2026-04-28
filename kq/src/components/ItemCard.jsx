import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { FiPlus, FiMinus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi'

export default function ItemCard({ item, onCardClick }) {
  const { items, dispatch } = useCart()
  const { isAdmin } = useAuth()
  const { updateItem, deleteItem } = useProducts()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem?.qty ?? 0

  const [editing, setEditing] = useState(false)
  const [editPrice, setEditPrice] = useState(item.price)

  const isLow = item.stock === 'low'
  const isOut = item.stock === 'out'

  const handleSavePrice = (e) => {
    e.stopPropagation()
    if (editPrice && editPrice > 0) {
      const type = item.cat && ['combo','grill','single','side'].includes(item.cat) ? 'food' : 'drink'
      updateItem(item.id, type, { price: Number(editPrice) })
      setEditing(false)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm(`Permanently delete ${item.name}?`)) {
      const type = item.cat && ['combo','grill','single','side'].includes(item.cat) ? 'food' : 'drink'
      deleteItem(item.id, type)
    }
  }

  return (
    <div
      onClick={() => onCardClick?.(item)}
      className="group relative bg-white border border-cream-200 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:border-gold/40 hover:shadow-lg active:scale-[0.97]"
      style={{ boxShadow: '0 1px 6px rgba(26,22,18,0.07)' }}
    >
      {/* ── Admin controls ── */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(!editing) }}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
          >
            {editing ? <FiX size={12} /> : <FiEdit2 size={12} />}
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}

      {/* ── Image area — clean white bg like a product sheet ── */}
      <div className="relative bg-[#F7F5F2] flex items-center justify-center overflow-hidden"
        style={{ height: '160px' }}
      >
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-[11px] font-black text-gold/30 uppercase tracking-[0.3em]">K & Q</span>
          </div>
        )}

        {/* Stock badge — top left */}
        {(isLow || isOut) && (
          <div className="absolute top-2 left-2">
            <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-1 rounded-md ${
              isOut
                ? 'bg-red-100 text-red-600 border border-red-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              {isOut ? 'Sold Out' : 'Low Stock'}
            </span>
          </div>
        )}

        {/* Qty indicator — top right (hide when admin controls hover) */}
        {qty > 0 && !isAdmin && (
          <div className="absolute top-2 right-2 animate-in zoom-in duration-200">
            <span className="bg-gold text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              {qty}
            </span>
          </div>
        )}
      </div>

      {/* ── Info + controls ── */}
      <div className="flex flex-col flex-1 p-3 gap-3">
        {/* Name */}
        <div className="flex-1">
          <p className="text-[12px] font-bold text-ink leading-snug line-clamp-2">
            {item.name}
          </p>
          <p className="text-[10px] text-ink-ghost mt-0.5 line-clamp-1 font-medium">
            {item.desc}
          </p>
        </div>

        {/* Price – editable when admin */}
        {isAdmin && editing ? (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <input
              type="number"
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
              className="w-full bg-cream-100 border border-gold rounded-md px-2 py-1 text-sm font-bold text-ink outline-none"
              autoFocus
            />
            <button
              onClick={handleSavePrice}
              className="bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-base font-black text-ink tracking-tight">
            R{item.price}<span className="text-[10px] font-bold text-ink-ghost">.00</span>
          </p>
        )}

        {/* Add / Qty controls – unchanged */}
        <div onClick={e => e.stopPropagation()}>
          {qty === 0 ? (
            <button
              disabled={isOut}
              onClick={() => !isOut && dispatch({ type: 'ADD_ITEM', payload: item })}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 transition-all duration-200 ${
                isOut
                  ? 'border-cream-200 text-ink-ghost cursor-not-allowed bg-cream-100'
                  : 'border-gold text-gold hover:bg-gold hover:text-white active:scale-95'
              }`}
            >
              <FiPlus size={13} strokeWidth={2.5} />
              {isOut ? 'Unavailable' : 'Add to Order'}
            </button>
          ) : (
            <div className="flex items-center justify-between border-2 border-gold rounded-xl overflow-hidden">
              <button
                onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                className="flex items-center justify-center w-10 h-9 text-gold hover:bg-gold/10 active:bg-gold/20 transition-colors"
              >
                {qty === 1
                  ? <FiTrash2 size={13} className="text-ember" />
                  : <FiMinus size={13} strokeWidth={2.5} />
                }
              </button>

              <span className="text-sm font-black text-gold flex-1 text-center">
                {qty}
              </span>

              <button
                onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                className="flex items-center justify-center w-10 h-9 bg-gold text-white hover:bg-gold-dark active:opacity-90 transition-colors"
              >
                <FiPlus size={13} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}