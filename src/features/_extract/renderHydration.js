function renderHydration() {
  // —— Rules of Four summary tiles ——
  const rofLga = parseFloat(document.getElementById('rof-lga')?.value) || 0;
  const rofPpt = rofLga * 4;
  if (document.getElementById('rof-ppt-out')) document.getElementById('rof-ppt-out').textContent = rofPpt.toFixed(1);
  if (document.getElementById('rof-visc-out')) document.getElementById('rof-visc-out').textContent = Math.max(0, rofPpt - 4).toFixed(1);

  // —— LGA Rate: GPM = Rate × 0.042 × LGA GPT ——
  const lgaRate = parseFloat(document.getElementById('lga-rate')?.value) || 0;
  const lgaGpt  = parseFloat(document.getElementById('lga-gpt')?.value)  || 0;
  const lgaGpm  = lgaRate * 0.042 * lgaGpt;
  const lgaPpt  = lgaGpt * 4;
  const lgaPpm  = lgaRate * 0.042 * lgaPpt;
  if (document.getElementById('lga-gpm')) document.getElementById('lga-gpm').textContent = lgaGpm.toFixed(2);
  if (document.getElementById('lga-ppt-eq')) document.getElementById('lga-ppt-eq').textContent = lgaPpt.toFixed(1);
  if (document.getElementById('lga-ppm-eq')) document.getElementById('lga-ppm-eq').textContent = lgaPpm.toFixed(1);

  // —— PPM & Guar Auger RPM ——
  const gRate = parseFloat(document.getElementById('guar-rate')?.value) || 0;
  const gPpt  = parseFloat(document.getElementById('guar-ppt')?.value)  || 0;
  const gPpr  = parseFloat(document.getElementById('guar-ppr')?.value)  || 0;
  const gPpm  = gRate * 0.042 * gPpt;
  const gGpm  = gPpm / 4; // LGA gal/min (4 lbs guar per LGA gallon)
  const gRpm  = gPpr > 0 ? gPpm / gPpr : 0;
  if (document.getElementById('guar-ppm')) document.getElementById('guar-ppm').textContent = gPpm.toFixed(1);
  if (document.getElementById('guar-gpm')) document.getElementById('guar-gpm').textContent = gGpm.toFixed(1);
  if (document.getElementById('guar-rpm')) document.getElementById('guar-rpm').textContent = gRpm.toFixed(1);

  // —— Tub Volume & Hydration Time ——
  // Tub Volume = Capacity × Level% / 100
  // Hydration Time = Tub Volume / Job Clean Rate
  const cap   = parseFloat(document.getElementById('tub-cap')?.value) || 0;
  const lv    = parseFloat(document.getElementById('tub-level')?.value) || 0;
  const clean = parseFloat(document.getElementById('tub-cleanrate')?.value) || 0;
  const vol   = cap * (lv / 100);
  const res   = clean > 0 ? vol / clean : null;
  if (document.getElementById('tub-pct-lbl')) document.getElementById('tub-pct-lbl').textContent = `${Math.round(lv)}%`;
  if (document.getElementById('tub-vol')) document.getElementById('tub-vol').textContent = vol.toFixed(1);
  if (document.getElementById('tub-res')) document.getElementById('tub-res').textContent = res !== null ? res.toFixed(1) : '–';

  // —— LGA Needed for Tub ——
  // LGA Needed = Tub Volume × 0.042 × LGA Set Point
  const needVol = parseFloat(document.getElementById('lganeed-vol')?.value) || 0;
  const needGpt = parseFloat(document.getElementById('lganeed-gpt')?.value) || 0;
  const needGal = needVol * 0.042 * needGpt;
  if (document.getElementById('lganeed-gal')) document.getElementById('lganeed-gal').textContent = needGal.toFixed(1);
  if (document.getElementById('lganeed-lbs')) document.getElementById('lganeed-lbs').textContent = (needGal * 4).toFixed(1);

  // —— Gel Used to Visc Up Tub ——
  // Gel Used (lbs) = Tub Volume × 0.042 × PPT
  const vuVol = parseFloat(document.getElementById('viscup-vol')?.value) || 0;
  const vuPpt = parseFloat(document.getElementById('viscup-ppt')?.value) || 0;
  const vuLbs = vuVol * 0.042 * vuPpt;
  if (document.getElementById('viscup-lbs')) document.getElementById('viscup-lbs').textContent = vuLbs.toFixed(1);
  if (document.getElementById('viscup-lga')) document.getElementById('viscup-lga').textContent = (vuLbs / 4).toFixed(1);

  // —— Gel Used to Increase Tub Viscosity ——
  // Gel Used (lbs) = Tub Volume × 0.042 × (Target cp − Current cp)
  const tvVol     = parseFloat(document.getElementById('tubvisc-vol')?.value) || 0;
  const tvCurrent = parseFloat(document.getElementById('tubvisc-current')?.value) || 0;
  const tvTarget  = parseFloat(document.getElementById('tubvisc-target')?.value) || 0;
  const tvDryLbs  = tvVol * 0.042 * (tvTarget - tvCurrent);
  if (document.getElementById('tubvisc-dry')) document.getElementById('tubvisc-dry').textContent = tvDryLbs.toFixed(1);
  if (document.getElementById('tubvisc-gel')) document.getElementById('tubvisc-gel').textContent = (tvDryLbs / 4).toFixed(1);

  // —— Design Gel Used for Stage ——
  // Design Gel (lbs) = Stage Volume × 0.042 × PPT
  const dgBbl = parseFloat(document.getElementById('designgel-bbl')?.value) || 0;
  const dgPpt = parseFloat(document.getElementById('designgel-ppt')?.value) || 0;
  const dgLbs = dgBbl * 0.042 * dgPpt;
  if (document.getElementById('designgel-dry')) document.getElementById('designgel-dry').textContent = dgLbs.toFixed(1);
  if (document.getElementById('designgel-lga')) document.getElementById('designgel-lga').textContent = (dgLbs / 4).toFixed(1);

  // —— LGA Tote Volume = factor × strap ——
  const lgaStrap = parseFloat(document.getElementById('lgatote-strap')?.value) || 0;
  const lgaCap   = parseFloat(document.getElementById('lgatote-cap')?.value) || 0;
  if (document.getElementById('lgatote-gal')) document.getElementById('lgatote-gal').textContent = (lgaStrap * lgaCap).toFixed(1);

  // —— End LGA Tote Volume = Start − LGA Needed ——
  const endCap   = parseFloat(document.getElementById('endlga-cap')?.value) || 0;
  const endStrap = parseFloat(document.getElementById('endlga-startstrap')?.value) || 0;
  const endNeed  = parseFloat(document.getElementById('endlga-needed')?.value) || 0;
  const endVolIn = document.getElementById('endlga-startvol')?.value;
  const startVol = (endVolIn !== '' && endVolIn != null && !isNaN(parseFloat(endVolIn)))
    ? parseFloat(endVolIn)
    : endStrap * endCap;
  const endVol   = startVol - endNeed;
  const endStrapOut = endCap > 0 ? endVol / endCap : 0;
  if (document.getElementById('endlga-start-out')) document.getElementById('endlga-start-out').textContent = startVol.toFixed(1);
  if (document.getElementById('endlga-endvol')) document.getElementById('endlga-endvol').textContent = endVol.toFixed(1);
  if (document.getElementById('endlga-endstrap')) document.getElementById('endlga-endstrap').textContent = endStrapOut.toFixed(1);

  // —— Mid-Stage Tote Swap Predictor ——
  const ts1Start = parseFloat(document.getElementById('toteswap-t1start')?.value) || 0;
  const ts1Swap  = parseFloat(document.getElementById('toteswap-t1swap')?.value) || 0;
  const ts2Start = parseFloat(document.getElementById('toteswap-t2start')?.value) || 0;
  const tsTotal  = parseFloat(document.getElementById('toteswap-totalgel')?.value) || 0;
  const tsFac    = parseFloat(document.getElementById('toteswap-factor')?.value) || 1;
  const ts1Gel   = Math.max(0, ts1Start - ts1Swap) * tsFac;
  const ts2Gel   = Math.max(0, tsTotal - ts1Gel);
  const ts2End   = tsFac > 0 ? Math.max(0, ts2Start - (ts2Gel / tsFac)) : 0;
  if (document.getElementById('toteswap-t1gel')) document.getElementById('toteswap-t1gel').textContent = ts1Gel.toFixed(1);
  if (document.getElementById('toteswap-t2end')) document.getElementById('toteswap-t2end').textContent = ts2End.toFixed(1);
}