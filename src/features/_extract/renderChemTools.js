function renderChemTools() {
  // Chemical Used from Straps
  const cuStart = parseFloat(document.getElementById('chemused-start').value) || 0;
  const cuEnd   = parseFloat(document.getElementById('chemused-end').value)   || 0;
  document.getElementById('chemused-result').textContent = Math.max(0, cuStart - cuEnd).toFixed(1);

  // Chemical Stage Variance
  const cvPumped   = parseFloat(document.getElementById('chemvar-pumped').value)   || 0;
  const cvDesigned = parseFloat(document.getElementById('chemvar-designed').value) || 0;
  const cvPct  = cvDesigned > 0 ? (cvPumped/cvDesigned)*100 : 0;
  const cvDiff = cvPumped - cvDesigned;
  document.getElementById('chemvar-pct').textContent = cvPct.toFixed(1) + '%';
  const statusEl = document.getElementById('chemvar-status');
  if (cvDiff > 0)      { statusEl.textContent = `Over by ${cvDiff.toFixed(1)} gal`;  statusEl.style.color = 'var(--yellow)'; }
  else if (cvDiff < 0) { statusEl.textContent = `Under by ${Math.abs(cvDiff).toFixed(1)} gal`; statusEl.style.color = 'var(--brand)'; }
  else                 { statusEl.textContent = 'Exact match'; statusEl.style.color = 'var(--blue)'; }

  // GPT <-> GPM
  const ggRate = parseFloat(document.getElementById('gptgpm-rate').value) || 0;
  const ggGpt  = parseFloat(document.getElementById('gptgpm-gpt').value)  || 0;
  const ggGpm  = F.gpm(ggRate, ggGpt);
  document.getElementById('gptgpm-gpm').textContent  = ggGpm.toFixed(2);
  document.getElementById('gptgpm-conc').textContent = ggGpt.toFixed(2);

  // Acid Dilution
  const adVol    = parseFloat(document.getElementById('acidd-vol').value)       || 0;
  const adRawPct = parseFloat(document.getElementById('acidd-rawpct').value)    || 0;
  const adTgtPct = parseFloat(document.getElementById('acidd-targetpct').value) || 0;
  const adDens   = parseFloat(document.getElementById('acidd-density').value)   || 8.34;
  const adDilute = adVol * ((adDens/8.34) * (adRawPct - adTgtPct) + 1);
  document.getElementById('acidd-dilutevol').textContent = adDilute.toFixed(1);
  document.getElementById('acidd-watervol').textContent  = Math.max(0, adDilute - adVol).toFixed(1);

  // Buffer Needed
  const bufBbl = parseFloat(document.getElementById('buffer-bbl').value) || 0;
  const bufGpt = parseFloat(document.getElementById('buffer-gpt').value) || 0;
  document.getElementById('buffer-result').textContent = (bufBbl * 0.042 * bufGpt).toFixed(2);

  // Tote Volume from Strap
  const toteStrap   = parseFloat(document.getElementById('tote-strap').value)   || 0;
  const toteFactor   = parseFloat(document.getElementById('tote-type').value)    || TOTE_TYPES[0].factor;
  const toteBottoms = parseFloat(document.getElementById('tote-bottoms').value) || 0;
  document.getElementById('tote-accessible').textContent = Math.max(0, (toteStrap - toteBottoms) * toteFactor).toFixed(1);
  document.getElementById('tote-total').textContent      = (toteStrap * toteFactor).toFixed(1);

  // Ending Strap Predictor
  const esClean = parseFloat(document.getElementById('endstrap-clean').value) || 0;
  const esGpt   = parseFloat(document.getElementById('endstrap-gpt').value)   || 0;
  const esStart = parseFloat(document.getElementById('endstrap-start').value) || 0;
  const esFactor = parseFloat(document.getElementById('endstrap-type').value)  || TOTE_TYPES[0].factor;
  const esFrNeeded = esClean * 0.042 * esGpt;
  const esStartGal = esStart * esFactor;
  const esEndGal   = Math.max(0, esStartGal - esFrNeeded);
  document.getElementById('endstrap-fr').textContent     = Math.round(esFrNeeded).toLocaleString();
  document.getElementById('endstrap-ending').textContent = (esEndGal / esFactor).toFixed(1);

  // Tote Refill Count
  const trClean = parseFloat(document.getElementById('toterefill-clean')?.value) || 0;
  const trGpt   = parseFloat(document.getElementById('toterefill-gpt')?.value)   || 0;
  const trFill  = parseFloat(document.getElementById('toterefill-fill')?.value)  || 0;
  const trBot   = parseFloat(document.getElementById('toterefill-bottoms')?.value) || 0;
  const trFac   = parseFloat(document.getElementById('toterefill-factor')?.value) || 1;
  const trNeeded = trClean * 0.042 * trGpt;
  const trAccess = Math.max(0, trFill - trBot) * trFac;
  const trCount  = trAccess > 0 ? Math.ceil(trNeeded / trAccess) : 0;
  if (document.getElementById('toterefill-needed')) document.getElementById('toterefill-needed').textContent = Math.round(trNeeded).toLocaleString();
  if (document.getElementById('toterefill-accessible')) document.getElementById('toterefill-accessible').textContent = trAccess.toFixed(1);
  if (document.getElementById('toterefill-count')) document.getElementById('toterefill-count').textContent = trCount;

  // Chemical Setpoint & Clean Volume Back-Calculator
  const ccGpm       = parseFloat(document.getElementById('chemcalc-gpm')?.value)       || 0;
  const ccBpm       = parseFloat(document.getElementById('chemcalc-bpm')?.value)       || 0;
  const ccTotChem   = parseFloat(document.getElementById('chemcalc-totchem')?.value)   || 0;
  const ccTargetGpt = parseFloat(document.getElementById('chemcalc-targetgpt')?.value) || 0;

  const ccOutGpt      = ccBpm > 0 ? ccGpm / ccBpm : 0;
  const ccOutCleanBbl = ccTargetGpt > 0 ? (ccTotChem / (ccTargetGpt * 0.042)) : 0;

  if (document.getElementById('chemcalc-outgpt')) document.getElementById('chemcalc-outgpt').textContent = ccOutGpt.toFixed(2);
  if (document.getElementById('chemcalc-outcleanbbl')) document.getElementById('chemcalc-outcleanbbl').textContent = Math.round(ccOutCleanBbl).toLocaleString();

  // Liquid vs Dry Concentration Converter (GPT ↔ PPT)
  const gpGpt    = parseFloat(document.getElementById('gptppt-gpt')?.value)       || 0;
  const gpDens   = parseFloat(document.getElementById('gptppt-density')?.value)   || 0;
  const gpActive = parseFloat(document.getElementById('gptppt-activepct')?.value) || 100;
  const gpInPpt  = parseFloat(document.getElementById('gptppt-inppt')?.value)     || 0;

  const gpOutPpt     = gpGpt * gpDens * (gpActive / 100);
  const gpActiveDens = gpDens * (gpActive / 100);
  const gpOutBackGpt = gpActiveDens > 0 ? gpInPpt / gpActiveDens : 0;

  if (document.getElementById('gptppt-outppt')) document.getElementById('gptppt-outppt').textContent = gpOutPpt.toFixed(1);
  if (document.getElementById('gptppt-outbackgpt')) document.getElementById('gptppt-outbackgpt').textContent = gpOutBackGpt.toFixed(2);

  // Strap Rate (IN/HR) & Chemical Flow Rate
  const srInHr     = parseFloat(document.getElementById('straprate-inhr')?.value)     || 0;
  const srFactor   = parseFloat(document.getElementById('straprate-factor')?.value)   || 0;
  const srCleanBpm = parseFloat(document.getElementById('straprate-cleanbpm')?.value) || 0;

  const srOutGpm = (srInHr * srFactor) / 60;
  const srOutGpt = srCleanBpm > 0 ? srOutGpm / srCleanBpm : 0;

  if (document.getElementById('straprate-outgpm')) document.getElementById('straprate-outgpm').textContent = srOutGpm.toFixed(2);
  if (document.getElementById('straprate-outgpt')) document.getElementById('straprate-outgpt').textContent = srOutGpt.toFixed(3);

  // Chemical Specific Gravity (SG) & Tote Weight
  const csgSg       = parseFloat(document.getElementById('chemsg-sg')?.value)       || 0;
  const csgVol      = parseFloat(document.getElementById('chemsg-vol')?.value)      || 0;
  const csgWaterPpg = parseFloat(document.getElementById('chemsg-waterppg')?.value) || 8.34;

  const csgOutPpg = csgSg * csgWaterPpg;
  const csgOutLbs = csgVol * csgOutPpg;

  if (document.getElementById('chemsg-outppg')) document.getElementById('chemsg-outppg').textContent = csgOutPpg.toFixed(2);
  if (document.getElementById('chemsg-outlbs')) document.getElementById('chemsg-outlbs').textContent = Math.round(csgOutLbs).toLocaleString();

  renderMultiTote();
}