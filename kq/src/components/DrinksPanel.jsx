import { useState, useMemo } from 'react'
import { drinks } from '../data/products'
import CategoryPills from './CategoryPills'
import ItemCard from './ItemCard'

export default function DrinksPanel({ search }) {
  const [cat, setCat] = useState('All')
  const categories = ['All', 'Beers', 'Spirits', 'Ciders', 'Wine', 'Shooters']

  const filtered = useMemo(() => {
    return drinks.filter(d => {
      const matchCat = cat === 'All' || d.cat === cat.toLowerCase()
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [cat, search])

  return (
    <div className="bg-surface rounded-lg p-3 border border-subtle">
      <h2 className="font-serif text-base text-white mb-2 pb-2 border-b border-subtle">Drinks</h2>
      <CategoryPills categories={categories} active={cat} onChange={setCat} />
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {filtered.map(d => <ItemCard key={d.id} item={d} />)}
        {filtered.length === 0 && <p className="text-xs text-text-tertiary w-full text-center py-4">No items found</p>}
      </div>
    </div>
  )
}