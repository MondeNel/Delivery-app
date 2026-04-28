import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import DealsStrip from '../components/DealsStrip'
import DrinksPanel from '../components/DrinksPanel'
import FoodPanel from '../components/FoodPanel'
import ProductModal from '../components/ProductModal'

export default function Home() {
  // Pulling the search state from Layout.jsx
  const { searchQuery } = useOutletContext()
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="animate-in fade-in duration-500">
      {/* Delivery Banner - Premium Styling */}
      <div className="mx-4 mt-3 bg-[#FCF8F1] border border-gold/20 rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-bold text-gold-dark uppercase tracking-wider">Minimum order: R100</p>
          <p className="text-[11px] text-ink-muted mt-1 leading-tight">Orders below R100 are collection only.</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <span className="bg-gold text-white text-[10px] font-black px-3 py-2 rounded-xl whitespace-nowrap shadow-lg shadow-gold/20">
            + R20 DELIVERY
          </span>
        </div>
      </div>

      <DealsStrip />

      {/* Panels – Dynamic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mt-4 pb-8">
        <section>
          <h2 className="text-xs font-black text-ink-ghost uppercase tracking-[0.2em] mb-3 ml-1">Liquor & Softs</h2>
          <DrinksPanel search={searchQuery} onCardClick={setSelectedItem} />
        </section>
        
        <section>
          <h2 className="text-xs font-black text-ink-ghost uppercase tracking-[0.2em] mb-3 ml-1">Kitchen & Grill</h2>
          <FoodPanel search={searchQuery} onCardClick={setSelectedItem} />
        </section>
      </div>

      <ProductModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}