import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { useOrder } from '../context/OrderContext'

export default function Admin() {
  const { orders, updateOrderStatus } = usePlacedOrders()
  const { updateOrderStatus: updateActiveOrderStatus } = useOrder()

  // When admin updates an order's status, also update the active order context
  // so the tracking bar reflects the change for the last placed order.
  const handleStatusChange = (id, newStatus) => {
    updateOrderStatus(id, newStatus)
    // optionally update the active order tracking bar if it matches the order
    updateActiveOrderStatus(newStatus)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-serif text-text-primary mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-border-light rounded-lg p-4">
          <h3 className="font-medium text-text-primary mb-2">Order Map</h3>
          <div className="h-64 rounded-md overflow-hidden border border-border-light">
            <MapContainer center={[-29.677, 22.745]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {orders.filter(o => o.lat && o.lng).map(order => (
                <Marker key={order.id} position={[order.lat, order.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <strong>#{order.id}</strong> - {order.customer}<br />
                      R{order.total} · {order.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        <div className="bg-white border border-border-light rounded-lg p-4">
          <h3 className="font-medium text-text-primary mb-3">Recent Orders</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {orders.slice().reverse().map(o => (
              <div key={o.id} className="border-b border-border-light pb-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">#{o.id}</span>
                  <span className="text-gold font-medium">R{o.total}</span>
                </div>
                <div className="text-text-tertiary text-xs mt-0.5">
                  {o.customer} · {o.phone || 'no phone'} · {o.status}
                </div>
                <div className="flex gap-2 mt-1.5">
                  {o.status !== 'received' && (
                    <button
                      onClick={() => handleStatusChange(o.id, 'received')}
                      className="text-xs px-2 py-0.5 rounded border border-gold-border text-warm-dark bg-gold-light hover:bg-gold-light/80"
                    >
                      Mark Received
                    </button>
                  )}
                  {o.status !== 'preparing' && (
                    <button
                      onClick={() => handleStatusChange(o.id, 'preparing')}
                      className="text-xs px-2 py-0.5 rounded border border-gold-border text-warm-dark bg-gold-light hover:bg-gold-light/80"
                    >
                      Mark Preparing
                    </button>
                  )}
                  {o.status !== 'out' && (
                    <button
                      onClick={() => handleStatusChange(o.id, 'out')}
                      className="text-xs px-2 py-0.5 rounded border border-gold-border text-warm-dark bg-gold-light hover:bg-gold-light/80"
                    >
                      Out for Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-4">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}