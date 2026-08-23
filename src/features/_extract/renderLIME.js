function renderLIME() {
  const sc = parseFloat(document.getElementById('lime-scale').value) || 1;
  const fn = parseFloat(document.getElementById('lime-fine').value)  || 1;
  document.getElementById('lime-mult').textContent = (sc*fn).toFixed(3);

  const pv = document.getElementById('lime-profile').value;
  const isC = pv === 'custom';
  document.getElementById('lime-custom-wrap').classList.toggle('hidden', !isC);
  const k = isC ? (parseFloat(document.getElementById('lime-k-custom').value)||850) : parseFloat(pv);
  document.getElementById('lime-k-disp').textContent = k.toFixed(0);

  const hz  = parseFloat(document.getElementById('lime-freq').value) || 0;
  const gpm = (hz / k) * 60;
  document.getElementById('lime-gpm').textContent = gpm.toFixed(2);

  // Pressure Transducer Dual Converter
  const trRating = parseFloat(document.getElementById('transducer-rating')?.value) || 15000;
  const trInPsi  = parseFloat(document.getElementById('transducer-inputpsi')?.value) || 0;
  const trInMa   = parseFloat(document.getElementById('transducer-inputma')?.value)  || 4;
  const trOutMa  = (trInPsi / trRating) * 16 + 4;
  const trOutPsi = Math.max(0, (trInMa - 4) / 16) * trRating;
  if (document.getElementById('transducer-outma')) document.getElementById('transducer-outma').textContent = trOutMa.toFixed(2);
  if (document.getElementById('transducer-outpsi')) document.getElementById('transducer-outpsi').textContent = Math.round(trOutPsi).toLocaleString();

  // Frequency & Pinion Speed Calculator
  const fcHz     = parseFloat(document.getElementById('freqcalc-hz')?.value)    || 0;
  const fcTeeth  = parseFloat(document.getElementById('freqcalc-teeth')?.value) || 60;
  const fcRatio  = parseFloat(document.getElementById('freqcalc-ratio')?.value) || 1;
  const fcPinion = fcTeeth > 0 ? (fcHz * 60) / fcTeeth : 0;
  const fcEngine = fcPinion * fcRatio;
  if (document.getElementById('freqcalc-pinion')) document.getElementById('freqcalc-pinion').textContent = Math.round(fcPinion).toLocaleString();
  if (document.getElementById('freqcalc-engine')) document.getElementById('freqcalc-engine').textContent = Math.round(fcEngine).toLocaleString();

  // K-Factor Recalibration
  const krOld   = parseFloat(document.getElementById('krecal-old')?.value)   || 0;
  const krMicro = parseFloat(document.getElementById('krecal-micro')?.value) || 0;
  const krMag   = parseFloat(document.getElementById('krecal-mag')?.value)   || 1;
  const krNew   = krMag > 0 ? krOld * (krMicro / krMag) : krOld;
  if (document.getElementById('krecal-new')) document.getElementById('krecal-new').textContent = krNew.toFixed(1);
}