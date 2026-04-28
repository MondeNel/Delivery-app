import { useState, useMemo } from 'react'
import { foods } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

export default function FoodPanel({ search }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Plate Combos', 'Babalas Grill', 'Single Meals', 'Sides']

  const filtered = useMemo(() => {
    return foods.filter(f => {
      const catMap = {
        'plate combos': 'combo',
        'babalas grill': 'grill',
        'single meals': 'single',
        'sides': 'side'
      }
      const mappedCat = catMap[cat.toLowerCase()] || cat.toLowerCase()
      const matchCat = cat === 'All' || f.cat === mappedCat
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [cat, search])

  return (
    <div className="bg-surface rounded-lg p-3 border border-subtle">
      <h2 className="font-serif text-base text-white mb-2 pb-2 border-b border-subtle">Food</h2>
      <CategoryPills categories={categories} active={cat} onChange={setCat} />
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {filtered.map(f => <ItemCard key={f.id} item={f} />)}
        {filtered.length === 0 && <p className="text-xs text-text-tertiary w-full text-center py-4">No items found</p>}
      </div>
    </div>
  )
}