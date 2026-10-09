const categories = ['all', 'food', 'travel', 'shopping', 'bills', 'other'];

function Filters({ category, setCategory }) {
  return (
    <div className="filters">
      <label>Filter by category: </label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c[0].toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
