import { useCart } from '../context/CartContext'

export default function ItemCard({ item }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem ? cartItem.qty : 0

  const stockClass = item.stock === 'in'
    ? 'bg-green-light text-green-text border-green-border'
    : 'bg-accent-light text-warm-dark border-accent-border'

  return (
    <div className="bg-surface border border-subtle rounded-lg overflow-hidden hover:border-accent-border transition w-[150px] min-w-[150px] flex-shrink-0">
      <div className="relative">
        {/* Price placeholder – exactly like deal card image area */}
        <div className="h-20 bg-gray-800 flex items-center justify-center rounded-t-lg">
          <span className="text-2xl font-bold text-accent opacity-20 select-none">
            R{item.price}
          </span>
        </div>
        <span className={`absolute top-1 left-1 text-[9px] px-1 py-0.5 rounded-full border ${stockClass}`}>
          {item.stock === 'in' ? 'In stock' : 'Few left'}
        </span>
      </div>
      <div className="p-2">
        <div className="text-xs font-medium text-white mb-0.5 truncate">{item.name}</div>
        <div className="text-[9px] text-text-tertiary mb-2 truncate">{item.desc}</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-accent">R{item.price}</span>
          {qty === 0 ? (
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
              className="bg-accent text-white text-[10px] font-medium px-2 py-1 rounded-md min-h-[26px] min-w-[40px]"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                className="bg-gray-700 border border-subtle w-5 h-5 rounded flex items-center justify-center text-xs"
              >−</button>
              <span className="text-xs font-medium text-accent w-4 text-center">{qty}</span>
              <button
                onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                className="bg-gray-700 border border-subtle w-5 h-5 rounded flex items-center justify-center text-xs"
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}