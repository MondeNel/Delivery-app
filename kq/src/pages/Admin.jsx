import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { useOrder, K_AND_Q_COORDS } from '../context/OrderContext'
import { FiTruck, FiPhone, FaWhatsapp, FiChevronLeft, FiEdit3 } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Distance helper ──
function haversineKm(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))
}

// ── Custom marker icons ──
const storeIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34], shadowSize: [41,41]
})
const customerIcon = L.divIcon({
  className: '',
  html: `<div style="background:#B8860B;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(184,134,11,0.4)"></div>`,
  iconSize: [18,18], iconAnchor: [9,9]
})

export default function Admin() {
  const { orders, completedOrders, updateOrder, completeOrder } = usePlacedOrders()
  const { markOutForDelivery } = useOrder()
  const [tab, setTab] = useState('orders')  // 'orders' | 'prices'
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showMap, setShowMap] = useState(false)

  // Filter only active orders (not completed)
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'completed')
  }, [orders])

  // Sort by distance from store
  const sortedOrders = useMemo(() => {
    return [...activeOrders].sort((a, b) => {
      const distA = a.lat && a.lng ? haversineKm(K_AND_Q_COORDS, { lat: a.lat, lng: a.lng }) : 9999
      const distB = b.lat && b.lng ? haversineKm(K_AND_Q_COORDS, { lat: b.lat, lng: b.lng }) : 9999
      return distA - distB
    })
  }, [activeOrders])

  // Handlers
  const handleStartDelivery = (order) => {
    updateOrder(order.id, { status: 'out' })          // mark placed order
    markOutForDelivery()                                // triggers user's tracking animation
    setSelectedOrder(order)
    setShowMap(true)
  }

  const handleCompleteDelivery = (orderId) => {
    completeOrder(orderId)                              // moves to completed list
    // if it was the current displayed order, clear map
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null)
      setShowMap(false)
    }
  }

  return (
    <div className="p-4 pb-20">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {['orders', 'prices'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
              tab === t ? 'bg-gold text-white' : 'bg-cream-200 text-ink-muted'
            }`}
          >
            {t === 'orders' ? 'Orders' : 'Prices'}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <>
          <h2 className="font-serif text-xl font-bold text-ink mb-4">
            Active Orders ({sortedOrders.length})
          </h2>
          {sortedOrders.length === 0 ? (
            <p className="text-ink-muted text-sm">No active orders at the moment.</p>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map(order => {
                const dist = order.lat && order.lng
                  ? haversineKm(K_AND_Q_COORDS, { lat: order.lat, lng: order.lng }).toFixed(1)
                  : '?'
                return (
                  <div key={order.id} className="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-ink">#{order.id}</span>
                      <span className="text-gold font-bold">R{order.total}</span>
                    </div>
                    <div className="text-xs text-ink-muted mb-2">
                      {order.customer} · {order.phone} · {dist} km
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {order.items.map(item => (
                        <span key={item.id} className="text-[10px] bg-cream-100 px-2 py-0.5 rounded-full">
                          {item.name} x{item.qty}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'out' ? (
                        <button
                          onClick={() => handleCompleteDelivery(order.id)}
                          className="flex-1 bg-emerald-500 text-white text-[11px] font-bold py-2 rounded-xl"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartDelivery(order)}
                          className="flex-1 bg-gold text-white text-[11px] font-bold py-2 rounded-xl"
                        >
                          On My Way
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedOrder(order); setShowMap(true) }}
                        className="w-10 h-10 bg-cream-200 rounded-xl flex items-center justify-center"
                      >
                        <FiTruck size={14} className="text-ink" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Map Modal */}
          {showMap && selectedOrder && (
            <div className="fixed inset-0 z-[2000] bg-black flex flex-col">
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-4 left-4 z-[3000] w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
              >
                <FiChevronLeft size={20} />
              </button>

              <div className="flex-1">
                <MapContainer
                  center={[selectedOrder.lat || K_AND_Q_COORDS.lat, selectedOrder.lng || K_AND_Q_COORDS.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[K_AND_Q_COORDS.lat, K_AND_Q_COORDS.lng]} icon={storeIcon} />
                  {selectedOrder.lat && selectedOrder.lng && (
                    <Marker position={[selectedOrder.lat, selectedOrder.lng]} icon={customerIcon} />
                  )}
                </MapContainer>
              </div>

              {/* Customer info bottom sheet */}
              <div className="bg-white p-6 rounded-t-[2rem]">
                <h3 className="font-bold text-ink">{selectedOrder.customer}</h3>
                <p className="text-ink-muted text-sm">{selectedOrder.phone}</p>
                <p className="text-ink-muted text-sm">{selectedOrder.address}</p>
                <div className="flex gap-3 mt-4">
                  <a href={`tel:${selectedOrder.phone}`} className="flex-1 bg-gold text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    <FiPhone size={16} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedOrder.customer)}%2C%20Kings%20%26%20Queens%20delivery`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                </div>
                {selectedOrder.status === 'out' && (
                  <button
                    onClick={() => handleCompleteDelivery(selectedOrder.id)}
                    className="w-full mt-3 bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold"
                  >
                    Done — Complete Delivery
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Completed Orders History */}
          {completedOrders.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-lg font-bold text-ink mb-3">Completed ({completedOrders.length})</h2>
              <div className="space-y-2">
                {completedOrders.slice(0, 10).map(order => (
                  <div key={order.id} className="bg-cream-100 rounded-xl p-3 text-xs text-ink-muted flex justify-between">
                    <span>#{order.id} – {order.customer}</span>
                    <span>R{order.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'prices' && <PriceManager />}
    </div>
  )
}

// ── Price Manager Component ──────────────────────────────────
function PriceManager() {
  // This will read from ProductsContext
  const { drinks, foods, updateItem } = useProducts()
  const [editId, setEditId] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  const startEdit = (item) => {
    setEditId(item.id)
    setNewPrice(item.price)
  }

  const savePrice = (id, type) => {
    if (!isNaN(newPrice) && newPrice > 0) {
      updateItem(id, type, { price: Number(newPrice) })
      setEditId(null)
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Adjust Prices</h2>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-ink mb-2">Drinks</h3>
        <div className="space-y-2">
          {drinks.map(d => (
            <div key={d.id} className="flex items-center bg-white rounded-xl p-3 border border-cream-200">
              <div className="flex-1 text-xs font-medium">{d.name}</div>
              {editId === d.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-16 text-xs bg-cream-100 border border-cream-300 rounded px-2 py-1 text-center"
                  />
                  <button onClick={() => savePrice(d.id, 'drink')} className="text-[10px] bg-gold text-white px-2 py-1 rounded font-bold">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gold">R{d.price}</span>
                  <button onClick={() => startEdit(d)} className="text-xs text-ink-muted">
                    <FiEdit3 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-ink mb-2">Food</h3>
        <div className="space-y-2">
          {foods.map(f => (
            <div key={f.id} className="flex items-center bg-white rounded-xl p-3 border border-cream-200">
              <div className="flex-1 text-xs font-medium">{f.name}</div>
              {editId === f.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-16 text-xs bg-cream-100 border border-cream-300 rounded px-2 py-1 text-center"
                  />
                  <button onClick={() => savePrice(f.id, 'food')} className="text-[10px] bg-gold text-white px-2 py-1 rounded font-bold">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gold">R{f.price}</span>
                  <button onClick={() => startEdit(f)} className="text-xs text-ink-muted">
                    <FiEdit3 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}