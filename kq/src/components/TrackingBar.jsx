import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useOrder } from '../context/OrderContext'
import { usePlacedOrders } from '../context/PlacedOrdersContext'
import { FiCheck, FiClock, FiTruck } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Icons ────────────────────────────────────────────────────
const carIcon = L.divIcon({
  className: '',
  html: `<div style="background:#B8860B;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 0 0 4px rgba(184,134,11,0.4);">
    <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32h181.2c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2v128c0 17.7-14.3 32-32 32h-32c0 35.3-28.7 64-64 64s-64-28.7-64-64H224c0 35.3-28.7 64-64 64s-64-28.7-64-64H64c-17.7 0-32-14.3-32-32V256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 100-64 32 32 0 100 64zm288-32a32 32 0 10-64 0 32 32 0 1064 0z"/></svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

const storeIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const customerDot = L.divIcon({
  className: '',
  html: `<div style="background:#B8860B;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(184,134,11,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// ── Keep map viewport centred on moving car ───────────────────
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (!map || !center) return
    map.invalidateSize()
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

// ── Haversine distance (km) between two [lat,lng] arrays ──────
function distLL(a, b) {
  const R = 6371
  const dLat = (b[0] - a[0]) * Math.PI / 180
  const dLng = (b[1] - a[1]) * Math.PI / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

// ── Walk t ∈ [0,1] along an array of [lat,lng] waypoints ─────
function interpolateRoute(route, t) {
  if (!route || route.length < 2) return route?.[0] ?? [0, 0]
  if (t >= 1) return route[route.length - 1]
  if (t <= 0) return route[0]

  // Pre-compute cumulative distances
  const dists = [0]
  for (let i = 1; i < route.length; i++) {
    dists.push(dists[i - 1] + distLL(route[i - 1], route[i]))
  }
  const total = dists[dists.length - 1]
  const target = t * total

  for (let i = 1; i < dists.length; i++) {
    if (target <= dists[i]) {
      const segLen = dists[i] - dists[i - 1]
      const segT = segLen > 0 ? (target - dists[i - 1]) / segLen : 0
      const s = route[i - 1]
      const e = route[i]
      return [
        s[0] + (e[0] - s[0]) * segT,
        s[1] + (e[1] - s[1]) * segT,
      ]
    }
  }
  return route[route.length - 1]
}

// ── Fetch real driving route via OSRM demo server ─────────────
async function fetchRoute(start, end) {
  // start / end are { lat, lng } objects
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    `?overview=full&geometries=geojson`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    if (data.code === 'Ok' && data.routes.length > 0) {
      // GeoJSON coords are [lng, lat] → flip to [lat, lng] for Leaflet
      const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
      const durationSec = data.routes[0].duration   // seconds
      return { coords, durationSec }
    }
  } catch (_) {
    // OSRM timed-out or was blocked – fall back to straight line
  }

  // Straight-line fallback with synthetic mid-points for a smoother look
  const mid1 = [
    start.lat + (end.lat - start.lat) * 0.33,
    start.lng + (end.lng - start.lng) * 0.33,
  ]
  const mid2 = [
    start.lat + (end.lat - start.lat) * 0.66,
    start.lng + (end.lng - start.lng) * 0.66,
  ]
  const coords = [
    [start.lat, start.lng],
    mid1,
    mid2,
    [end.lat, end.lng],
  ]
  // Estimate at typical delivery speed ~20 km/h
  const distKm = distLL([start.lat, start.lng], [end.lat, end.lng])
  const durationSec = (distKm / 20) * 3600
  return { coords, durationSec }
}

// ── Format seconds → human-readable ETA string ───────────────
function formatEta(secondsRemaining) {
  if (secondsRemaining <= 0) return 'Arriving now'
  const mins = Math.ceil(secondsRemaining / 60)
  if (mins === 1) return '~1 min away'
  if (mins < 60) return `~${mins} mins away`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  return `~${hrs}h ${rem}m away`
}

// ── Stages ─────────────────────────────────────────────────────
const STAGES = [
  { key: 'received',  label: 'Order Received',   icon: FiCheck },
  { key: 'preparing', label: 'Preparing Order',   icon: FiClock },
  { key: 'out',       label: 'Out for Delivery',  icon: FiTruck },
]

// Simulation duration for the map animation (ms).
// Keep it cinematic for a demo; real apps would use actual GPS.
const ANIM_DURATION_MS = 30_000  // 30 seconds

// ── Component ──────────────────────────────────────────────────
export default function TrackingBar() {
  const { orderStatus } = useOrder()
  const { orders }      = usePlacedOrders()

  // route state
  const [route,       setRoute]       = useState([])       // [lat,lng][]
  const [routeReady,  setRouteReady]  = useState(false)
  const [realDurSec,  setRealDurSec]  = useState(null)     // from OSRM or estimate

  // animation state
  const [progress,    setProgress]    = useState(0)         // 0 → 1
  const animRef  = useRef(null)
  const startRef = useRef(null)        // timestamp when animation began

  // Business location
  const businessLoc = useMemo(() => ({ lat: -29.6644, lng: 22.7483 }), [])

  // Most-recent placed order
  const activeOrder = useMemo(() => {
    if (!orders.length || !orderStatus) return null
    return orders[orders.length - 1]
  }, [orders, orderStatus])

  const dest = useMemo(() => ({
    lat: activeOrder?.lat ?? -29.6700,
    lng: activeOrder?.lng ?? 22.7430,
  }), [activeOrder])

  // ── Fetch route whenever status becomes 'out' ──────────────
  useEffect(() => {
    if (orderStatus !== 'out') {
      setRoute([])
      setRouteReady(false)
      setRealDurSec(null)
      setProgress(0)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }

    let cancelled = false
    fetchRoute(businessLoc, dest).then(({ coords, durationSec }) => {
      if (cancelled) return
      setRoute(coords)
      setRealDurSec(durationSec)
      setRouteReady(true)
    })
    return () => { cancelled = true }
  }, [orderStatus, businessLoc, dest])

  // ── Animate car once route is ready ───────────────────────
  useEffect(() => {
    if (!routeReady || route.length < 2) return

    if (animRef.current) cancelAnimationFrame(animRef.current)
    startRef.current = null   // will be set on first frame

    const tick = (now) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / ANIM_DURATION_MS, 1)
      setProgress(t)
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [routeReady, route])

  // ── Compute current car position (always, before any return) ─
  const carPos =
    orderStatus === 'out' && route.length > 0
      ? interpolateRoute(route, progress)
      : [businessLoc.lat, businessLoc.lng]

  // ── Build the "traveled so far" portion of the route ──────
  // Must be declared before any early return to satisfy Rules of Hooks
  const traveledPath = useMemo(() => {
    if (route.length < 2 || orderStatus !== 'out') return []
    const path = []
    const total = route.reduce(
      (sum, p, i) => i > 0 ? sum + distLL(route[i - 1], p) : 0,
      0
    )
    let accum = 0
    for (let i = 0; i < route.length - 1; i++) {
      path.push(route[i])
      const seg = distLL(route[i], route[i + 1])
      if (progress * total <= accum + seg) break
      accum += seg
    }
    path.push(carPos)
    return path
  }, [route, progress, orderStatus, carPos])

  // ── ETA calculation ───────────────────────────────────────
  const etaText = useMemo(() => {
    if (orderStatus !== 'out' || !realDurSec) return null
    const remainingFraction = 1 - progress
    const remainingSec      = remainingFraction * realDurSec
    return formatEta(remainingSec)
  }, [orderStatus, realDurSec, progress])

  // ── Map center: follow car when out for delivery ──────────
  const mapCenter = carPos
  const mapZoom   = orderStatus === 'out' ? 16 : 15

  // Don't render if there's nothing to show (AFTER all hooks)
  if (!orderStatus || !activeOrder) return null

  const currentStageIndex = STAGES.findIndex(s => s.key === orderStatus)

  return (
    <div className="mx-4 my-6 bg-white rounded-[2.5rem] border border-cream-200 p-8 shadow-2xl animate-in fade-in zoom-in duration-500">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-black text-ink tracking-tight">
            Order #{activeOrder.id}
          </h3>
          <p className="text-xs font-bold text-gold uppercase tracking-widest mt-1">
            {orderStatus === 'out' ? 'On the way to you' : 'Chef is on it'}
          </p>
        </div>
        <div className="bg-ink text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
          Live Status
        </div>
      </div>

      {/* ── Map ── */}
      <div className="h-80 w-full rounded-[2.5rem] overflow-hidden border-2 border-cream-100 mb-10 relative bg-[#f8f9fa] shadow-inner">
        <MapContainer
          center={[businessLoc.lat, businessLoc.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Store origin */}
          <Marker position={[businessLoc.lat, businessLoc.lng]} icon={storeIcon} />

          {/* Customer destination */}
          <Marker position={[dest.lat, dest.lng]} icon={customerDot} />

          {/* Full route (faint) */}
          {route.length > 1 && orderStatus === 'out' && (
            <Polyline
              positions={route}
              color="#B8860B"
              weight={4}
              opacity={0.18}
              dashArray="6 8"
            />
          )}

          {/* Traveled portion (solid, bold) */}
          {traveledPath.length > 1 && (
            <Polyline
              positions={traveledPath}
              color="#B8860B"
              weight={6}
              opacity={0.9}
            />
          )}

          {/* Delivery vehicle */}
          <Marker position={carPos} icon={carIcon} />
        </MapContainer>

        {/* Overlay badges */}
        {orderStatus !== 'out' && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-cream-200 shadow-sm">
            <p className="text-[10px] font-black text-ink uppercase tracking-tighter">
              Awaiting Dispatch
            </p>
          </div>
        )}

        {orderStatus === 'out' && etaText && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-ink/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <FiTruck size={13} className="text-gold" />
            <p className="text-[11px] font-black text-white uppercase tracking-tighter whitespace-nowrap">
              {etaText}
            </p>
          </div>
        )}
      </div>

      {/* ── Vertical Stepper ── */}
      <div className="space-y-10 ml-2">
        {STAGES.map((stage, i) => {
          const Icon     = stage.icon
          const done     = i <= currentStageIndex
          const isActive = i === currentStageIndex

          return (
            <div key={stage.key} className="flex items-center gap-6 relative">
              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className={`absolute left-[17px] top-10 w-[3px] h-10 transition-all duration-1000 ${
                    i < currentStageIndex ? 'bg-gold' : 'bg-cream-200'
                  }`}
                />
              )}

              {/* Circle icon */}
              <div
                className={`z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                  done
                    ? 'bg-gold border-gold text-white shadow-lg'
                    : 'bg-white border-cream-200 text-ink-ghost'
                }`}
              >
                <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
              </div>

              {/* Label */}
              <div className="flex flex-col">
                <p className={`text-sm font-black tracking-tight ${done ? 'text-ink' : 'text-ink-ghost'}`}>
                  {stage.label}
                </p>
                {isActive && (
                  <span className="text-[10px] font-bold text-gold uppercase tracking-tighter animate-pulse">
                    {stage.key === 'out' && etaText ? etaText : 'Current Status'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}