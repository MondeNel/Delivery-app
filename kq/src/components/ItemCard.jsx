import { useCart } from '../context/CartContext'

export default function ItemCard({ item, onCardClick }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem?.qty ?? 0

  const stockClass = item.stock === 'in'
    ? 'bg-[#E7F3EF] text-[#075E54] border-[#D1E7DD]'
    : 'bg-[#FFF4E5] text-[#663C00] border-[#FFE2B8]'

  return (
    <div
      className="bg-white border border-cream-200 rounded-[1.5rem] overflow-hidden flex flex-col cursor-pointer transition-all hover:border-gold/50 active:scale-[0.98] shadow-sm"
      onClick={() => onCardClick?.(item)}
    >
    {/* Image Area – full product shown, no crop */}
<div className="relative h-28 bg-white overflow-hidden w-full flex items-center justify-center p-2">
  {item.img ? (
    <img
      src={item.img}
      alt={item.name}
      className="max-h-full max-w-full object-contain"
      loading="lazy"
      onError={e => {
        e.target.style.display = 'none'
        e.target.nextElementSibling?.classList.remove('hidden')
      }}
    />
  ) : null}
  {/* Fallback */}
  <div className={`w-full h-full flex items-center justify-center bg-cream-50 ${item.img ? 'hidden' : ''}`}>
    <span className="text-[10px] font-black text-gold/40 uppercase tracking-widest">K & Q</span>
  </div>

  {/* Stock Badge */}
  <div className="absolute top-2 left-2">
    <span className={`flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${stockClass}`}>
      <span className={`w-1 h-1 rounded-full ${item.stock === 'in' ? 'bg-[#075E54]' : 'bg-[#663C00] animate-pulse'}`} />
      {item.stock === 'in' ? 'Ready' : 'Low'}
    </span>
  </div>
</div>

      {/* Info Area */}
      <div className="p-3 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[11px] font-bold text-ink leading-tight truncate">{item.name}</p>
          <p className="text-[9px] text-ink-ghost leading-tight mt-1 line-clamp-1">{item.desc}</p>
        </div>

        <div className="mt-auto pt-2 border-t border-cream-100 flex items-center justify-between">
          <span className="text-xs font-black text-gold">R{item.price}</span>

          <div onClick={e => e.stopPropagation()} className="flex items-center">
            {qty === 0 ? (
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                className="bg-gold text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md shadow-gold/10 active:scale-90 transition-transform"
              >
                +
              </button>
            ) : (
              <div className="flex items-center bg-cream-100 rounded-xl p-0.5 border border-cream-200">
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                  className="w-6 h-6 rounded-lg text-ink font-bold text-xs flex items-center justify-center active:bg-white"
                >−</button>
                <span className="text-[10px] font-black text-gold w-5 text-center">{qty}</span>
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                  className="w-6 h-6 rounded-lg bg-gold text-white font-bold text-xs flex items-center justify-center shadow-sm"
                >+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}