export default function SearchBar({ value, onChange }) {
  return (
    <div className="px-4 pb-3 bg-white border-b border-cream-200">
      <div className="flex items-center bg-cream-200 rounded-lg px-3 py-2.5 gap-2 transition-all focus-within:ring-1 focus-within:ring-gold/30">
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          viewBox="0 0 24 24" 
          className="text-ink-ghost"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={value}
          placeholder="Search drinks, food..."
          className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder-ink-muted font-medium"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}