import { useState, useMemo } from "react";

export function DataTable({ columns, rows }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const lower = searchTerm.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col] ?? "").toLowerCase().includes(lower))
    );
  }, [rows, columns, searchTerm]);

  if (!columns?.length || !rows?.length) return null;

  const visible = filteredRows.slice(0, 100);

  return (
    <div className="datatable-wrapper">
      {/* Search bar */}
      <div className="datatable-search-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="datatable-search"
            placeholder="Search across all columns…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <span className="search-count">
            {filteredRows.length.toLocaleString("en-IN")} result{filteredRows.length !== 1 ? "s" : ""}
          </span>
        )}
        {!searchTerm && (
          <span className="search-count">
            {rows.length.toLocaleString("en-IN")} total rows
          </span>
        )}
      </div>

      {/* Table */}
      <div className="datatable-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>{String(row[col] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRows.length > 100 && (
          <div className="datatable-footer">
            Showing first 100 of {filteredRows.length.toLocaleString("en-IN")} rows
            {!searchTerm && " — ask a question to query the full dataset"}
          </div>
        )}

        {filteredRows.length === 0 && searchTerm && (
          <div className="datatable-empty">
            No rows match "<strong>{searchTerm}</strong>"
          </div>
        )}
      </div>
    </div>
  );
}
