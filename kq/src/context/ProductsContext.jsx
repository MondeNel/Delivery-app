import { createContext, useContext, useState, useEffect } from 'react'
import { drinks as defaultDrinks, foods as defaultFoods } from '../data/products'

const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [drinks, setDrinks] = useState([])
  const [foods, setFoods] = useState([])
  const [deals, setDeals] = useState([]) // if we have separate deals data

  useEffect(() => {
    const stored = localStorage.getItem('kq-custom-products')
    if (stored) {
      const parsed = JSON.parse(stored)
      setDrinks(parsed.drinks || defaultDrinks)
      setFoods(parsed.foods || defaultFoods)
      setDeals(parsed.deals || [])
    } else {
      setDrinks(defaultDrinks)
      setFoods(defaultFoods)
    }
  }, [])

  const saveProducts = (newDrinks, newFoods) => {
    setDrinks(newDrinks)
    setFoods(newFoods)
    localStorage.setItem('kq-custom-products', JSON.stringify({ drinks: newDrinks, foods: newFoods, deals }))
  }

  const updateItem = (id, type, updates) => {
    if (type === 'drink') {
      const newDrinks = drinks.map(d => d.id === id ? { ...d, ...updates } : d)
      saveProducts(newDrinks, foods)
    } else {
      const newFoods = foods.map(f => f.id === id ? { ...f, ...updates } : f)
      saveProducts(drinks, newFoods)
    }
  }

  return (
    <ProductsContext.Provider value={{ drinks, foods, deals, updateItem }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)