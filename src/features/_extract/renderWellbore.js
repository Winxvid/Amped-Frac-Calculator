function renderWellbore() {
  const tvd     = parseFloat(document.getElementById('wb-tvd').value)     || 0;
  const perf    = parseFloat(document.getElementById('wb-perf').value)    || 0;
  const dens    = parseFloat(document.getElementById('wb-density').value) || 8.33;
  const cid     = parseFloat(document.getElementById('wb-id').value)      || 4.778;
  const treat   = parseFloat(document.getElementById('wb-treating').value)|| 0;
  const frict   = parseFloat(document.getElementById('wb-friction').value)|| 0;
  const tubType = document.getElementById('wb-tubular').value;
  const tub     = TUBULAR_DATA.find(t=>t.type===tubType) || TUBULAR_DATA[7];

  const hydro   = F.hydrostatic(dens, tvd);
  const flush   = F.flushVol(perf, cid);
  const bhp     = F.bhp(treat, hydro, frict);

  document.getElementById('wb-hydro').textContent    = Math.round(hydro).toLocaleString();
  document.getElementById('wb-capacity').textContent = flush.toFixed(2);
  document.getElementById('wb-factor').textContent   = tub.factor.toFixed(4);
  document.getElementById('wb-bhp').textContent      = Math.round(bhp).toLocaleString();

  // Tubular Capacity, Displacement & Metal Volume
  const tOd   = parseFloat(document.getElementById('tubular-od')?.value) || 0;
  const tId   = parseFloat(document.getElementById('tubular-id')?.value) || 0;
  const tLen  = parseFloat(document.getElementById('tubular-length')?.value) || 0;
  const tCapBbl = tId > 0 ? Math.pow(tId, 2) / 1029.44 : 0;
  const tCapGal = tId > 0 ? Math.pow(tId, 2) / 24.509 : 0;
  const tDispBbl = (tOd > tId) ? (Math.pow(tOd, 2) - Math.pow(tId, 2)) / 1029.44 : 0;
  const tTotCap = tCapBbl * tLen;
  const tTotDisp = tDispBbl * tLen;

  if (document.getElementById('tubular-capbblft')) document.getElementById('tubular-capbblft').textContent = tCapBbl.toFixed(4);
  if (document.getElementById('tubular-capgalft')) document.getElementById('tubular-capgalft').textContent = tCapGal.toFixed(3);
  if (document.getElementById('tubular-dispbblft')) document.getElementById('tubular-dispbblft').textContent = tDispBbl.toFixed(4);
  if (document.getElementById('tubular-totcap')) document.getElementById('tubular-totcap').textContent = tTotCap.toFixed(1);
  if (document.getElementById('tubular-totdisp')) document.getElementById('tubular-totdisp').textContent = tTotDisp.toFixed(1);

  // Equivalent Mud Weight (EMW) & Surface Pressure
  const emwStp    = parseFloat(document.getElementById('emw-stp')?.value) || 0;
  const emwTvd    = parseFloat(document.getElementById('emw-tvd')?.value) || 1;
  const emwDens   = parseFloat(document.getElementById('emw-density')?.value) || 8.33;
  const emwTarget = parseFloat(document.getElementById('emw-target')?.value) || 0;
  const emwHydro  = emwDens * emwTvd * 0.05195;
  const emwGrad   = emwDens * 0.05195;
  const emwCalc   = emwDens + (emwTvd > 0 ? emwStp / (emwTvd * 0.05195) : 0);
  const emwReqStp = (emwTarget - emwDens) * emwTvd * 0.05195;

  if (document.getElementById('emw-hydro')) document.getElementById('emw-hydro').textContent = Math.round(emwHydro).toLocaleString();
  if (document.getElementById('emw-grad')) document.getElementById('emw-grad').textContent = emwGrad.toFixed(3);
  if (document.getElementById('emw-calculated')) document.getElementById('emw-calculated').textContent = emwCalc.toFixed(2);
  if (document.getElementById('emw-reqstp')) document.getElementById('emw-reqstp').textContent = Math.round(emwReqStp).toLocaleString();

  // Overflush / Underflush & Top of Sand / PBTD
  const flPerf   = parseFloat(document.getElementById('flushcalc-perfdepth')?.value) || 0;
  const flCap    = parseFloat(document.getElementById('flushcalc-capbblft')?.value) || 0;
  const flPumped = parseFloat(document.getElementById('flushcalc-pumpedflush')?.value) || 0;
  const flSand   = parseFloat(document.getElementById('flushcalc-sandlbs')?.value) || 0;
  const flBulk   = parseFloat(document.getElementById('flushcalc-bulkdens')?.value) || 105;
  const flReq    = flPerf * flCap;
  const flDiff   = flPumped - flReq;
  const flSandHeight = (flCap > 0 && flBulk > 0) ? flSand / (flCap * 5.61458 * flBulk) : 0;
  const flTopSand   = flPerf - flSandHeight;

  if (document.getElementById('flushcalc-reqflush')) document.getElementById('flushcalc-reqflush').textContent = flReq.toFixed(1);
  if (document.getElementById('flushcalc-variance')) {
    const varTxt = flDiff >= 0 ? `+${flDiff.toFixed(1)} BBL (Overflush)` : `${flDiff.toFixed(1)} BBL (Underflush)`;
    document.getElementById('flushcalc-variance').textContent = varTxt;
    document.getElementById('flushcalc-variance').style.color = flDiff >= 0 ? 'var(--brand)' : 'var(--yellow)';
  }
  if (document.getElementById('flushcalc-sandheight')) document.getElementById('flushcalc-sandheight').textContent = flSandHeight.toFixed(1);
  if (document.getElementById('flushcalc-topofsand')) document.getElementById('flushcalc-topofsand').textContent = flTopSand.toFixed(1);

  // Perforation Pressure Drop & Active Perfs Solver
  const pfRate  = parseFloat(document.getElementById('perfcalc-rate')?.value) || 0;
  const pfDens  = parseFloat(document.getElementById('perfcalc-dens')?.value) || 8.33;
  const pfN     = parseFloat(document.getElementById('perfcalc-nperfs')?.value) || 1;
  const pfDiam  = parseFloat(document.getElementById('perfcalc-diam')?.value) || 0.42;
  const pfCd    = parseFloat(document.getElementById('perfcalc-cd')?.value) || 0.95;
  const pfMeas  = parseFloat(document.getElementById('perfcalc-measfrict')?.value) || 0;

  const pfDrop  = (pfN > 0 && pfDiam > 0 && pfCd > 0) ? (0.2369 * pfDens * Math.pow(pfRate, 2)) / (Math.pow(pfN, 2) * Math.pow(pfDiam, 4) * Math.pow(pfCd, 2)) : 0;
  const pfSolvedN = (pfMeas > 0 && pfDiam > 0 && pfCd > 0) ? Math.sqrt((0.2369 * pfDens * Math.pow(pfRate, 2)) / (pfMeas * Math.pow(pfDiam, 4) * Math.pow(pfCd, 2))) : 0;

  if (document.getElementById('perfcalc-outdrop')) document.getElementById('perfcalc-outdrop').textContent = Math.round(pfDrop).toLocaleString();
  if (document.getElementById('perfcalc-solvedn')) document.getElementById('perfcalc-solvedn').textContent = pfSolvedN.toFixed(1);

  // Surface Treating Pressure (STP) Predictor
  const stpBhp   = parseFloat(document.getElementById('stp-bhp')?.value) || 0;
  const stpDens  = parseFloat(document.getElementById('stp-density')?.value) || 8.33;
  const stpTvd   = parseFloat(document.getElementById('stp-tvd')?.value) || 0;
  const stpPipe  = parseFloat(document.getElementById('stp-pipefrict')?.value) || 0;
  const stpPerf  = parseFloat(document.getElementById('stp-perffrict')?.value) || 0;

  const stpHydro = stpDens * stpTvd * 0.05195;
  const stpCalc  = stpBhp - stpHydro + stpPipe + stpPerf;

  if (document.getElementById('stp-hydro')) document.getElementById('stp-hydro').textContent = Math.round(stpHydro).toLocaleString();
  if (document.getElementById('stp-calculated')) document.getElementById('stp-calculated').textContent = Math.round(stpCalc).toLocaleString();

  // Friction Loss Breakdown
  const frRate  = parseFloat(document.getElementById('frict-rate')?.value)  || 0;
  const frDens  = parseFloat(document.getElementById('frict-dens')?.value)  || 8.33;
  const frDepth = parseFloat(document.getElementById('frict-depth')?.value) || 0;
  const frId    = parseFloat(document.getElementById('frict-id')?.value)    || 4.778;
  const frFPipe = parseFloat(document.getElementById('frict-fpipe')?.value) || 0.00018;
  const frFPerf = parseFloat(document.getElementById('frict-fperf')?.value) || 0.08;

  const pipeFrict = frFPipe * (frDens * Math.pow(frRate,2) / Math.pow(frId,4)) * (frDepth / frId);
  const perfFrict = frFPerf * Math.pow(frRate,2);
  const totalFrict = pipeFrict + perfFrict;

  if (document.getElementById('frict-pipeval')) document.getElementById('frict-pipeval').textContent = Math.round(pipeFrict).toLocaleString();
  if (document.getElementById('frict-perfval')) document.getElementById('frict-perfval').textContent = Math.round(perfFrict).toLocaleString();
  if (document.getElementById('frict-totalval')) document.getElementById('frict-totalval').textContent = Math.round(totalFrict).toLocaleString();

  // Back-calculate f_pipe
  const frMeasPipe = parseFloat(document.getElementById('frict-measuredpipe')?.value) || 0;
  const denom = (frDens * Math.pow(frRate,2) / Math.pow(frId,4)) * (frDepth / frId);
  const solvedFPipe = denom > 0 ? frMeasPipe / denom : 0;
  if (document.getElementById('frict-solvedfpipe')) document.getElementById('frict-solvedfpipe').textContent = solvedFPipe.toFixed(6);

  // Well Control & Fracture Pressure
  const wcFormPress = parseFloat(document.getElementById('wellctrl-formpress')?.value) || 0;
  const wcTvd       = parseFloat(document.getElementById('wellctrl-tvd')?.value)       || 1;
  const wcGrad      = parseFloat(document.getElementById('wellctrl-grad')?.value)      || 0.75;

  const killMud  = wcTvd > 0 ? wcFormPress / (wcTvd * 0.05195) : 0;
  const fracPress = wcGrad * wcTvd;
  const reqIsip   = fracPress - (8.33 * wcTvd * 0.05195);

  if (document.getElementById('wellctrl-killmud')) document.getElementById('wellctrl-killmud').textContent = killMud.toFixed(2);
  if (document.getElementById('wellctrl-fracpress')) document.getElementById('wellctrl-fracpress').textContent = Math.round(fracPress).toLocaleString();
  if (document.getElementById('wellctrl-reqisip')) document.getElementById('wellctrl-reqisip').textContent = Math.round(reqIsip).toLocaleString();
}