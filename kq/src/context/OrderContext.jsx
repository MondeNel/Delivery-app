import { createContext, useContext, useState } from 'react'

const OrderContext = createContext()

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

  return (
    <OrderContext.Provider value={{ order, placeOrder, updateOrderStatus, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside OrderProvider')
  return ctx
}