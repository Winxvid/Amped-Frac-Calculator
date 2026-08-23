function renderHP() {
  const rate       = parseFloat(document.getElementById('hp-rate').value)  || 0;
  const psi        = parseFloat(document.getElementById('hp-psi').value)   || 0;
  const pumps      = parseInt(document.getElementById('hp-pumps').value)   || 1;
  const totPumps   = parseInt(document.getElementById('hp-totalpumps')?.value) || pumps;
  const hpRating   = parseFloat(document.getElementById('hp-rating')?.value)   || 2500;
  const mechEff    = parseFloat(document.getElementById('hp-mecheff')?.value)  || 90;

  S.cleanRate = rate;
  const total = F.hhp(rate, psi);
  const perP  = pumps > 0 ? total/pumps : 0;
  const locAvailHhp = totPumps * hpRating;
  const activeFleetCap = pumps * hpRating;
  const activeLoad = activeFleetCap > 0 ? (total / activeFleetCap) * 100 : 0;
  const totalLoad  = locAvailHhp > 0 ? (total / locAvailHhp) * 100 : 0;
  const reqBhp     = (mechEff > 0) ? total / (mechEff / 100) : total;

  document.getElementById('hp-total').textContent    = F.c(total);
  document.getElementById('hp-rate-lbl').textContent = `Based on ${rate.toFixed(1)} BPM load`;
  if (document.getElementById('hp-per')) document.getElementById('hp-per').textContent = F.c(perP);
  if (document.getElementById('hp-reqbhp')) document.getElementById('hp-reqbhp').textContent = F.c(reqBhp);
  if (document.getElementById('hp-locavailable')) document.getElementById('hp-locavailable').textContent = F.c(locAvailHhp);
  if (document.getElementById('hp-activeload')) document.getElementById('hp-activeload').textContent = activeLoad.toFixed(1) + '%';
  if (document.getElementById('hp-totalload')) document.getElementById('hp-totalload').textContent = totalLoad.toFixed(1) + '%';

  // Engine Torque ↔ HP
  const tRpm  = parseFloat(document.getElementById('torque-rpm')?.value)  || 0;
  const tLbFt = parseFloat(document.getElementById('torque-lbft')?.value) || 0;
  const tBhp  = tRpm > 0 ? (tLbFt * tRpm) / 5252 : 0;
  if (document.getElementById('torque-outbhp')) document.getElementById('torque-outbhp').textContent = Math.round(tBhp).toLocaleString();

  const tInHp   = parseFloat(document.getElementById('torque-inputhp')?.value) || 0;
  const tOutLbFt = tRpm > 0 ? (tInHp * 5252) / tRpm : 0;
  if (document.getElementById('torque-outlbft')) document.getElementById('torque-outlbft').textContent = Math.round(tOutLbFt).toLocaleString();

  // Pump Displacement & Crank Speed
  const pdBore    = parseFloat(document.getElementById('pumpdisp-bore')?.value)     || 4.5;
  const pdStroke  = parseFloat(document.getElementById('pumpdisp-stroke')?.value)   || 8;
  const pdPlungers= parseInt(document.getElementById('pumpdisp-plungers')?.value)   || 3;
  const pdPinion  = parseFloat(document.getElementById('pumpdisp-pinion')?.value)   || 0;
  const pdRatio   = parseFloat(document.getElementById('pumpdisp-ratio')?.value)    || 6.353;
  const pdEff     = parseFloat(document.getElementById('pumpdisp-eff')?.value)      || 95;

  const bblPerRev = pdPlungers * (Math.PI * Math.pow(pdBore, 2) * pdStroke / 38808);
  const crankSpeed = pdRatio > 0 ? pdPinion / pdRatio : 0;
  const pumpBpm   = (pdEff / 100) * bblPerRev * crankSpeed;

  if (document.getElementById('pumpdisp-bblrev')) document.getElementById('pumpdisp-bblrev').textContent = bblPerRev.toFixed(4);
  if (document.getElementById('pumpdisp-crank')) document.getElementById('pumpdisp-crank').textContent = crankSpeed.toFixed(1);
  if (document.getElementById('pumpdisp-bpm')) document.getElementById('pumpdisp-bpm').textContent = pumpBpm.toFixed(1);

  // Iron Rate Limit & Max Pressure
  const ilId   = parseFloat(document.getElementById('ironlim-id')?.value)   || 3.0;
  const ilHhp  = parseFloat(document.getElementById('ironlim-hhp')?.value)  || 0;
  const ilRate = parseFloat(document.getElementById('ironlim-rate')?.value) || 1;

  const maxRateLine = 2 * Math.pow(ilId, 2);
  const maxPsiAtRate = ilRate > 0 ? (ilHhp * 40.8) / ilRate : 0;

  if (document.getElementById('ironlim-maxrate')) document.getElementById('ironlim-maxrate').textContent = maxRateLine.toFixed(1);
  if (document.getElementById('ironlim-maxpsi')) document.getElementById('ironlim-maxpsi').textContent = Math.round(maxPsiAtRate).toLocaleString();

  updateGORange();
  // Sync with chem/hydration
  document.getElementById('ch-rate').value = rate;
  renderChem();
  renderHydration();
}