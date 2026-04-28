const deals = [
  {
    name: 'Castle 6-Pack',
    now: 'R72',
    was: 'R90',
    tag: 'Beer',
    discount: '-20%',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/beer/q/d/z/-original-imahgumrbenafaza.jpeg?q=70',
  },
  {
    name: 'Jagermeister 1L',
    now: 'R320',
    was: 'R430',
    tag: 'Spirit',
    discount: '-26%',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/r/y/a/-original-imah2f4xgqxeqvxq.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Jameson Reserve',
    now: 'R440',
    was: 'R600',
    tag: 'Whiskey',
    discount: '-27%',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/a/i/z/-original-imah2d8zg3qrm7dh.jpeg?q=70',
    contain: true,
  },
  {
    name: 'Wings + 2 Beers',
    now: 'R80',
    was: 'R110',
    tag: 'Combo',
    discount: '-27%',
    img: 'https://tb-static.uber.com/prod/image-proc/processed_images/39786ab630d560e39b374e0904fb3a94/f0d1762b91fd823a1aa9bd0dab5c648d.jpeg',
  },
  {
    name: 'Pap & Chicken Combo',
    now: 'R50',
    was: 'R75',
    tag: 'Food',
    discount: '-33%',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm81ILLtIdS21u0pkm-7y5mgg8Kjcp3JKwTg&s',
  },
  {
    name: 'Liquor & Softs Kit',
    now: 'R199',
    was: 'R280',
    tag: 'Kit',
    discount: '-29%',
    img: 'https://www.makro.co.za/asset/rukmini/fccp/612/612/ng-fkpublic-ui-user-fbbe/spirit/x/r/t/-original-imah2f4w2t4beeha.jpeg?q=70',
    contain: true,
  },
]

function DealCard({ deal }) {
  return (
    <div className="group min-w-[160px] bg-white border border-cream-300 rounded-[1.5rem] overflow-hidden flex-shrink-0 transition-all hover:shadow-md active:scale-95">
      {/* Image Container */}
      <div className={`h-24 bg-cream-100 overflow-hidden relative ${deal.contain ? 'flex items-center justify-center' : ''}`}>
        <img
          src={deal.img}
          alt={deal.name}
          className={`transition-transform duration-500 group-hover:scale-110 ${
            deal.contain ? 'h-4/5 w-auto object-contain' : 'w-full h-full object-cover'
          }`}
          onError={e => {
            e.target.src = 'https://placehold.co/400x400?text=K%26Q'
          }}
        />
        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-ember/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
          {deal.discount}
        </div>
        {/* Category Tag */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-gold text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border border-gold/10">
            {deal.tag}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] font-bold text-ink truncate mb-1">{deal.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gold">{deal.now}</span>
          <span className="text-[10px] text-ink-ghost line-through opacity-60">{deal.was}</span>
        </div>
      </div>
    </div>
  )
}

export default function DealsStrip() {
  return (
    <div className="mt-6">
      <div className="px-4 flex justify-between items-end mb-4">
        <div>
          <h2 className="text-[10px] font-black text-ink-ghost uppercase tracking-[0.2em] mb-1">Limited Time</h2>
          <p className="font-serif text-lg font-bold text-ink leading-none">Featured Deals</p>
        </div>
        <button className="text-[10px] font-bold text-gold uppercase tracking-widest border-b-2 border-gold/20 pb-0.5 hover:border-gold transition-all">
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none px-4 snap-x snap-mandatory">
        {deals.map((deal, i) => (
          <div
            key={i}
            className="snap-start animate-in fade-in slide-in-from-right-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  )
}