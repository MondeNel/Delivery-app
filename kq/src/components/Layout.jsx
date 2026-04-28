import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'
import TrackingBar from './TrackingBar'
import { useState, useEffect } from 'react'

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (cartOpen || checkoutOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [cartOpen, checkoutOpen])

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <Header 
        onCartClick={() => setCartOpen(true)} 
        searchQuery={searchQuery}
        onSearch={setSearchQuery} 
      />
      
      <TrackingBar />

      <main className="pb-24">
        <Outlet context={{ searchQuery }} />
      </main>

      <BottomNav />

      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }} 
      />

      <CheckoutModal 
        open={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
      />
    </div>
  )
}