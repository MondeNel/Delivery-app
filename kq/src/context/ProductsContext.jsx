import { createContext, useContext, useState, useEffect } from 'react'
import { drinks as defaultDrinks, foods as defaultFoods } from '../data/products'

const ProductsContext = createContext()

const STORAGE_KEY = 'kq-products'

export function ProductsProvider({ children }) {
  const [drinks, setDrinks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.drinks?.length > 0 && parsed.foods?.length > 0) {
          return parsed.drinks
        }
      } catch (_) {}
    }
    return defaultDrinks
  })

  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.foods?.length > 0) {
          return parsed.foods
        }
      } catch (_) {}
    }
    return defaultFoods
  })

  // Persist every time drinks or foods change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ drinks, foods }))
  }, [drinks, foods])

  /**
   * Update a single item by id.
   * @param {string} id   – item id (e.g. 'd1', 'f1')
   * @param {'drink'|'food'} type
   * @param {object} updates – fields to merge (e.g. { price: 30 })
   */
  const updateItem = (id, type, updates) => {
    if (type === 'drink') {
      setDrinks(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)))
    } else if (type === 'food') {
      setFoods(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)))
    }
  }

  // Reset to defaults (useful for admin)
  const resetToDefaults = () => {
    setDrinks(defaultDrinks)
    setFoods(defaultFoods)
  }

  return (
    <ProductsContext.Provider value={{ drinks, foods, updateItem, resetToDefaults }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}