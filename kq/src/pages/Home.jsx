import { useState, useEffect } from 'react'
import DealsStrip from '../components/DealsStrip'
import DrinksPanel from '../components/DrinksPanel'
import FoodPanel from '../components/FoodPanel'
import ProductModal from '../components/ProductModal'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    const handler = (e) => setSearchQuery(e.detail)
    window.addEventListener('search', handler)
    return () => window.removeEventListener('search', handler)
  }, [])

  return (
    <>
      {/* Delivery Banner */}
      <div className="mx-4 mt-3 bg-gold-light border border-gold-border rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gold-dark">Minimum order: R100</p>
          <p className="text-[11px] text-ink-muted mt-0.5">Orders below R100 cannot be placed for delivery</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <span className="bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-gold">
            + R20 delivery
          </span>
        </div>
      </div>

      <DealsStrip />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 mt-3 pb-4">
        <DrinksPanel search={searchQuery} onCardClick={setSelectedItem} />
        <FoodPanel search={searchQuery} onCardClick={setSelectedItem} />
      </div>

      <ProductModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  )
}