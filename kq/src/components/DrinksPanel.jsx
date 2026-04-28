import { useState, useMemo } from 'react'
import { drinks } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

export default function DrinksPanel({ search, onCardClick }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Beers', 'Spirits', 'Ciders', 'Wine', 'Shooters']

  const filtered = useMemo(() => drinks.filter(d => {
    const matchCat = cat === 'All' || d.cat.toLowerCase() === cat.toLowerCase()
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [cat, search])

  return (
    <div className="bg-white rounded-[2rem] p-5 border border-cream-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <h2 className="font-serif text-lg font-bold text-ink">Beverages</h2>
        </div>
        <span className="text-[10px] font-black text-ink-ghost bg-cream-100 px-2 py-1 rounded-lg uppercase tracking-tighter">
          {filtered.length} Options
        </span>
      </div>

      <CategoryPills categories={categories} active={cat} onChange={setCat} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 mt-5">
          {filtered.map((d, i) => (
            <div key={d.id} className="animate-in fade-in zoom-in-95" style={{ animationDelay: `${i * 50}ms` }}>
              <ItemCard item={d} onCardClick={onCardClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-cream-50/50 rounded-2xl mt-4 border border-dashed border-cream-300">
          <p className="text-xs font-bold text-ink-ghost italic">No drinks match your search...</p>
        </div>
      )}
    </div>
  )
}