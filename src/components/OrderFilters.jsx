import React from "react";

export default function OrderFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  statusCfg,
  setPage,
  s,
}) {
  return (
    <div style={s.filters}>
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.search}
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <select
        style={s.filterSelect}
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Statuses</option>
        {Object.keys(statusCfg).map((st) => (
          <option key={st} value={st}>
            {statusCfg[st].icon} {st}
          </option>
        ))}
      </select>
    </div>
  );
}
