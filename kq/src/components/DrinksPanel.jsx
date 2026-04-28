import { useState, useMemo } from 'react'
import { drinks } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

export default function DrinksPanel({ search, onCardClick }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Beers', 'Spirits', 'Ciders', 'Wine', 'Shooters']

  const filtered = useMemo(() => drinks.filter(d => {
    const matchCat = cat === 'All' || d.cat === cat.toLowerCase()
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [cat, search])

  return (
    <div className="bg-surface border border-subtle rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-subtle">
        <h2 className="font-serif text-base font-bold text-white">Drinks</h2>
        <span className="text-[10px] text-text-tertiary uppercase tracking-widest">
          {filtered.length} items
        </span>
      </div>
      <CategoryPills categories={categories} active={cat} onChange={setCat} />
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-3">
          {filtered.map(d => (
            <ItemCard key={d.id} item={d} onCardClick={onCardClick} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-text-tertiary">No items found</p>
        </div>
      )}
    </div>
  )
}