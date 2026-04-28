import { useCart } from '../context/CartContext'

export default function ProductModal({ item, open, onClose }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item?.id)
  const qty = cartItem ? cartItem.qty : 0

  if (!open || !item) return null

  const stockClass =
    item.stock === 'in'
      ? 'bg-green-light text-green-text border-green-border'
      : 'bg-accent-light text-warm-dark border-accent-border'

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-sm rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Price placeholder – larger */}
        <div className="h-40 bg-gray-800 flex items-center justify-center relative">
          <span className="text-5xl font-bold text-accent opacity-20 select-none">
            R{item.price}
          </span>
          <span
            className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full border ${stockClass}`}
          >
            {item.stock === 'in' ? 'In stock' : 'Few left'}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h2 className="text-lg font-medium text-white">{item.name}</h2>
            <p className="text-sm text-text-tertiary mt-0.5">{item.desc}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-medium text-accent">R{item.price}</span>
            {qty === 0 ? (
              <button
                onClick={() => {
                  dispatch({ type: 'ADD_ITEM', payload: item })
                }}
                className="bg-accent text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    dispatch({
                      type: 'CHANGE_QTY',
                      payload: { id: item.id, delta: -1 },
                    })
                  }
                  className="bg-gray-700 border border-subtle w-8 h-8 rounded flex items-center justify-center text-sm"
                >
                  −
                </button>
                <span className="text-sm font-medium text-accent w-6 text-center">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'CHANGE_QTY',
                      payload: { id: item.id, delta: 1 },
                    })
                  }
                  className="bg-gray-700 border border-subtle w-8 h-8 rounded flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full border border-subtle text-text-secondary py-2 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}