import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiShoppingBag } from 'react-icons/fi'

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'Just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function Orders() {
  const { orders } = usePlacedOrders()

  return (
    <div className="p-4 pb-20">
      <h2 className="font-serif text-xl text-text-primary mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-sm text-text-tertiary text-center py-8">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="bg-white border border-border-light rounded-lg p-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-text-primary">#{o.id}</span>
                <span className="text-gold font-medium">R{o.total}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-text-tertiary">
                <FiShoppingBag size={12} />
                <span>{o.customer} · {formatTimeAgo(new Date(o.time).getTime())} · {o.status}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {o.items.map(item => (
                  <span key={item.id} className="text-[10px] bg-cream px-2 py-0.5 rounded-full text-text-secondary">
                    {item.name} x{item.qty}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}