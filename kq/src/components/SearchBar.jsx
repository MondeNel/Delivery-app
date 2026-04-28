export default function SearchBar() {
  return (
    <div className="px-4 pb-3 bg-white border-b border-cream-200">
      <div className="flex items-center bg-cream-200 rounded-md px-3 py-2 gap-2">
        <svg width="14" height="14" fill="none" stroke="#9B8F85" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search drinks, food..."
          className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder-ink-muted"
          onChange={(e) => window.dispatchEvent(new CustomEvent('search', { detail: e.target.value }))}
        />
      </div>
    </div>
  )
}