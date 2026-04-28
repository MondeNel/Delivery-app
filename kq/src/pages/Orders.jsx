import { useOrder } from '../context/OrderContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'

export default function Orders() {
  const { order } = useOrder()
  const { orders } = usePlacedOrders()

  return (
    <div className="p-4 pb-20">
      <h2 className="font-serif text-xl text-text-primary mb-4">My Orders</h2>

      {/* Active order tracking */}
      {order && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
            Live Order — #{order.id}
          </h3>
          <div className="bg-white border border-border-light rounded-lg p-4">
            <div className="flex items-center">
              {[
                { label: 'Received', done: order.status !== 'placed' },
                { label: 'Preparing', done: order.status === 'preparing' || order.status === 'out' },
                { label: 'Out for delivery', done: order.status === 'out' },
              ].map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs mb-1 ${
                      step.done
                        ? 'bg-gold border-gold text-white'
                        : 'bg-white border-border-light text-text-tertiary'
                    }`}
                  >
                    {step.done ? '✓' : i + 1}
                  </div>
                  {i < 2 && (
                    <div
                      className={`h-0.5 w-full mb-4 ${
                        i <
                        (order.status === 'out' ? 2 : order.status === 'preparing' ? 1 : 0)
                          ? 'bg-gold'
                          : 'bg-border-light'
                      }`}
                    />
                  )}
                  <div
                    className={`text-[10px] ${
                      step.done ? 'text-gold font-medium' : 'text-text-tertiary'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
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
            <div
              key={o.id}
              className="bg-white border border-border-light rounded-lg p-4"
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-text-primary">#{o.id}</span>
                <span className="text-gold font-medium">R{o.total}</span>
              </div>
              <div className="text-xs text-text-tertiary">
                {o.customer} · {o.time ? new Date(o.time).toLocaleDateString() : ''} · {o.status}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {o.items.map(item => (
                  <span
                    key={item.id}
                    className="text-[10px] bg-cream px-2 py-0.5 rounded-full text-text-secondary"
                  >
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