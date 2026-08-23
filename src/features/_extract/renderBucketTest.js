function renderBucketTest() {
  const gal    = parseFloat(document.getElementById('bkt-gal').value)    || 0;
  const rate   = parseFloat(document.getElementById('bkt-rate').value)   || 0;
  const gpt    = parseFloat(document.getElementById('bkt-gpt').value)    || 0;
  const actual = parseFloat(document.getElementById('bkt-actual').value) || 1;
  const denom  = rate * 0.042 * gpt;
  const estSec = denom > 0 ? 60 * gal / denom : 0;
  const errorPct = actual > 0 ? ((estSec/actual) - 1) * 100 : 0;
  const newFine  = actual > 0 ? estSec/actual : 1;
  document.getElementById('bkt-est').textContent     = estSec.toFixed(1);
  document.getElementById('bkt-error').textContent   = errorPct.toFixed(1) + '%';
  document.getElementById('bkt-newfine').textContent = newFine.toFixed(2);
}