import { createContext, useContext, useReducer, useEffect } from 'react'

const PlacedOrdersContext = createContext()

const initialOrders = JSON.parse(localStorage.getItem('kq-placed-orders')) || []
const initialCompleted = JSON.parse(localStorage.getItem('kq-completed-orders')) || []

function ordersReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER':
      return { ...state, active: [...state.active, action.payload] }
    case 'UPDATE_ORDER': {
      const updated = state.active.map(o =>
        o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
      )
      return { ...state, active: updated }
    }
    case 'COMPLETE_ORDER': {
      const order = state.active.find(o => o.id === action.payload)
      const newActive = state.active.filter(o => o.id !== action.payload)
      const newCompleted = order ? [order, ...state.completed] : state.completed
      return { active: newActive, completed: newCompleted }
    }
    default:
      return state
  }
}

const initialState = { active: initialOrders, completed: initialCompleted }

export function PlacedOrdersProvider({ children }) {
  const [state, dispatch] = useReducer(ordersReducer, initialState)

  useEffect(() => {
    localStorage.setItem('kq-placed-orders', JSON.stringify(state.active))
    localStorage.setItem('kq-completed-orders', JSON.stringify(state.completed))
  }, [state])

  const addOrder = (order) => dispatch({ type: 'ADD_ORDER', payload: order })
  const updateOrder = (id, updates) => dispatch({ type: 'UPDATE_ORDER', payload: { id, updates } })
  const completeOrder = (id) => dispatch({ type: 'COMPLETE_ORDER', payload: id })

  return (
    <PlacedOrdersContext.Provider value={{
      orders: state.active,
      completedOrders: state.completed,
      addOrder,
      updateOrder,
      completeOrder,
    }}>
      {children}
    </PlacedOrdersContext.Provider>
  )
}

export function usePlacedOrders() {
  return useContext(PlacedOrdersContext)
}