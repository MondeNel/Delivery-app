import { useCart } from '../context/CartContext'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'

export default function ProductModal({ item, open, onClose }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item?.id)
  const qty = cartItem ? cartItem.qty : 0

  if (!open || !item) return null

  const stockClass = item.stock === 'in'
    ? 'bg-[#E7F3EF] text-[#075E54] border-[#D1E7DD]'
    : 'bg-[#FFF4E5] text-[#663C00] border-[#FFE2B8]'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl transform animate-in slide-in-from-bottom duration-500">
        {/* Image / Header Section */}
        <div className="h-64 bg-cream-100 relative flex items-center justify-center">
          {item.img ? (
            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-black text-gold/10 uppercase tracking-tighter select-none">
              K&Q
            </span>
          )}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-ink active:scale-90 transition-transform"
          >
            <FiX size={20} />
          </button>
          
          <div className="absolute bottom-6 left-6">
             <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 shadow-sm ${stockClass}`}>
                <span className={`w-2 h-2 rounded-full ${item.stock === 'in' ? 'bg-[#075E54]' : 'bg-[#663C00] animate-pulse'}`} />
                {item.stock === 'in' ? 'Available Now' : 'Limited Stock'}
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-ink leading-tight">{item.name}</h2>
              <span className="text-2xl font-black text-gold">R{item.price}</span>
            </div>
            <p className="text-sm text-ink-ghost leading-relaxed">{item.desc}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-cream-200">
            {qty === 0 ? (
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                className="flex-1 bg-gold text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-[0.98] transition-all"
              >
                Add to Order
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-cream-100 rounded-2xl p-2 border border-cream-200">
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                  className="w-12 h-12 rounded-xl bg-white shadow-sm text-ink flex items-center justify-center active:scale-90 transition-all"
                >
                  <FiMinus />
                </button>
                <div className="text-center">
                  <p className="text-[10px] font-black text-ink-ghost uppercase">Quantity</p>
                  <p className="text-lg font-black text-gold">{qty}</p>
                </div>
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                  className="w-12 h-12 rounded-xl bg-gold text-white shadow-lg shadow-gold/20 flex items-center justify-center active:scale-90 transition-all"
                >
                  <FiPlus />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}