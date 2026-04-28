import { createContext, useContext, useState } from 'react'

const OrderContext = createContext()
export const K_AND_Q_COORDS = { lat: -29.6644, lng: 22.7483 }

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(null)

  const placeOrder = () => {
    const newOrder = {
      id: 'KQ-' + Math.floor(1000 + Math.random() * 9000),
      status: 'received',
      time: Date.now(),
    }
    setOrder(newOrder)
    return newOrder
  }

  const updateOrderStatus = (status) => {
    setOrder(prev => prev ? { ...prev, status } : null)
  }

  // Admin manual override – jump straight to 'out'
  const markOutForDelivery = () => {
    setOrder(prev => prev ? { ...prev, status: 'out' } : null)
  }

  return (
    <OrderContext.Provider value={{ order, placeOrder, updateOrderStatus, markOutForDelivery }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  return useContext(OrderContext)
}