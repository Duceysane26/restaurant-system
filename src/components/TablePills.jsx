import React from "react";

export default function TablePills({
  filter,
  setFilter,
  statuses,
  statusCfg,
  all,
  setPage,
  s,
}) {
  return (
    <div style={s.pills}>
      {["", ...statuses].map((st) => (
        <button
          key={st}
          onClick={() => {
            setFilter(st);
            setPage(1);
          }}
          style={{ ...s.pill, ...(filter === st ? s.pillActive : {}) }}
        >
          {st ? statusCfg[st].icon + " " + st : "All"} (
          {st === "" ? all.length : all.filter((t) => t.status === st).length})
        </button>
      ))}
    </div>
  );
}
