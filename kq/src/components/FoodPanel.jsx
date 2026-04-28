import { useState, useMemo } from 'react'
import { foods } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

const CAT_MAP = {
  'plate combos': 'combo',
  'babalas grill': 'grill',
  'single meals': 'single',
  'sides': 'side',
}

export default function FoodPanel({ search, onCardClick }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Plate Combos', 'Babalas Grill', 'Single Meals', 'Sides']

  const filtered = useMemo(() => foods.filter(f => {
    const mappedCat = CAT_MAP[cat.toLowerCase()] || cat.toLowerCase()
    const matchCat = cat === 'All' || f.cat === mappedCat
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [cat, search])

  return (
    <div className="bg-white rounded-2xl p-4 border border-cream-300 card-lift">
      <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-cream-200">
        <h2 className="font-serif text-base font-bold text-ink">Food</h2>
        <span className="text-[10px] text-ink-ghost uppercase tracking-widest">{filtered.length} items</span>
      </div>
      <CategoryPills categories={categories} active={cat} onChange={setCat} />
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-3">
          {filtered.map(f => (
            <ItemCard key={f.id} item={f} onCardClick={onCardClick} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-ink-ghost">No items found</p>
        </div>
      )}
    </div>
  )
}