// DealsStrip.jsx
const deals = [
  {
    name: 'Castle 6-Pack',
    now: 72,
    was: 90,
    tag: 'Beer',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/beer/q/d/z/-original-imahgumrbenafaza.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Jagermeister 1L',
    now: 320,
    was: 430,
    tag: 'Spirit',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/r/y/a/-original-imah2f4xgqxeqvxq.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Jameson Reserve',
    now: 440,
    was: 600,
    tag: 'Whiskey',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/i/z/-original-imah2d8zg3qrm7dh.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Savanna Dry x6',
    now: 140,
    was: 180,
    tag: 'Cider',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/cider/d/y/3/-original-imahghjne9dpysyu.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Wings + 2 Beers',
    now: 80,
    was: 110,
    tag: 'Combo',
    img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    contain: false,
  },
  {
    name: 'Pap & Chicken Combo',
    now: 50,
    was: 75,
    tag: 'Food',
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    contain: false,
  },
  {
    name: 'Mix Grill Special',
    now: 99,
    was: 130,
    tag: 'Grill',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    contain: false,
  },
  {
    name: 'Smirnoff Vodka',
    now: 199,
    was: 249,
    tag: 'Spirit',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/q/w/-original-imah2d8zvapdeezy.jpeg?q=70',
    contain: true,
  },
]

function DealCard({ deal }) {
  const discount = Math.round((1 - deal.now / deal.was) * 100)

  return (
    <div className="group min-w-[148px] max-w-[148px] bg-white border border-cream-200 rounded-2xl overflow-hidden flex-shrink-0 flex flex-col transition-all duration-200 hover:border-gold/40 hover:shadow-md active:scale-[0.97]"
      style={{ boxShadow: '0 1px 6px rgba(26,22,18,0.07)' }}
    >
      {/* Image */}
      <div className="relative bg-[#F7F5F2] flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ height: '140px' }}
      >
        <img
          src={deal.img}
          alt={deal.name}
          className={`transition-transform duration-500 group-hover:scale-105 ${
            deal.contain
              ? 'h-[85%] w-auto object-contain'
              : 'w-full h-full object-cover'
          }`}
          onError={e => { e.target.src = 'https://placehold.co/400x400/f7f5f2/B8860B?text=K%26Q' }}
        />

        {/* Discount badge */}
        <div className="absolute top-2 right-2 bg-ember text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">
          -{discount}%
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Category tag */}
        <span className="text-[9px] font-black uppercase tracking-widest text-gold">
          {deal.tag}
        </span>

        {/* Name */}
        <p className="text-[11px] font-bold text-ink leading-snug line-clamp-2 flex-1">
          {deal.name}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-black text-gold">R{deal.now}</span>
          <span className="text-[10px] text-ink-ghost line-through opacity-60">R{deal.was}</span>
        </div>
      </div>
    </div>
  )
}

export default function DealsStrip() {
  return (
    <div className="mt-6">
      {/* Header */}
      <div className="px-4 flex justify-between items-end mb-4">
        <div>
          <p className="text-[10px] font-black text-ink-ghost uppercase tracking-[0.2em] mb-1">
            Limited Time
          </p>
          <h2 className="font-serif text-lg font-bold text-ink leading-none">
            Featured Deals
          </h2>
        </div>
        <button className="text-[10px] font-bold text-gold uppercase tracking-widest border-b-2 border-gold/20 pb-0.5 hover:border-gold transition-all">
          View All
        </button>
      </div>

      {/* Scrollable strip */}
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none px-4 snap-x snap-mandatory">
        {deals.map((deal, i) => (
          <div
            key={i}
            className="snap-start animate-in fade-in slide-in-from-right-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  )
}