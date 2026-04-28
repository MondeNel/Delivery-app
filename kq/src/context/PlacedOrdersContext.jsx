import { createContext, useContext, useReducer, useEffect } from 'react'

const PlacedOrdersContext = createContext()

const initialOrders = JSON.parse(localStorage.getItem('kq-placed-orders')) || []

function ordersReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER':
      return [...state, action.payload]
    case 'UPDATE_STATUS':
      return state.map(order =>
        order.id === action.payload.id
          ? { ...order, status: action.payload.status }
          : order
      )
    default:
      return state
  }
}

export function PlacedOrdersProvider({ children }) {
  const [orders, dispatch] = useReducer(ordersReducer, initialOrders)

  useEffect(() => {
    localStorage.setItem('kq-placed-orders', JSON.stringify(orders))
  }, [orders])

  const addOrder = (order) => {
    dispatch({ type: 'ADD_ORDER', payload: order })
  }

  const updateOrderStatus = (id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } })
  }

  return (
    <PlacedOrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </PlacedOrdersContext.Provider>
  )
}

export function usePlacedOrders() {
  return useContext(PlacedOrdersContext)
}