import { useState, useEffect } from 'react'
import DealsStrip from '../components/DealsStrip'
import DrinksPanel from '../components/DrinksPanel'
import FoodPanel from '../components/FoodPanel'
import ProductModal from '../components/ProductModal'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  // Listen to search events from Header
  useEffect(() => {
    const handler = (e) => setSearchQuery(e.detail)
    window.addEventListener('search', handler)
    return () => window.removeEventListener('search', handler)
  }, [])

  return (
    <>
      {/* Delivery banner */}
      <div className="mx-4 mt-3 bg-accent-light border border-accent-border rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-warm-dark">Minimum order: R100</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Orders below R100 cannot be placed for delivery
          </p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <span className="bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
            + R20 delivery
          </span>
        </div>
      </div>

      {/* Deals */}
      <DealsStrip />

      {/* Panels – grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 mt-3 pb-4">
        <DrinksPanel search={searchQuery} onCardClick={setSelectedItem} />
        <FoodPanel search={searchQuery} onCardClick={setSelectedItem} />
      </div>

      {/* Product detail modal */}
      <ProductModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  )
}