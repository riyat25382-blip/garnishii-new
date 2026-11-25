export default function SearchBar({ initialValue = "", compact = false }: { initialValue?: string; compact?: boolean }) {
  return (
    <form className={`search-bar ${compact ? "search-bar--compact" : ""}`} action="/explore">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input type="search" name="q" defaultValue={initialValue} placeholder="Search professions, industries, fields or skills" aria-label="Search professions, industries, fields or skills" />
      <button type="submit">Explore</button>
    </form>
  );
}
