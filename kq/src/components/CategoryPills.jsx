export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1 mb-3 scrollbar-none">
      <div className="flex gap-1.5 min-w-max py-0.5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`btn-press text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap border transition-all duration-200 flex-shrink-0 ${
              active === cat
                ? 'bg-gold text-white border-gold shadow-gold'
                : 'bg-white border-cream-300 text-ink-mid hover:border-gold-border hover:text-gold-dark'
            }`}
            style={active === cat ? { boxShadow: '0 2px 8px rgba(184,134,11,0.25)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}