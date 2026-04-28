import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'
import TrackingBar from './TrackingBar'
import { useCart } from '../context/CartContext'
import { useOrder } from '../context/OrderContext'
import { useState } from 'react'

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream font-sans text-text-primary">
      <Header onCartClick={() => setCartOpen(true)} />
      <TrackingBar />
      <main className="pb-20"> {/* bottom nav space */}
        <Outlet />
      </main>
      <BottomNav />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  )
}