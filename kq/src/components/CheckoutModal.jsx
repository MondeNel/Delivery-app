import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useCart } from '../context/CartContext'
import { useOrder } from '../context/OrderContext'
import { useProfile } from '../context/ProfileContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })
  return position ? <Marker position={position} /> : null
}

export default function CheckoutModal({ open, onClose }) {
  const { items, subtotal, dispatch } = useCart()
  const { placeOrder, updateOrderStatus } = useOrder()
  const { addOrder } = usePlacedOrders()
  const { profile, updateProfile } = useProfile()

  // Pre‑fill from saved profile, fallback to empty
  const [name, setName] = useState(profile.name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [address, setAddress] = useState(profile.address || '')
  const [notes, setNotes] = useState('')
  const [position, setPosition] = useState(null)
  const [saveDetails, setSaveDetails] = useState(!!profile.name) // ticked if profile exists

  const handlePlaceOrder = () => {
    // Save to profile if checkbox is ticked
    if (saveDetails && (name || phone || address)) {
      updateProfile({ name, phone, address })
    }

    const newOrder = placeOrder()
    const orderData = {
      id: newOrder.id,
      customer: name || 'Guest',
      phone: phone || '',
      address: address || '',
      notes: notes || '',
      lat: position ? position.lat : null,
      lng: position ? position.lng : null,
      items: [...items],
      total: subtotal + 20,
      status: 'received',
      time: new Date().toISOString(),
    }
    addOrder(orderData)
    dispatch({ type: 'CLEAR_CART' })
    onClose()

    // Simulate tracking updates
    setTimeout(() => updateOrderStatus('preparing'), 3000)
    setTimeout(() => updateOrderStatus('out'), 7000)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-full md:w-[440px] md:h-auto md:max-h-[85vh] md:rounded-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light flex-shrink-0">
          <button onClick={onClose} className="text-text-secondary p-1">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
          </button>
          <h2 className="font-serif text-lg text-text-primary">Delivery Details</h2>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Full Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Sipho Mokoena"
              className="w-full bg-cream border border-border-light rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Phone Number</label>
            <input
              type="text" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+27 068 099 5953"
              className="w-full bg-cream border border-border-light rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Street Address</label>
            <input
              type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 12 Market Street, Prieska"
              className="w-full bg-cream border border-border-light rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1 block">
              Drop Pin — Prieska, 8940
            </label>
            <div className="h-40 md:h-40 bg-cream rounded-md overflow-hidden border border-border-light">
              <MapContainer center={[-29.677, 22.745]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wide">Delivery Notes (optional)</label>
            <input
              type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Leave at gate"
              className="w-full bg-cream border border-border-light rounded-md p-2.5 text-sm mt-1 outline-none focus:border-gold"
            />
          </div>

          {/* Save details checkbox */}
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={saveDetails}
              onChange={(e) => setSaveDetails(e.target.checked)}
              className="accent-gold"
            />
            Save my details for next time
          </label>
        </div>

        <div className="p-4 border-t border-border-light flex-shrink-0">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gold text-white py-3.5 rounded-lg font-medium mt-0"
          >
            Place Order — Pay on Delivery
          </button>
        </div>
      </div>
    </div>
  )
}