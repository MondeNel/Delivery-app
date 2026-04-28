import { useState, useMemo } from 'react'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'
import { useProducts } from '../context/ProductsContext'

const CAT_MAP = {
  'plate combos': 'combo',
  'babalas grill': 'grill',
  'single meals': 'single',
  'sides': 'side',
}

const CATEGORIES = [
  { label: 'All',            value: 'all'   },
  { label: 'Plate Combos',   value: 'combo' },
  { label: 'Babalas Grill',  value: 'grill' },
  { label: 'Single Meals',   value: 'single'},
  { label: 'Sides',          value: 'side'  },
]

export default function FoodPanel({ search, onCardClick }) {
  const [activeCat, setActiveCat] = useState('all')
  const { foods } = useProducts()

  const filtered = useMemo(() => foods.filter(f => {
    const matchCat    = activeCat === 'all' || f.cat === activeCat
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [activeCat, search, foods])

  return (
    <div className="bg-white rounded-[2rem] p-5 border border-cream-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <h2 className="font-serif text-lg font-bold text-ink">Plates</h2>
        </div>
        <span className="text-[10px] font-black text-ink-ghost bg-cream-100 px-2 py-1 rounded-lg uppercase tracking-tighter">
          {filtered.length} Options
        </span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1 mb-4 scrollbar-none">
        <div className="flex gap-2 min-w-max py-1">
          {CATEGORIES.map(cat => {
            const isActive = activeCat === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCat(cat.value)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-300 border-2 ${
                  isActive
                    ? 'bg-ink text-white border-ink shadow-lg shadow-ink/20 scale-105'
                    : 'bg-white border-cream-200 text-ink-ghost hover:border-gold/30 hover:text-gold'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 mt-5">
          {filtered.map((f, i) => (
            <div key={f.id} className="animate-in fade-in zoom-in-95" style={{ animationDelay: `${i * 50}ms` }}>
              <ItemCard item={f} onCardClick={onCardClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-cream-50/50 rounded-2xl mt-4 border border-dashed border-cream-300">
          <p className="text-xs font-bold text-ink-ghost italic">No food matches your search...</p>
        </div>
      )}
    </div>
  )
}