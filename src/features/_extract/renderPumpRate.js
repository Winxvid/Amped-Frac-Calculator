function renderPumpRate() {
  const type = document.getElementById('pumprate-type').value;
  const eff  = parseFloat(document.getElementById('pumprate-eff').value) || 100;
  const peRpm = parseFloat(document.getElementById('pumprate-pe').value)  || 0;
  const spec = PUMP_SPECS[type] || PUMP_SPECS['SPM_TWS_2250'];
  const rate = (eff/100) * spec.bblPerRev * peRpm;
  document.getElementById('pumprate-bpm').textContent = rate.toFixed(1);
  document.getElementById('pumprate-psi').textContent = spec.maxPsi.toLocaleString();
}