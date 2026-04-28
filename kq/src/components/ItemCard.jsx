import { useCart } from '../context/CartContext'

export default function ItemCard({ item, onCardClick }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem?.qty ?? 0

  const stockClass = item.stock === 'in'
    ? 'bg-sage-light text-sage-text border-sage-border'
    : 'bg-gold-light text-gold-dark border-gold-border'

  return (
    <div
      className="bg-white border border-cream-300 rounded-2xl overflow-hidden w-[152px] min-w-[152px] flex-shrink-0 flex flex-col cursor-pointer hover:border-gold-border transition-colors card-lift"
      onClick={() => onCardClick?.(item)}
    >
      {/* Image / price placeholder */}
      <div className="relative h-[96px] bg-cream-200 overflow-hidden">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: item.cat && ['combo','grill','single','side'].includes(item.cat) ? 'center 60%' : 'center' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-3xl font-bold text-gold opacity-20 select-none">
              R{item.price}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border ${stockClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.stock === 'in' ? 'bg-sage' : 'bg-gold'}`} />
            {item.stock === 'in' ? 'In stock' : 'Few left'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-xs font-semibold text-ink leading-tight truncate">{item.name}</p>
          <p className="text-[10px] text-ink-muted leading-snug mt-0.5 line-clamp-2">{item.desc}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-gold" style={{ fontFamily: 'DM Mono, monospace' }}>
            R{item.price}
          </span>

          <div onClick={e => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                className="bg-gold text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-gold-dark transition-colors btn-press"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                  className="w-7 h-7 rounded-lg bg-cream-200 border border-cream-300 text-ink-light flex items-center justify-center text-sm font-medium hover:bg-cream-300 transition-colors btn-press"
                >−</button>
                <span className="text-sm font-semibold text-gold w-4 text-center">{qty}</span>
                <button
                  onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                  className="w-7 h-7 rounded-lg bg-gold text-white flex items-center justify-center text-sm font-medium hover:bg-gold-dark transition-colors btn-press"
                >+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}