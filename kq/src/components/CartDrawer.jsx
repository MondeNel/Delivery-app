import { useCart } from '../context/CartContext'
import { FiArrowLeft, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, dispatch, subtotal } = useCart()
  const canCheckout = subtotal >= 100

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#FAF9F6] shadow-2xl z-[70] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white px-6 py-6 flex items-center justify-between border-b border-cream-200">
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-ink active:scale-90 transition-all">
              <FiArrowLeft size={20} />
            </button>
            <h2 className="font-serif text-xl font-bold text-ink">My Bucket</h2>
            <div className="w-10" />
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center text-3xl">🛒</div>
                <p className="text-sm font-bold text-ink-ghost uppercase tracking-widest">Your bucket is empty</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-white border border-cream-200 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-right-4">
                  <div className="w-14 h-14 rounded-xl bg-cream-100 flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-gold/30">
                    {item.img ? <img src={item.img} className="w-full h-full object-cover" /> : 'K&Q'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                    <p className="text-xs font-black text-gold mt-1">R{item.price * item.qty}</p>
                  </div>

                  <div className="flex items-center bg-cream-50 rounded-lg border border-cream-200 p-1">
                    <button 
                      onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: -1 } })}
                      className="w-7 h-7 flex items-center justify-center text-ink-ghost hover:text-ink"
                    >
                      {item.qty === 1 ? <FiTrash2 size={14} className="text-ember" /> : <FiMinus size={14} />}
                    </button>
                    <span className="text-xs font-black text-ink w-6 text-center">{item.qty}</span>
                    <button 
                      onClick={() => dispatch({ type: 'CHANGE_QTY', payload: { id: item.id, delta: 1 } })}
                      className="w-7 h-7 flex items-center justify-center text-gold"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section */}
          <div className="bg-white p-6 border-t border-cream-200 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
            <div className="space-y-3 mb-6">
              {!canCheckout && (
                <div className="bg-ember/5 border border-ember/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-black text-ember uppercase tracking-wider">
                    Add R{100 - subtotal} more for delivery
                  </p>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-ink-ghost uppercase tracking-tighter">
                <span>Subtotal</span>
                <span>R{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-ink-ghost uppercase tracking-tighter">
                <span>Delivery Fee</span>
                <span>R20</span>
              </div>
              <div className="flex justify-between items-end pt-3 border-t border-dashed border-cream-200">
                <span className="text-sm font-black text-ink uppercase">Total Due</span>
                <span className="text-2xl font-black text-gold leading-none">R{subtotal + 20}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              disabled={!canCheckout}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                canCheckout 
                  ? 'bg-ink text-white shadow-xl shadow-ink/20 active:scale-[0.98]' 
                  : 'bg-cream-200 text-ink-ghost cursor-not-allowed'
              }`}
            >
              {canCheckout ? 'Checkout Now' : 'Below Minimum'}
            </button>
            <p className="text-center text-[10px] font-black text-ink-ghost uppercase tracking-widest mt-4">
               Pay on Arrival · Cash or Card
            </p>
          </div>
        </div>
      </div>
    </>
  )
}