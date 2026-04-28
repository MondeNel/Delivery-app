import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useCart } from '../context/CartContext'
import { useOrder, K_AND_Q_COORDS } from '../context/OrderContext' // Import the coords we defined earlier
import { useProfile } from '../context/ProfileContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiNavigation, FiX, FiMapPin, FiPhone, FiUser, FiInfo } from 'react-icons/fi'
import L from 'leaflet'

// Fix for default Leaflet icon marker issues in React
import 'leaflet/dist/leaflet.css'
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapRecenter({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 16, { animate: true })
  }, [position, map])
  return null
}

function LocationMarker({ position, setPosition, onAddressFound }) {
  useMapEvents({
    async click(e) {
      setPosition(e.latlng)
      fetchAddress(e.latlng.lat, e.latlng.lng, onAddressFound)
    },
  })
  return position ? <Marker position={position} icon={customIcon} /> : null
}

async function fetchAddress(lat, lng, callback) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    const data = await res.json()
    if (data && data.display_name) {
      const parts = data.display_name.split(',')
      const shortAddress = parts.slice(0, 2).join(', ').trim()
      callback(shortAddress)
    }
  } catch (err) { console.error("Address lookup failed", err) }
}

export default function CheckoutModal({ open, onClose }) {
  const { items, subtotal, dispatch } = useCart()
  const { placeOrder } = useOrder()
  const { addOrder } = usePlacedOrders()
  const { profile, updateProfile } = useProfile()

  const [name, setName] = useState(profile.name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [address, setAddress] = useState(profile.address || '')
  const [notes, setNotes] = useState('')
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(newPos)
        setLocating(false)
        fetchAddress(newPos.lat, newPos.lng, (addr) => setAddress(addr))
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    )
  }

  const handlePlaceOrder = () => {
    if (!name || !phone) return alert("Please provide a name and phone number.")
    
    updateProfile({ name, phone, address })
    
    const newOrder = {
      ...placeOrder(),
      customer: name, 
      phone, 
      address: address || 'Pinned Location', 
      notes,
      // Updated default fallback coordinates to Prieska
      lat: position?.lat || K_AND_Q_COORDS.lat, 
      lng: position?.lng || K_AND_Q_COORDS.lng,
      items: [...items], 
      total: subtotal + 20,
      timestamp: new Date().toISOString()
    }
    
    addOrder(newOrder)
    dispatch({ type: 'CLEAR_CART' })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-cream w-full max-h-[95vh] md:max-h-[90vh] md:w-[450px] rounded-t-[3rem] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* Header - Updated to Prieska */}
        <div className="px-8 py-6 bg-white border-b border-cream-200 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink leading-tight">Delivery Info</h2>
            <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mt-1">Kings & Queens · Prieska</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-cream-100 rounded-full flex items-center justify-center text-ink active:scale-90 transition-transform">
            <FiX size={20}/>
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-none">
          <div className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16}/>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full bg-white border-2 border-cream-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-gold transition-colors" />
            </div>
            
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16}/>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-white border-2 border-cream-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-gold transition-colors" />
            </div>

            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={16}/>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="House #, Street name" className="w-full bg-white border-2 border-cream-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          {/* Map - Updated center to Prieska coordinates */}
          <div className="relative h-56 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-cream-100 group">
            <MapContainer center={[K_AND_Q_COORDS.lat, K_AND_Q_COORDS.lng]} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <LocationMarker position={position} setPosition={setPosition} onAddressFound={setAddress} />
              <MapRecenter position={position} />
            </MapContainer>

            <button
              type="button"
              onClick={handleUseMyLocation}
              className="absolute bottom-4 left-4 right-4 z-[1000] bg-ink text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <FiNavigation className={locating ? 'animate-bounce text-gold' : ''} />
              {locating ? 'Finding you...' : 'Pin Current Location'}
            </button>
          </div>

          <div className="relative">
            <FiInfo className="absolute left-4 top-4 text-gold" size={16}/>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Any specific delivery instructions?" 
              className="w-full bg-white border-2 border-cream-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none h-24 resize-none focus:border-gold transition-colors" 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-cream-200 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-[10px] font-black text-ink-ghost uppercase tracking-[0.2em]">Total Estimate</span>
            <span className="text-2xl font-black text-gold">R{subtotal + 20}</span>
          </div>
          <button 
            onClick={handlePlaceOrder} 
            className="w-full bg-gold text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold/20 active:scale-95 hover:bg-gold-dark transition-all"
          >
            Confirm Order
          </button>
          <p className="text-center text-[10px] font-black text-ink-ghost uppercase mt-4 opacity-50">COD · Instant Preparation</p>
        </div>
      </div>
    </div>
  )
}