export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1 mb-4 scrollbar-none">
      <div className="flex gap-2 min-w-max py-1">
        {categories.map(cat => {
          const isActive = active.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-ink text-white border-ink shadow-lg shadow-ink/20 scale-105'
                  : 'bg-white border-cream-200 text-ink-ghost hover:border-gold/30 hover:text-gold'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  )
}