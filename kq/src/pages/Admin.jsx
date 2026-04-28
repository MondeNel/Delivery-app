import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { useOrder } from '../context/OrderContext'
import { FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi'

const statusColors = {
  received:  'bg-sage-light text-sage-text border-sage-border',
  preparing: 'bg-gold-light text-gold-dark border-gold-border',
  out:       'bg-ember-light text-ember border-ember-border',
}

function StatusButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      className={`btn-press text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-default ${
        active ? 'bg-gold-light border-gold-border text-gold-dark' : 'bg-cream-100 border-cream-300 text-ink-mid hover:border-gold-border'
      }`}
    >
      {label}
    </button>
  )
}

export default function Admin() {
  const { orders, updateOrderStatus: updatePlaced } = usePlacedOrders()
  const { updateOrderStatus } = useOrder()

  const handleStatus = (id, status) => {
    updatePlaced(id, status)
    updateOrderStatus(status)
  }

  return (
    <div className="p-4 pb-24 animate-fade-up">
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-bold text-ink">Admin Dashboard</h2>
        <p className="text-xs text-ink-ghost mt-1">Manage and track incoming orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-white border border-cream-300 rounded-2xl p-4" style={{ boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>
          <h3 className="font-serif text-base font-bold text-ink mb-3">Order Map</h3>
          <div className="h-64 rounded-xl overflow-hidden border border-cream-300">
            <MapContainer center={[-29.677, 22.745]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {orders.filter(o => o.lat && o.lng).map(order => (
                <Marker key={order.id} position={[order.lat, order.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <strong>#{order.id}</strong> — {order.customer}<br />
                      <span className="font-mono font-bold text-gold-dark">R{order.total}</span> · {order.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Orders list */}
        <div className="bg-white border border-cream-300 rounded-2xl p-4" style={{ boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-base font-bold text-ink">Recent Orders</h3>
            <span className="badge-gold">{orders.length} total</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {orders.length === 0 && (
              <p className="text-sm text-ink-ghost text-center py-6">No orders yet.</p>
            )}
            {[...orders].reverse().map(o => (
              <div key={o.id} className="border-b border-cream-200 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold text-ink">#{o.id}</span>
                  <span className="font-mono text-sm font-bold text-gold">R{o.total}</span>
                </div>
                <div className="text-[11px] text-ink-ghost mb-2">
                  {o.customer} · {o.phone || 'no phone'} · {o.address}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[o.status] || statusColors.received}`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <StatusButton label="Received" active={o.status === 'received'} onClick={() => handleStatus(o.id, 'received')} />
                  <StatusButton label="Preparing" active={o.status === 'preparing'} onClick={() => handleStatus(o.id, 'preparing')} />
                  <StatusButton label="Out for Delivery" active={o.status === 'out'} onClick={() => handleStatus(o.id, 'out')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}