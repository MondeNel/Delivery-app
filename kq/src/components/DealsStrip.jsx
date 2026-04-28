const deals = [
  {
    name: 'Castle 6-Pack',
    now: 'R72', was: 'R90',
    tag: 'Beer',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Castle_Lager_beers.jpg/240px-Castle_Lager_beers.jpg',
  },
  {
    name: 'Jagermeister 1L',
    now: 'R320', was: 'R430',
    tag: 'Spirit',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Jagermeister_bottle.jpg/240px-Jagermeister_bottle.jpg',
    contain: true,
  },
  {
    name: 'Jameson Reserve',
    now: 'R440', was: 'R600',
    tag: 'Whiskey',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Jameson_Irish_Whiskey.jpg/240px-Jameson_Irish_Whiskey.jpg',
    contain: true,
  },
  {
    name: 'Wings + 2 Beers',
    now: 'R80', was: 'R110',
    tag: 'Combo',
    img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Pap & Chicken Combo',
    now: 'R50', was: 'R75',
    tag: 'Food',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  },
]

function DealCard({ deal }) {
  const discount = Math.round((1 - parseInt(deal.now.slice(1)) / parseInt(deal.was.slice(1))) * 100)

  return (
    <div className="card-lift min-w-[158px] bg-white border border-cream-300 rounded-2xl overflow-hidden flex-shrink-0" style={{ boxShadow: '0 1px 4px rgba(26,22,18,0.06)' }}>
      {/* Image */}
      <div className={`h-[88px] bg-cream-200 overflow-hidden relative ${deal.contain ? 'flex items-center justify-center' : ''}`}>
        <img
          src={deal.img}
          alt={deal.name}
          className={`${deal.contain ? 'h-full w-auto object-contain p-2' : 'w-full h-full object-cover'}`}
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Discount badge */}
        <div className="absolute top-2 right-2 bg-ember text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
          -{discount}%
        </div>
        {/* Category tag */}
        <div className="absolute top-2 left-2">
          <span className="badge-gold">{deal.tag}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs font-semibold text-ink truncate mb-1.5">{deal.name}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-gold" style={{ fontFamily: 'DM Mono, monospace' }}>{deal.now}</span>
          <span className="text-[11px] text-ink-ghost line-through">{deal.was}</span>
        </div>
      </div>
    </div>
  )
}

export default function DealsStrip() {
  return (
    <div className="px-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-bold text-ink">Deals &amp; Promotions</span>
          <span className="badge-gold">{deals.length} offers</span>
        </div>
        <button className="text-xs text-gold font-semibold hover:text-gold-dark transition-colors">See all →</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-0.5 px-0.5">
        {deals.map((deal, i) => (
          <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  )
}