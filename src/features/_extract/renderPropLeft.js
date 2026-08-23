function renderPropLeft() {
  const slurry = parseFloat(document.getElementById('pl-slurry').value) || 0;
  const conc   = parseFloat(document.getElementById('pl-conc').value)   || 0;
  const sg     = parseFloat(document.getElementById('pl-sg').value)     || 2.65;
  const left = (conc + 1) > 0 ? (slurry * conc * 42) / ((conc + 1) * (sg * 8.33)) : 0;
  document.getElementById('pl-result').textContent = Math.round(left).toLocaleString();
}