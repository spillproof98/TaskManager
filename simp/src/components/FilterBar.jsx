import React from "react";
import "./FilterBar.css";

export default function FilterBar({ filters, setFilters }) {
  const CATEGORIES = ["Todo", "In Progress", "In Review", "Done"];

  const toggleCategory = (cat) => {
    let updated = [...filters.categories];
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
    } else {
      updated.push(cat);
    }
    setFilters({ ...filters, categories: updated });
  };

  const setTimeFilter = (weeks) => {
    setFilters({ ...filters, timeWindow: weeks });
  };

  const updateSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="filterbar">
      <div className="filter-section">
        <span className="filter-label">Status:</span>
        {CATEGORIES.map((c) => (
          <label key={c} className="filter-option">
            <input
              type="checkbox"
              checked={filters.categories.includes(c)}
              onChange={() => toggleCategory(c)}
            />
            {c}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <span className="filter-label">Time:</span>

        <label className="filter-option">
          <input
            type="radio"
            name="timeFilter"
            checked={filters.timeWindow === 1}
            onChange={() => setTimeFilter(1)}
          />
          1 week
        </label>

        <label className="filter-option">
          <input
            type="radio"
            name="timeFilter"
            checked={filters.timeWindow === 2}
            onChange={() => setTimeFilter(2)}
          />
          2 weeks
        </label>

        <label className="filter-option">
          <input
            type="radio"
            name="timeFilter"
            checked={filters.timeWindow === 3}
            onChange={() => setTimeFilter(3)}
          />
          3 weeks
        </label>

        <label className="filter-option">
          <input
            type="radio"
            name="timeFilter"
            checked={filters.timeWindow === null}
            onChange={() => setTimeFilter(null)}
          />
          All
        </label>
      </div>

      <div className="filter-section">
        <span className="filter-label">Search:</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search by task title..."
          value={filters.search}
          onChange={updateSearch}
        />
      </div>
    </div>
  );
}
