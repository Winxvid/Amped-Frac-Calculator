function renderAnalogScaled() {
  const minS = parseFloat(document.getElementById('analog-min').value) || 0;
  const maxS = parseFloat(document.getElementById('analog-max').value) || 750;
  const raw  = parseFloat(document.getElementById('analog-raw').value)  || 4;
  const fine = parseFloat(document.getElementById('analog-fine').value) || 1.0;
  const minMa = 4, maxMa = 20;
  const scaled = ((maxS - minS) / (maxMa - minMa)) * (raw - minMa) + minS;
  document.getElementById('analog-result').textContent = (scaled * fine).toFixed(1);
}