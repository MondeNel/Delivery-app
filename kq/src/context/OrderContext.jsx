import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

// Precise coordinates for Oasis St, Prieska, 8940
export const K_AND_Q_COORDS = { lat: -29.6644, lng: 22.7483 };

export const OrderProvider = ({ children }) => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (orderStatus === 'received') {
      const timer = setTimeout(() => setOrderStatus('preparing'), 5000);
      return () => clearTimeout(timer);
    }
    if (orderStatus === 'preparing') {
      const timer = setTimeout(() => setOrderStatus('out'), 10000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  const updateOrderStatus = (newStatus) => setOrderStatus(newStatus);

  const placeOrder = () => {
    setOrderStatus('received'); 
    return {
      id: `KQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'received',
      timestamp: new Date().toISOString(),
    };
  };

  return (
    <OrderContext.Provider value={{ orderStatus, updateOrderStatus, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};