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
    <div className="bg-white rounded-lg p-3 border border-border-light">
      <h2 className="font-serif text-base text-text-primary mb-2 pb-2 border-b border-border-light">Drinks</h2>
      <CategoryPills categories={categories} active={cat} onChange={setCat} />
      <div className="space-y-2">
        {filtered.map(d => <ItemCard key={d.id} item={d} type="drink" />)}
        {filtered.length === 0 && <p className="text-xs text-text-tertiary text-center py-4">No items found</p>}
      </div>
    </div>
  )
}