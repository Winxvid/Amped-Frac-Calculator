function renderWellCap() {
  const c = document.getElementById('wellcap-rows');
  if (!c) return;
  S.wellCapRows.forEach(wellCapNormalizeRow);
  const rows = S.wellCapRows;
  c.innerHTML = rows.length === 0
    ? '<div class="wellcap-empty">No sections yet. Tap “+ Add Section” to build the well string.</div>'
    : rows.map((row, i) => wellCapRowHTML(row, i)).join('');
  wellCapUpdateTotals();
}