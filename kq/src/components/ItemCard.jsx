import { useCart } from '../context/CartContext'

export default function ItemCard({ item, onCardClick }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem?.qty ?? 0

  const stockClass = item.stock === 'in'
    ? 'bg-green-light text-green-text border-green-border'
    : 'bg-accent-light text-warm-dark border-accent-border'

  const add = () => dispatch({ type: 'ADD_ITEM', payload: item })
  const inc = () => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })
  const dec = () => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })

  return (
    <div
      className="bg-surface border border-subtle rounded-xl overflow-hidden w-[152px] min-w-[152px] flex-shrink-0 flex flex-col cursor-pointer hover:border-accent-border transition-colors"
      onClick={() => onCardClick?.(item)}
    >
      {/* Image area */}
      <div className="relative h-[96px] bg-gray-800 overflow-hidden">
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
            <span className="font-serif text-3xl font-bold text-accent opacity-20 select-none">
              R{item.price}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Stock badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border ${stockClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.stock === 'in' ? 'bg-green-text' : 'bg-accent'}`} />
            {item.stock === 'in' ? 'In stock' : 'Few left'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-xs font-semibold text-white leading-tight truncate">{item.name}</p>
          <p className="text-[10px] text-text-tertiary leading-snug mt-0.5 line-clamp-2">{item.desc}</p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-accent" style={{ fontFamily: 'DM Mono, monospace' }}>
            R{item.price}
          </span>

          {/* Prevent card click when interacting with buttons */}
          <div onClick={e => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                onClick={add}
                className="bg-accent text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={dec}
                  className="w-7 h-7 rounded-lg bg-gray-700 border border-subtle text-text-secondary flex items-center justify-center text-sm font-medium hover:bg-gray-600 transition-colors"
                >−</button>
                <span className="text-sm font-semibold text-accent w-4 text-center">{qty}</span>
                <button onClick={inc}
                  className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-medium hover:opacity-90 transition-opacity"
                >+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}