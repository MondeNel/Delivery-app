export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1 mb-3 scrollbar-none">
      <div className="flex gap-1.5 min-w-max">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border flex-shrink-0
              ${active === cat
                ? 'bg-gold-light border-gold text-warm-dark'
                : 'bg-cream border-transparent text-text-tertiary hover:border-border-light'}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}