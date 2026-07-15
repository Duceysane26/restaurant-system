import React from "react";

export default function MenuFilters({
  search,
  setSearch,
  filterCat,
  setFilterCat,
  categories,
  setPage,
  s,
}) {
  return (
    <div style={s.filters}>
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.search}
          placeholder="Search items..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <select
        style={s.filterSelect}
        value={filterCat}
        onChange={(e) => {
          setFilterCat(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.categoryId} value={c.categoryId}>
            {c.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
}
