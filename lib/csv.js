// Convert rows to CSV, quoting cells when required by RFC-style CSV rules.
export function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function csvForRows(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
}

export function downloadCsv(filename, rows) {
  if (typeof window === "undefined") return;
  const blob = new Blob(["\uFEFF", csvForRows(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
