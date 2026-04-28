import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FiEdit2, FiTrash2, FiX, FiPlus, FiImage } from 'react-icons/fi'

// ── Helpers ──────────────────────────────────────────────────
const toNum = (val) =>
  typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.]/g, ''))

const emptyItem = () => ({ name: '', img: '', contain: false })

// ── Original deal data – each as a single‑item bundle ────────
const DEFAULT_DEALS = [
  {
    now: 72, was: 90, tag: 'Beer',
    items: [
      { name: 'Castle 6-Pack', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/beer/q/d/z/-original-imahgumrbenafaza.jpeg?q=70', contain: true },
    ],
  },
  {
    now: 320, was: 430, tag: 'Spirit',
    items: [
      { name: 'Jagermeister 1L', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/r/y/a/-original-imah2f4xgqxeqvxq.jpeg?q=70', contain: true },
    ],
  },
  {
    now: 440, was: 600, tag: 'Whiskey',
    items: [
      { name: 'Jameson Reserve', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/i/z/-original-imah2d8zg3qrm7dh.jpeg?q=70', contain: true },
    ],
  },
  {
    now: 140, was: 180, tag: 'Cider',
    items: [
      { name: 'Savanna Dry x6', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/cider/d/y/3/-original-imahghjne9dpysyu.jpeg?q=70', contain: true },
    ],
  },
  {
    now: 80, was: 110, tag: 'Combo',
    items: [
      { name: 'Wings + 2 Beers', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80', contain: false },
    ],
  },
  {
    now: 50, was: 75, tag: 'Food',
    items: [
      { name: 'Pap & Chicken Combo', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', contain: false },
    ],
  },
  {
    now: 99, was: 130, tag: 'Grill',
    items: [
      { name: 'Mix Grill Special', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', contain: false },
    ],
  },
  {
    now: 199, was: 249, tag: 'Kit',
    items: [
      { name: 'Smirnoff Vodka', img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/q/w/-original-imah2d8zvapdeezy.jpeg?q=70', contain: true },
      { name: 'Mixer Soft Drinks', img: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80', contain: false },
    ],
  },
]

// ── Card (unchanged design) ──────────────────────────────────
function DealCard({ deal, onEdit, onDelete, isAdmin }) {
  const discount = Math.round((1 - toNum(deal.now) / toNum(deal.was)) * 100)
  const firstItem = deal.items?.[0] || {}

  return (
    <div className="group min-w-[148px] max-w-[148px] bg-white border border-cream-200 rounded-2xl overflow-hidden flex-shrink-0 flex flex-col transition-all duration-200 hover:border-gold/40 hover:shadow-md active:scale-[0.97] relative"
      style={{ boxShadow: '0 1px 6px rgba(26,22,18,0.07)' }}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(deal) }}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
          ><FiEdit2 size={12} /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(deal) }}
            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          ><FiTrash2 size={12} /></button>
        </div>
      )}

      <div className="relative bg-[#F7F5F2] flex items-center justify-center overflow-hidden flex-shrink-0" style={{ height: '140px' }}>
        <img src={firstItem.img} alt={firstItem.name}
          className={`transition-transform duration-500 group-hover:scale-105 ${firstItem.contain ? 'h-[85%] w-auto object-contain' : 'w-full h-full object-cover'}`}
          onError={e => { e.target.src = 'https://placehold.co/400x400/f7f5f2/B8860B?text=K%26Q' }}
        />
        <div className="absolute top-2 left-2 bg-ember text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">-{discount}%</div>
        {deal.items?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-ink/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
            +{deal.items.length - 1} more
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-gold">{deal.tag}</span>
        <div className="text-[11px] font-bold text-ink leading-snug line-clamp-2 flex-1">
          {deal.items?.map((it, i) => (
            <span key={i}>{it.name}{i < deal.items.length - 1 ? ', ' : ''}</span>
          ))}
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-black text-gold">R{toNum(deal.now)}</span>
          <span className="text-[10px] text-ink-ghost line-through opacity-60">R{toNum(deal.was)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Modal with dynamic item list ─────────────────────────────
function DealModal({ isOpen, onClose, onSave, initial }) {
  const [now, setNow] = useState(initial?.now || '')
  const [was, setWas] = useState(initial?.was || '')
  const [tag, setTag] = useState(initial?.tag || '')
  const [items, setItems] = useState(initial?.items || [emptyItem()])

  useEffect(() => {
    if (initial) {
      setNow(initial.now || '')
      setWas(initial.was || '')
      setTag(initial.tag || '')
      setItems(initial.items?.length ? initial.items : [emptyItem()])
    } else {
      setNow(''); setWas(''); setTag(''); setItems([emptyItem()])
    }
  }, [initial, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      now: Number(now),
      was: Number(was),
      tag: tag.trim() || 'Deal',
      items: items.filter(it => it.name.trim() !== ''),
    })
    onClose()
  }

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it))
  }

  const addItem = () => setItems(prev => [...prev, emptyItem()])
  const removeItem = (index) => setItems(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-cream w-full md:w-[480px] max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-300"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-ink">{initial ? 'Edit Deal' : 'Add Deal'}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
            <FiX size={16} className="text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prices */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-black text-ink-ghost uppercase tracking-wide">Sale Price (R)</label>
              <input type="number" value={now} onChange={e => setNow(e.target.value)} required min="1"
                className="w-full bg-white border border-cream-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-gold" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-ink-ghost uppercase tracking-wide">Was Price (R)</label>
              <input type="number" value={was} onChange={e => setWas(e.target.value)} required min="1"
                className="w-full bg-white border border-cream-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-gold" />
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="text-[10px] font-black text-ink-ghost uppercase tracking-wide">Category Tag</label>
            <input type="text" value={tag} onChange={e => setTag(e.target.value)} placeholder="Beer, Spirit, Combo..."
              className="w-full bg-white border border-cream-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-gold" />
          </div>

          {/* Items list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-ink-ghost uppercase tracking-wide">Products in Bundle</span>
              <button type="button" onClick={addItem}
                className="flex items-center gap-1 text-gold text-[10px] font-bold">
                <FiPlus size={14} strokeWidth={3} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white border border-cream-200 rounded-xl p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-ink-ghost uppercase">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)}
                        className="text-ember text-xs font-bold hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-ink-ghost uppercase">Name</label>
                      <input type="text" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)}
                        placeholder="Product name" required
                        className="w-full bg-cream-100 border border-cream-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-gold" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-ink-ghost uppercase">Image URL</label>
                      <div className="relative">
                        <FiImage size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
                        <input type="url" value={item.img} onChange={e => updateItem(idx, 'img', e.target.value)}
                          className="w-full bg-cream-100 border border-cream-300 rounded-lg p-2 pl-9 text-xs font-bold outline-none focus:border-gold" />
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer pb-1">
                      <input type="checkbox" checked={item.contain || false} onChange={e => updateItem(idx, 'contain', e.target.checked)}
                        className="accent-gold rounded" />
                      <span className="text-[9px] font-bold text-ink-ghost uppercase">Bottle</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit"
            className="w-full bg-gold text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
            {initial ? 'Update Deal' : 'Add Deal'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────
export default function DealsStrip() {
  const { isAdmin } = useAuth()
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('kq-deals')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map(d => ({
          ...d,
          now: toNum(d.now),
          was: toNum(d.was),
          items: d.items?.length ? d.items : [emptyItem()],
        }))
      }
    } catch {}
    return DEFAULT_DEALS
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem('kq-deals', JSON.stringify(deals))
  }, [deals])

  const handleSave = (dealData) => {
    if (editTarget) {
      setDeals(prev => prev.map(d => d === editTarget ? dealData : d))
    } else {
      setDeals(prev => [...prev, dealData])
    }
  }

  const handleDelete = (deal) => {
    if (confirm(`Delete "${deal.tag}" deal?`)) {
      setDeals(prev => prev.filter(d => d !== deal))
    }
  }

  return (
    <div className="mt-6">
      <div className="px-4 flex justify-between items-end mb-4">
        <div>
          <p className="text-[10px] font-black text-ink-ghost uppercase tracking-[0.2em] mb-1">Limited Time</p>
          <h2 className="font-serif text-lg font-bold text-ink leading-none">Featured Deals</h2>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditTarget(null); setModalOpen(true) }}
            className="flex items-center gap-1.5 bg-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all">
            <FiPlus size={14} strokeWidth={3} />
            Add Deal
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none px-4 snap-x snap-mandatory">
        {deals.map((deal, i) => (
          <div key={i} className="snap-start" style={{ animation: `fadeIn 0.3s ease ${i * 60}ms both` }}>
            <DealCard
              deal={deal}
              isAdmin={isAdmin}
              onEdit={(deal) => { setEditTarget(deal); setModalOpen(true) }}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      <DealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
    </div>
  )
}