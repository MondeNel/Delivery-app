import { useCart } from '../context/CartContext'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, dispatch, subtotal } = useCart()

  const getThumbnail = (item) => {
    if (item.img) return item.img
    if (item.cat && ['combo','grill','single','side'].includes(item.cat)) return '/kq-logo.png'
    return null
  }

  const canCheckout = subtotal >= 100

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-sm bg-cream shadow-2xl z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-cream-200">
            <button onClick={onClose} className="text-ink-muted p-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5m7-7-7 7 7 7"/>
              </svg>
            </button>
            <h2 className="font-serif text-lg text-ink">Your Order</h2>
            <div className="w-6" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">Your cart is empty</p>
            ) : (
              items.map(item => {
                const imgSrc = getThumbnail(item)
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-white border border-cream-300 rounded-lg p-3 mb-2">
                    <div className="w-10 h-10 rounded-md bg-cream-200 flex-shrink-0 overflow-hidden">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">{item.name.charAt(0)}</div>
                      )}
                    </div>
                    <span className="text-sm text-ink flex-1">{item.name} <span className="text-ink-muted text-xs">x{item.qty}</span></span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                        className="bg-cream-200 border border-cream-300 w-6 h-6 rounded text-xs btn-press">−</button>
                      <span className="text-xs font-medium text-gold w-4 text-center">{item.qty}</span>
                      <button onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                        className="bg-cream-200 border border-cream-300 w-6 h-6 rounded text-xs btn-press">+</button>
                    </div>
                    <span className="text-sm font-medium text-gold ml-2">R{item.price * item.qty}</span>
                  </div>
                )
              })
            )}
          </div>

          <div className="bg-white m-3 rounded-lg p-4 border border-cream-200">
            <div className="bg-gold-light border border-gold-border rounded-md p-2 text-center text-xs text-gold-dark mb-3">
              Minimum order R100 · Delivery fee R20
            </div>
            <div className="flex justify-between text-sm text-ink-muted mb-1"><span>Subtotal</span><span>R{subtotal}</span></div>
            <div className="flex justify-between text-sm text-ink-muted mb-1"><span>Delivery</span><span>R20</span></div>
            <div className="flex justify-between text-base font-medium text-ink border-t border-cream-200 pt-2 mt-2"><span>Total</span><span className="text-gold">R{subtotal + 20}</span></div>

            <button
              onClick={onCheckout}
              disabled={!canCheckout}
              className={`w-full mt-4 py-3.5 rounded-lg font-semibold text-sm transition-all ${
                canCheckout ? 'bg-gold text-white hover:bg-gold-dark' : 'bg-cream-200 text-ink-muted cursor-not-allowed border border-cream-300'
              }`}
            >
              {canCheckout ? 'Proceed to Checkout' : `Add R${100 - subtotal} more to checkout`}
            </button>
            <p className="text-center text-xs text-ink-muted mt-2">Pay on delivery · Cash accepted</p>
          </div>
        </div>
      </div>
    </>
  )
}