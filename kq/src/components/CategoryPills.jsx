export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border
            ${active === cat
              ? 'bg-gold-light border-gold text-warm-dark'
              : 'bg-cream border-transparent text-text-tertiary hover:border-border-light'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}