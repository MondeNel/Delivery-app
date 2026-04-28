import { createContext, useContext, useState, useEffect } from 'react'

const defaultDeals = [
  { name: 'Castle 6-Pack', now: 'R72', was: 'R90', tag: 'Beer', discount: '-20%', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/beer/q/d/z/-original-imahgumrbenafaza.jpeg?q=70' },
  { name: 'Jagermeister 1L', now: 'R320', was: 'R430', tag: 'Spirit', discount: '-26%', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/r/y/a/-original-imah2f4xgqxeqvxq.jpeg?q=70', contain: true },
  { name: 'Jameson Reserve', now: 'R440', was: 'R600', tag: 'Whiskey', discount: '-27%', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/i/z/-original-imah2d8zg3qrm7dh.jpeg?q=70', contain: true },
  { name: 'Wings + 2 Beers', now: 'R80', was: 'R110', tag: 'Combo', discount: '-27%', img: 'https://tb-static.uber.com/prod/image-proc/processed_images/39786ab630d560e39b374e0904fb3a94/f0d1762b91fd823a1aa9bd0dab5c648d.jpeg' },
  { name: 'Pap & Chicken Combo', now: 'R50', was: 'R75', tag: 'Food', discount: '-33%', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm81ILLtIdS21u0pkm-7y5mgg8Kjcp3JKwTg&s' },
  { name: 'Liquor & Softs Kit', now: 'R199', was: 'R280', tag: 'Kit', discount: '-29%', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/x/r/t/-original-imah2f4w2t4beeha.jpeg?q=70', contain: true },
]

const DealsContext = createContext()

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('kq-deals')
    return saved ? JSON.parse(saved) : defaultDeals
  })

  useEffect(() => {
    localStorage.setItem('kq-deals', JSON.stringify(deals))
  }, [deals])

  const updateDeal = (index, updates) => {
    setDeals(prev => prev.map((d, i) => i === index ? { ...d, ...updates } : d))
  }

  const deleteDeal = (index) => {
    setDeals(prev => prev.filter((_, i) => i !== index))
  }

  const addDeal = (deal) => {
    setDeals(prev => [...prev, deal])
  }

  const resetDeals = () => setDeals(defaultDeals)

  return (
    <DealsContext.Provider value={{ deals, updateDeal, deleteDeal, addDeal, resetDeals }}>
      {children}
    </DealsContext.Provider>
  )
}

export function useDeals() {
  return useContext(DealsContext)
}