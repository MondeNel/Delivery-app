import { useState, useEffect } from 'react';
import { useOrder, K_AND_Q_COORDS } from '../context/OrderContext';
import { usePlacedOrders } from '../context/PlacedOrdersContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { FiCheck, FiClock, FiTruck, FiSearch, FiMapPin, FiPhone } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/71/71422.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function Orders() {
  const { orderStatus } = useOrder();
  const { orders } = usePlacedOrders();
  const activeOrder = orders[orders.length - 1];

  const [riderPos, setRiderPos] = useState([K_AND_Q_COORDS.lat, K_AND_Q_COORDS.lng]);

  useEffect(() => {
    if (orderStatus === 'out' && activeOrder) {
      const interval = setInterval(() => {
        setRiderPos(prev => {
          const latDiff = activeOrder.lat - prev[0];
          const lngDiff = activeOrder.lng - prev[1];
          
          if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
            clearInterval(interval);
            return [activeOrder.lat, activeOrder.lng];
          }
          return [prev[0] + latDiff * 0.04, prev[1] + lngDiff * 0.04];
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderStatus, activeOrder]);

  if (!activeOrder) return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4 text-gold">
        <FiSearch size={30} />
      </div>
      <p className="text-ink-ghost font-bold uppercase tracking-widest text-xs">No active orders</p>
    </div>
  );

  const steps = [
    { id: 'received', label: 'Order Received', icon: <FiCheck />, desc: 'K&Q Tavern Prieska is processing' },
    { id: 'preparing', label: 'Preparing', icon: <FiClock />, desc: 'Grilling on Oasis Street' },
    { id: 'out', label: 'On the Way', icon: <FiTruck />, desc: 'Moving through Prieska' },
  ];

  const currentLevel = { received: 1, preparing: 2, out: 3, delivered: 4 }[orderStatus] || 1;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-cream-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-serif text-2xl font-bold text-ink">Track Order</h2>
              <span className="text-[10px] font-black bg-gold/10 text-gold px-4 py-1.5 rounded-full uppercase tracking-widest">
                #{activeOrder.id}
              </span>
            </div>

            <div className="relative space-y-12 ml-2">
              <div className="absolute left-[17px] top-2 bottom-2 w-[1px] bg-cream-200" />
              {steps.map((step, idx) => {
                const stepLevel = idx + 1;
                const isDone = currentLevel > stepLevel;
                const isActive = currentLevel === stepLevel;

                return (
                  <div key={step.id} className="relative flex items-start gap-6">
                    <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-700 border-2 ${
                      isDone || isActive ? 'bg-gold border-gold text-white shadow-xl shadow-gold/20' : 'bg-white border-cream-200 text-ink-ghost'
                    } ${isActive ? 'scale-110' : 'scale-100'}`}>
                      {isDone ? <FiCheck size={18} /> : step.icon}
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`font-bold text-sm ${isActive ? 'text-ink' : 'text-ink-ghost'}`}>{step.label}</h3>
                      <p className={`text-xs mt-1 ${isActive ? 'opacity-100 text-ink-muted' : 'opacity-40'}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-cream-100">
            <a href="tel:0833541005" className="flex items-center justify-center gap-3 w-full py-4 bg-ink text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors">
              <FiPhone /> Call Kings & Queens (Prieska)
            </a>
          </div>
        </div>

        <div className="min-h-[400px]">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white h-full relative">
             <MapContainer center={[K_AND_Q_COORDS.lat, K_AND_Q_COORDS.lng]} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <Marker position={[activeOrder.lat, activeOrder.lng]} icon={defaultIcon} />
                {orderStatus === 'out' && <Marker position={riderPos} icon={riderIcon} />}
             </MapContainer>
             
             <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm z-[1000] border border-cream-200">
                <p className="text-[10px] font-bold text-ink uppercase tracking-widest flex items-center gap-2">
                  <FiMapPin className="text-gold" /> Prieska, Northern Cape
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}