import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiShoppingBag, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi'

function formatTimeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const STATUS_CONFIG = {
  received:  { label: 'Order Received', Icon: FiCheckCircle, color: 'text-sage-text bg-sage-light border-sage-border' },
  preparing: { label: 'Preparing',      Icon: FiClock,       color: 'text-gold-dark bg-gold-light border-gold-border' },
  out:       { label: 'Out for Delivery', Icon: FiTruck,     color: 'text-ember bg-ember-light border-ember-border' },
}

function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.received
  const { Icon } = cfg
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border ${cfg.color}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

export default function Orders() {
  const { orders } = usePlacedOrders()
  const reversed = [...orders].reverse()

  return (
    <div className="p-4 pb-24 animate-fade-up">
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-bold text-ink">My Orders</h2>
        <p className="text-sm text-ink-muted mt-1">
          {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
            <FiShoppingBag size={28} className="text-ink-ghost" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-ink-mid">No orders yet</p>
            <p className="text-xs text-ink-ghost mt-1">Place your first order to see it here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reversed.map((o, i) => (
            <div
              key={o.id}
              className="bg-white border border-cream-300 rounded-2xl p-4 fade-up"
              style={{ animationDelay: `${i * 0.05}s`, boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}
            >
              {/* Order header */}
              <div className="flex items-start justify-between mb-2.5">
                <div>
                  <span className="font-mono text-sm font-bold text-ink">#{o.id}</span>
                  <div className="flex items-center gap-1 text-[11px] text-ink-ghost mt-0.5">
                    <FiClock size={10} />
                    <span>{formatTimeAgo(new Date(o.time).getTime())}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={o.status} />
                  <span className="font-mono text-base font-bold text-gold">R{o.total}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs text-ink-mid">{o.customer}</span>
                {o.phone && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-cream-400 inline-block" />
                    <span className="text-xs text-ink-ghost">{o.phone}</span>
                  </>
                )}
              </div>

              {/* Items */}
              <div className="flex flex-wrap gap-1.5">
                {o.items.map(item => (
                  <span
                    key={item.id}
                    className="text-[10px] bg-cream-100 border border-cream-300 text-ink-mid px-2.5 py-1 rounded-full font-medium"
                  >
                    {item.name} ×{item.qty}
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