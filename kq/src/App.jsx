import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

export default function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </OrderProvider>
    </CartProvider>
  )
}