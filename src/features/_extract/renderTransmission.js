function renderTransmission() {
  const type = document.getElementById('trans-type').value;
  const gear = parseInt(document.getElementById('trans-gear').value);
  const engineRpm = parseFloat(document.getElementById('trans-engine').value) || 0;
  const ratio = (GEAR_RATIOS[type] && GEAR_RATIOS[type][gear]) || 1;
  document.getElementById('trans-output').textContent = Math.round(engineRpm/ratio).toLocaleString();
}