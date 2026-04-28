import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useOrder } from '../context/OrderContext'

// Mock placed orders (in real app, they'd come from a backend)
const mockOrders = [
  { id: 'KQ-1001', lat: -29.675, lng: 22.742, customer: 'Sipho', total: 142, status: 'received' },
  { id: 'KQ-1002', lat: -29.680, lng: 22.750, customer: 'Thandi', total: 220, status: 'preparing' },
]

export default function Admin() {
  // Local state could be expanded to add new orders for demo
  const [orders, setOrders] = useState(mockOrders)

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
              {orders.map(order => (
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
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o.id} className="border-b pb-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">#{o.id}</span>
                  <span className="text-gold">R{o.total}</span>
                </div>
                <div className="text-text-tertiary text-xs">{o.customer} · {o.status}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-gold text-white py-2 rounded-lg text-sm font-medium">
            Refresh Orders
          </button>
        </div>
      </div>
    </div>
  )
}