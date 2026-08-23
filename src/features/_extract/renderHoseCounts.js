function renderHoseCounts() {
  const clean = parseFloat(document.getElementById('hose-clean').value) || 0;
  const dirty = parseFloat(document.getElementById('hose-dirty').value) || 0;
  document.getElementById('hose-suction').textContent   = Math.ceil(clean/10);
  document.getElementById('hose-discharge').textContent = Math.ceil(dirty/15);
}