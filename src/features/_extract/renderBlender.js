function renderBlender() {
  const th = blThGPM();
  const dv = parseFloat(document.getElementById('bl-desired')?.value) || 0;
  const tt = th > 0 ? (dv/th)*60 : 0;
  if (document.getElementById('bl-th-gpm')) document.getElementById('bl-th-gpm').textContent  = th.toFixed(3);
  if (document.getElementById('bl-th-time')) document.getElementById('bl-th-time').textContent = tt.toFixed(1) + 's';

  // 1. Clean & Slurry Rate Conversion
  const cClean  = parseFloat(document.getElementById('blconv-cleanrate')?.value)  || 0;
  const cSlurry = parseFloat(document.getElementById('blconv-slurryrate')?.value) || 0;
  const cPpa    = parseFloat(document.getElementById('blconv-ppa')?.value)        || 0;
  const cSg     = parseFloat(document.getElementById('blconv-sg')?.value)         || 2.65;

  const avf   = cSg > 0 ? 1 / (8.34 * cSg) : 0.0452;
  const slurryYield = (cPpa * avf) + 1;
  const cfr   = slurryYield > 0 ? 1 / slurryYield : 1;
  const calcSlurry = cClean * slurryYield;
  const calcClean  = cSlurry * cfr;

  if (document.getElementById('blconv-avf')) document.getElementById('blconv-avf').textContent = avf.toFixed(4);
  if (document.getElementById('blconv-yield')) document.getElementById('blconv-yield').textContent = slurryYield.toFixed(4);
  if (document.getElementById('blconv-cfr')) document.getElementById('blconv-cfr').textContent = cfr.toFixed(4);
  if (document.getElementById('blconv-outslurry')) document.getElementById('blconv-outslurry').textContent = calcSlurry.toFixed(1);
  if (document.getElementById('blconv-outclean')) document.getElementById('blconv-outclean').textContent = calcClean.toFixed(1);

  // 2. Screw Concentration & Total Auger RPM
  const sClean = parseFloat(document.getElementById('blscrew-rate')?.value) || 0;
  const sPpa   = parseFloat(document.getElementById('blscrew-ppa')?.value)  || 0;
  const sPpr   = parseFloat(document.getElementById('blscrew-ppr')?.value)  || 1;
  const sAug1  = parseFloat(document.getElementById('blscrew-aug1')?.value) || 0;
  const sAug2  = parseFloat(document.getElementById('blscrew-aug2')?.value) || 0;
  const sAug3  = parseFloat(document.getElementById('blscrew-aug3')?.value) || 0;

  const reqRpm = sPpr > 0 ? (sClean * sPpa * 42) / sPpr : 0;
  const actRpm = sAug1 + sAug2 + sAug3;
  const screwConc = sClean > 0 ? (actRpm * sPpr) / (sClean * 42) : 0;
  const lbsMin = actRpm * sPpr;
  const propPpm = lbsMin / 3;

  if (document.getElementById('blscrew-reqrpm')) document.getElementById('blscrew-reqrpm').textContent = Math.round(reqRpm).toLocaleString();
  if (document.getElementById('blscrew-actrpm')) document.getElementById('blscrew-actrpm').textContent = Math.round(actRpm).toLocaleString();
  if (document.getElementById('blscrew-outconc')) document.getElementById('blscrew-outconc').textContent = screwConc.toFixed(2);
  if (document.getElementById('blscrew-lbsmin')) document.getElementById('blscrew-lbsmin').textContent = Math.round(lbsMin).toLocaleString();
  if (document.getElementById('blscrew-ppm')) document.getElementById('blscrew-ppm').textContent = propPpm.toFixed(1);

  // 3. Design Clean Rate from Slurry Rate
  const dSlurry = parseFloat(document.getElementById('bldesign-slurryrate')?.value) || 0;
  const dPpa    = parseFloat(document.getElementById('bldesign-ppa')?.value)        || 0;
  const dSg     = parseFloat(document.getElementById('bldesign-sg')?.value)         || 2.65;

  const dDenom = dSg > 0 ? (dPpa / (8.34 * dSg)) + 1 : 1;
  const dClean = dDenom > 0 ? dSlurry / dDenom : 0;

  if (document.getElementById('bldesign-cleanrate')) document.getElementById('bldesign-cleanrate').textContent = dClean.toFixed(1);

  // 4. Split Flow Blender Concentration (CLD)
  const spDesignPpa = parseFloat(document.getElementById('blsplit-designppa')?.value)  || 0;
  const spBlenderR  = parseFloat(document.getElementById('blsplit-blenderrate')?.value) || 1;
  const spTotalR    = parseFloat(document.getElementById('blsplit-totalrate')?.value)   || 1;

  const spRatio     = spTotalR > 0 ? spBlenderR / spTotalR : 1;
  const spBlenderConc = spRatio > 0 ? spDesignPpa / spRatio : 0;

  if (document.getElementById('blsplit-blenderconc')) document.getElementById('blsplit-blenderconc').textContent = spBlenderConc.toFixed(2);

  // 5. Auger PPR & Dry Add Recalibration
  const pAugRad  = parseFloat(document.getElementById('blppr-augerrad')?.value) || 0;
  const pShaftRad= parseFloat(document.getElementById('blppr-shaftrad')?.value) || 0;
  const pPitch   = parseFloat(document.getElementById('blppr-pitch')?.value)    || 0;
  const pBulk    = parseFloat(document.getElementById('blppr-bulkdens')?.value) || 0;

  const theoPpr  = 1.41 * (Math.pow(pAugRad, 2) - Math.pow(pShaftRad, 2)) * pPitch * pBulk / 1728;

  const pOldPpr  = parseFloat(document.getElementById('blppr-oldppr')?.value)   || 0;
  const pActTot  = parseFloat(document.getElementById('blppr-acttotal')?.value) || 0;
  const pDesTot  = parseFloat(document.getElementById('blppr-destotal')?.value) || 1;

  const recalPpr = pDesTot > 0 ? pOldPpr * (pActTot / pDesTot) : pOldPpr;

  if (document.getElementById('blppr-outppr')) document.getElementById('blppr-outppr').textContent = theoPpr.toFixed(2);
  if (document.getElementById('blppr-recalppr')) document.getElementById('blppr-recalppr').textContent = recalPpr.toFixed(2);

  // 6. Metric / Screwless Blender Clean Rate
  const mSlurrym3 = parseFloat(document.getElementById('blmetric-slurrym3')?.value) || 0;
  const mPpakgm3  = parseFloat(document.getElementById('blmetric-ppakgm3')?.value)  || 0;
  const mSg       = parseFloat(document.getElementById('blmetric-sg')?.value)        || 2.65;

  const mDenom    = mSg > 0 ? (mPpakgm3 / (mSg * 999.3524)) + 1 : 1;
  const mCleanm3  = mDenom > 0 ? mSlurrym3 / mDenom : 0;
  const mCleanbpm = mCleanm3 * 6.2898;

  if (document.getElementById('blmetric-cleanm3')) document.getElementById('blmetric-cleanm3').textContent = mCleanm3.toFixed(2);
  if (document.getElementById('blmetric-cleanbpm')) document.getElementById('blmetric-cleanbpm').textContent = mCleanbpm.toFixed(1);
}