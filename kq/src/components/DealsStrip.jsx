export default function DealsStrip() {
  const deals = [
    { name: 'Castle 6-Pack', now: 'R72', was: 'R90', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Castle_Lager_beers.jpg/240px-Castle_Lager_beers.jpg' },
    { name: 'Jagermeister 1L', now: 'R320', was: 'R430', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Jagermeister_bottle.jpg/240px-Jagermeister_bottle.jpg' },
    { name: 'Jameson Reserve', now: 'R440', was: 'R600', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Jameson_Irish_Whiskey.jpg/240px-Jameson_Irish_Whiskey.jpg' },
    { name: 'Wings + 2 Beers', now: 'R80', was: 'R110', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80' },
    { name: 'Beef Combo Special', now: 'R55', was: 'R70', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div className="px-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Deals & Promotions</span>
        <span className="text-xs text-accent cursor-pointer">See all</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {deals.map((d, i) => (
          <div key={i} className="min-w-[150px] bg-surface border border-subtle rounded-lg p-2.5 flex-shrink-0">
            <div className="h-20 bg-gray-800 rounded-md mb-2 overflow-hidden">
              <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-xs font-medium text-white mb-1">{d.name}</div>
            <div className="flex gap-1.5 items-center">
              <span className="text-sm font-medium text-accent">{d.now}</span>
              <span className="text-xs text-text-tertiary line-through">{d.was}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}