import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Orders from './pages/Orders'
import Profile from './pages/Profile'

// Context Providers
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { PlacedOrdersProvider } from './context/PlacedOrdersContext'
import { ProfileProvider } from './context/ProfileContext'

export default function App() {
  return (
    <ProfileProvider>
      <PlacedOrdersProvider>
        <OrderProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </CartProvider>
        </OrderProvider>
      </PlacedOrdersProvider>
    </ProfileProvider>
  )
}