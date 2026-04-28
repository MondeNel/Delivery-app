export default function SearchBar() {
  return (
    <div className="px-4 pb-3 bg-surface border-b border-subtle">
      <div className="flex items-center bg-gray-800 rounded-md px-3 py-2 gap-2">
        <svg width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search drinks, food..."
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-text-tertiary"
          onChange={(e) => window.dispatchEvent(new CustomEvent('search', { detail: e.target.value }))}
        />
      </div>
    </div>
  )
}