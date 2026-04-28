import { useCart } from '../context/CartContext'

export default function ItemCard({ item, type = 'drink' }) {
  const { items, dispatch } = useCart()
  const cartItem = items.find(i => i.id === item.id)
  const qty = cartItem ? cartItem.qty : 0

  const stockClass = item.stock === 'in' ? 'bg-green-light text-green-text border-green-border' : 'bg-gold-light text-warm-dark border-gold-border'

  const renderImage = () => {
    if (type === 'food') {
      return (
        <div className="h-24 bg-cream overflow-hidden relative">
          <img src="/kq-placeholder.png" alt="" className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            Kings & Queens
          </div>
        </div>
      )
    }
    // drink
    if (!item.img) {
      return <div className="h-24 bg-cream flex items-center justify-center text-xs text-text-tertiary">{item.name}</div>
    }
    return (
      <div className="h-24 bg-cream overflow-hidden relative">
        <img src={item.img} alt={item.name}
          className={`w-full h-full ${item.fit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
          onError={(e) => e.target.style.display = 'none'} />
      </div>
    )
  }

  return (
    <div className="bg-white border border-border-light rounded-lg overflow-hidden hover:border-gold-border transition">
      <div className="relative">
        {renderImage()}
        <span className={`absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full border ${stockClass}`}>
          {item.stock === 'in' ? 'In stock' : 'Few left'}
        </span>
      </div>
      <div className="p-2.5">
        <div className="text-xs font-medium text-text-primary mb-0.5">{item.name}</div>
        <div className="text-[10px] text-text-tertiary mb-2">{item.desc}</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gold">R{item.price}</span>
          {qty === 0 ? (
            <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
              className="bg-gold text-white text-xs px-2.5 py-1 rounded-md">
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                className="bg-cream border border-border-light w-5 h-5 rounded flex items-center justify-center text-sm">−</button>
              <span className="text-xs font-medium text-gold">{qty}</span>
              <button onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                className="bg-cream border border-border-light w-5 h-5 rounded flex items-center justify-center text-sm">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}