import { useState, useEffect } from 'react'
import { useOrder } from '../context/OrderContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiCheckCircle, FiClock, FiTruck, FiShoppingBag } from 'react-icons/fi'

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

const STAGES = [
  { key: 'received', label: 'Order Received', icon: FiCheckCircle },
  { key: 'preparing', label: 'Preparing', icon: FiClock },
  { key: 'out', label: 'Out for Delivery', icon: FiTruck },
]

export default function Orders() {
  const { order } = useOrder()
  const { orders } = usePlacedOrders()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!order || order.status === 'out') return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [order])

  const elapsed = order ? now - order.time : 0

  const getCountdown = (stageKey) => {
    if (!order || order.status === stageKey || order.status === 'out') return null
    const durations = { received: 3000, preparing: 7000 }
    const remaining = durations[order.status] ? durations[order.status] - elapsed : 0
    if (remaining <= 0) return null
    const sec = Math.ceil(remaining / 1000)
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="font-serif text-xl text-text-primary mb-4">My Orders</h2>

      {/* Live order – vertical timeline */}
      {order && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
            Live Order — #{order.id}
          </h3>
          <div className="bg-white border border-border-light rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs text-text-tertiary">
                Expected arrival: {order.status === 'out' ? '~10 min' : '~15 min'}
              </div>
              <span className="text-[10px] text-gold font-medium bg-gold-light px-2 py-0.5 rounded-full">
                {order.status === 'out' ? 'On the way!' : 'Preparing'}
              </span>
            </div>

            <div className="space-y-0">
              {STAGES.map((stage, i) => {
                const Icon = stage.icon
                const isCompleted = STAGES.findIndex(s => s.key === order.status) >= i
                const isCurrent = STAGES.findIndex(s => s.key === order.status) === i
                const countdown = isCurrent ? getCountdown(stage.key) : null

                return (
                  <div key={stage.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-gold border-gold text-white'
                            : 'bg-white border-border-light text-text-tertiary'
                        }`}
                      >
                        {isCompleted ? <Icon size={14} /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      {i < STAGES.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[24px] my-1 ${
                            isCompleted && i < STAGES.findIndex(s => s.key === order.status)
                              ? 'bg-gold'
                              : 'bg-border-light'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center pb-4">
                      <span className={`text-xs font-medium ${isCompleted ? 'text-gold' : 'text-text-tertiary'}`}>
                        {stage.label}
                      </span>
                      {countdown && (
                        <span className="text-[10px] text-text-tertiary">in {countdown}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Past orders */}
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Past Orders
      </h3>
      {orders.length === 0 ? (
        <p className="text-sm text-text-tertiary text-center py-8">No past orders yet</p>
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