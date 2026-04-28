import { useState, useEffect, useRef } from 'react'
import { useOrder } from '../context/OrderContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiCheckCircle, FiClock, FiTruck, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, CircleMarker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const STAGES = [
  { key: 'received',  label: 'Order Received',   Icon: FiCheckCircle },
  { key: 'preparing', label: 'Preparing Order',   Icon: FiClock },
  { key: 'out',       label: 'Out for Delivery',  Icon: FiTruck },
]

const STORE = { lat: -29.677, lng: 22.745 }

const driverIcon = L.divIcon({
  className: '',
  html: `<div style="background:#B8860B;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 0 0 4px rgba(184,134,11,0.3);">
    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor"><path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32h181.2c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2v128c0 17.7-14.3 32-32 32h-32c0 35.3-28.7 64-64 64s-64-28.7-64-64H224c0 35.3-28.7 64-64 64s-64-28.7-64-64H64c-17.7 0-32-14.3-32-32V256c0-26.7 16.4-49.6 39.6-59.2z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

function lerp(a, b, t) {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t }
}

export default function TrackingBar() {
  const { order } = useOrder()
  const { orders } = usePlacedOrders()
  const [now, setNow] = useState(Date.now())
  const [progress, setProgress] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const DURATION = 10000

  const placedOrder = orders.find(o => o.id === order?.id)
  const customerLoc = placedOrder?.lat && placedOrder?.lng ? { lat: placedOrder.lat, lng: placedOrder.lng } : null

  useEffect(() => {
    if (order?.status === 'out' && customerLoc) {
      startRef.current = Date.now()
      const animate = () => {
        const t = Math.min((Date.now() - startRef.current) / DURATION, 1)
        setProgress(t)
        if (t < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    } else {
      setProgress(0)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [order?.status])

  useEffect(() => {
    if (!order) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [order])

  if (!order) return null

  const stageIdx = STAGES.findIndex(s => s.key === order.status)
  const driverPos = customerLoc ? lerp(STORE, customerLoc, progress) : STORE
  const eta = order.status === 'out' ? `${Math.max(0, Math.ceil((1 - progress) * 10))} min` : '~15 min'

  return (
    <div className="mx-4 mt-3 mb-1 bg-white border border-cream-300 rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>

      {/* Bar header */}
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setCollapsed(c => !c)}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-ink">Tracking — #{order.id}</p>
            <p className="text-[10px] text-ink-ghost">Arriving in {eta}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-gold text-[10px]">
            {order.status === 'out' ? 'On the way!' : order.status === 'preparing' ? 'Preparing' : 'Received'}
          </span>
          {collapsed ? <FiChevronDown size={14} className="text-ink-ghost" /> : <FiChevronUp size={14} className="text-ink-ghost" />}
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Map */}
          <div className="mx-4 mb-3 h-48 rounded-xl overflow-hidden border border-cream-300">
            <MapContainer center={customerLoc || STORE} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={STORE}><Popup>Kings &amp; Queens</Popup></Marker>
              {customerLoc && (
                <>
                  <CircleMarker center={customerLoc} radius={7} color="#B8860B" fillColor="#B8860B" fillOpacity={0.5}><Popup>Your location</Popup></CircleMarker>
                  <Polyline positions={[STORE, customerLoc]} color="#B8860B" dashArray="8 6" weight={2} opacity={0.4} />
                </>
              )}
              {customerLoc && order.status === 'out' && (
                <>
                  <Polyline positions={[STORE, driverPos]} color="#B8860B" weight={3} />
                  <Marker position={driverPos} icon={driverIcon}><Popup>Your driver</Popup></Marker>
                </>
              )}
            </MapContainer>
          </div>

          {/* Steps */}
          <div className="px-4 pb-4 space-y-0">
            {STAGES.map((stage, i) => {
              const { Icon } = stage
              const isCompleted = stageIdx >= i
              const isCurrent = stageIdx === i

              return (
                <div key={stage.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isCompleted ? 'bg-gold border-gold text-white' : 'bg-white border-cream-300 text-ink-ghost'
                    } ${isCurrent ? 'pulse-step' : ''}`}>
                      {isCompleted ? <Icon size={13} /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[20px] my-1 transition-all duration-500 ${
                        isCompleted && stageIdx > i ? 'bg-gold' : 'bg-cream-300'
                      }`} />
                    )}
                  </div>
                  <div className="flex flex-col justify-center pb-4">
                    <span className={`text-xs font-semibold ${isCompleted ? 'text-gold-dark' : 'text-ink-ghost'}`}>
                      {stage.label}
                    </span>
                    {isCurrent && stage.key === 'out' && (
                      <span className="text-[10px] text-ink-ghost mt-0.5">Arriving in {eta}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}