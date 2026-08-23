function renderMultiTote() {
  const rows = S.multiToteRows;
  const c = document.getElementById('multitote-rows');
  c.innerHTML = rows.length === 0
    ? '<div style="color:var(--text2);text-align:center;padding:14px;font-size:13px;">No totes yet.</div>'
    : rows.map((row,i) => multiToteRowHTML(row,i)).join('');
  const total = rows.reduce((s,r) => s + Math.max(0, (r.strap||0) - (r.bottoms||0)) * (r.factor||0), 0);
  document.getElementById('multitote-total').textContent = total.toFixed(1);
}