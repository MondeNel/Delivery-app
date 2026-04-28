import { useState, useMemo } from 'react'
import { foods } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

export default function FoodPanel({ search, onCardClick }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Combo', 'Grill', 'Single', 'Side']

  const filtered = useMemo(() => foods.filter(f => {
    const matchCat = cat === 'All' || f.cat.toLowerCase() === cat.toLowerCase()
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [cat, search])

  return (
    <div className="bg-white rounded-[2rem] p-5 border border-cream-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-ember rounded-full animate-pulse" />
          <h2 className="font-serif text-lg font-bold text-ink">Food Menu</h2>
        </div>
        <span className="text-[10px] font-black text-ink-ghost bg-cream-100 px-2 py-1 rounded-lg uppercase">
          {filtered.length} Items
        </span>
      </div>

      <CategoryPills categories={categories} active={cat} onChange={setCat} />

      <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 mt-5">
        {filtered.map((f, i) => (
          <ItemCard key={f.id} item={f} onCardClick={onCardClick} />
        ))}
      </div>
    </div>
  )
}