import { useState, useEffect, useRef } from 'react'
import { useOrder } from '../context/OrderContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const STAGES = [
  { key: 'received', label: 'Order Received', icon: FiCheckCircle },
  { key: 'preparing', label: 'Preparing', icon: FiClock },
  { key: 'out', label: 'Out for Delivery', icon: FiTruck },
]

const STORE_LOCATION = { lat: -29.677, lng: 22.745 }

// car icon with magenta
const carIcon = L.divIcon({
  className: '',
  html: `<div style="background:#E91E63;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 0 0 4px rgba(233,30,99,0.4);">
    <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor"><path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32h181.2c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2v128c0 17.7-14.3 32-32 32h-32c0 35.3-28.7 64-64 64s-64-28.7-64-64H224c0 35.3-28.7 64-64 64s-64-28.7-64-64H64c-17.7 0-32-14.3-32-32V256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 100-64 32 32 0 100 64zm288-32a32 32 0 10-64 0 32 32 0 1064 0z"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

function interpolate(a, b, t) {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  }
}

function calculateDistance(a, b) {
  if (!a || !b) return 0
  const R = 6371
  const dLat = (b.lat - a.lat) * (Math.PI / 180)
  const dLng = (b.lng - a.lng) * (Math.PI / 180)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(a.lat * (Math.PI / 180)) * Math.cos(b.lat * (Math.PI / 180)) * sinLng * sinLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

export default function TrackingBar() {
  const { order } = useOrder()
  const { orders } = usePlacedOrders()
  const [now, setNow] = useState(Date.now())
  const [driverProgress, setDriverProgress] = useState(0)
  const animationFrame = useRef(null)
  const startTime = useRef(null)
  const duration = 10000

  const placedOrder = orders.find(o => o.id === order?.id)
  const customerLocation = placedOrder?.lat && placedOrder?.lng
    ? { lat: placedOrder.lat, lng: placedOrder.lng }
    : null

  useEffect(() => {
    if (order?.status === 'out' && customerLocation) {
      startTime.current = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime.current
        const prog = Math.min(elapsed / duration, 1)
        setDriverProgress(prog)
        if (prog < 1) {
          animationFrame.current = requestAnimationFrame(animate)
        }
      }
      animationFrame.current = requestAnimationFrame(animate)
    } else {
      setDriverProgress(0)
    }
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [order?.status, customerLocation])

  useEffect(() => {
    if (!order) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [order])

  if (!order) return null

  const elapsed = now - order.time
  const currentStage = order.status

  const expectedArrival = currentStage === 'out'
    ? `${Math.max(0, Math.ceil((1 - driverProgress) * 10))} min`
    : '~15 min'

  const getCountdown = (stageKey) => {
    if (currentStage === stageKey || currentStage === 'out') return null
    const durations = { received: 5000, preparing: 15000 }
    const remaining = durations[currentStage] ? durations[currentStage] - elapsed : 0
    if (remaining <= 0) return null
    const sec = Math.ceil(remaining / 1000)
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`
  }

  const driverPos = customerLocation
    ? interpolate(STORE_LOCATION, customerLocation, driverProgress)
    : STORE_LOCATION

  const routePoints = customerLocation ? [STORE_LOCATION, customerLocation] : []
  const traveledPoints = customerLocation ? [STORE_LOCATION, driverPos] : []
  const distance = customerLocation ? calculateDistance(STORE_LOCATION, customerLocation) : 0

  return (
    <div className="mx-4 mt-3 mb-4 bg-surface border border-subtle rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
            Live order tracking — #{order.id}
          </div>
          <div className="text-[10px] text-text-tertiary">
            {currentStage === 'out'
              ? `Driver arriving in ${expectedArrival}`
              : `Expected arrival: ${expectedArrival}`}
          </div>
          {customerLocation && currentStage === 'out' && (
            <div className="text-[10px] text-text-tertiary">
              Distance: {distance.toFixed(1)} km
            </div>
          )}
        </div>
        <span className="text-[10px] text-accent font-medium bg-accent-light px-2 py-0.5 rounded-full">
          {currentStage === 'out' ? 'On the way!' : 'Preparing'}
        </span>
      </div>

      <div className="mb-3 rounded-md overflow-hidden border border-subtle h-56">
        <MapContainer
          center={customerLocation || STORE_LOCATION}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={STORE_LOCATION}>
            <Popup>Kings &amp; Queens</Popup>
          </Marker>

          {customerLocation && (
            <CircleMarker
              center={customerLocation}
              radius={6}
              color="#E91E63"
              fillColor="#E91E63"
              fillOpacity={0.6}
            >
              <Popup>Your location</Popup>
            </CircleMarker>
          )}

          {routePoints.length === 2 && (
            <Polyline
              positions={routePoints}
              color="#E91E63"
              dashArray="8 6"
              weight={3}
              opacity={0.5}
            />
          )}

          {traveledPoints.length === 2 && currentStage === 'out' && (
            <Polyline
              positions={traveledPoints}
              color="#E91E63"
              weight={4}
            />
          )}

          {currentStage === 'out' && (
            <Marker position={driverPos} icon={carIcon}>
              <Popup>Your driver</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="space-y-0">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon
          const isCompleted = STAGES.findIndex(s => s.key === currentStage) >= i
          const isCurrent = STAGES.findIndex(s => s.key === currentStage) === i
          const countdown = isCurrent ? getCountdown(stage.key) : null

          return (
            <div key={stage.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-accent border-accent text-white'
                      : 'bg-surface border-subtle text-text-tertiary'
                  } ${isCurrent ? 'pulse-step' : ''}`}
                >
                  {isCompleted ? <Icon size={14} /> : <span className="text-xs">{i + 1}</span>}
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[24px] my-1 ${
                      isCompleted && i < STAGES.findIndex(s => s.key === currentStage)
                        ? 'bg-accent'
                        : 'bg-subtle'
                    }`}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center pb-4">
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? 'text-accent' : 'text-text-tertiary'
                  }`}
                >
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
  )
}