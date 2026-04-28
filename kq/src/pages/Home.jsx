import { useState, useEffect } from 'react'
import DealsStrip from '../components/DealsStrip'
import DrinksPanel from '../components/DrinksPanel'
import FoodPanel from '../components/FoodPanel'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handler = (e) => setSearchQuery(e.detail)
    window.addEventListener('search', handler)
    return () => window.removeEventListener('search', handler)
  }, [])

  return (
    <>
      {/* Delivery banner */}
      <div className="mx-4 mt-3 bg-gold-light border border-gold-border rounded-lg p-3 flex justify-between items-center">
        <div className="text-sm font-medium text-warm-dark">
          Only delivery for orders more than R100
        </div>
        <div className="bg-gold text-gold-light text-[11px] font-medium px-2.5 py-1 rounded-full">
          + R20 delivery
        </div>
      </div>

      {/* Deals horizontal scroll */}
      <DealsStrip />

      {/* Content grid – single column on phones, two columns on tablets+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 mt-2 pb-4">
        <DrinksPanel search={searchQuery} />
        <FoodPanel search={searchQuery} />
      </div>
    </>
  )
}