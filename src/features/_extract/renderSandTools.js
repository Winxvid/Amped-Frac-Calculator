function renderSandTools() {
  // Bulk Density Calculator
  const bMass = parseFloat(document.getElementById('bulkcalc-mass')?.value) || 0;
  const bVol  = parseFloat(document.getElementById('bulkcalc-vol')?.value)  || 0;
  const bRes  = bVol > 0 ? bMass / bVol : 0;
  if (document.getElementById('bulkcalc-result')) {
    document.getElementById('bulkcalc-result').textContent = bRes.toFixed(2);
  }

  // Render Proppant Table
  const propTbody = document.getElementById('proppant-tbody');
  if (propTbody) {
    propTbody.innerHTML = PROPPANT_DATA.map(p => `
      <tr>
        <td style="padding:8px 4px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);">${p.type}</td>
        <td class="tbl-right" style="padding:8px 4px;font-size:13px;font-weight:700;color:var(--brand);border-bottom:1px solid var(--border);font-family:'Space Grotesk',sans-serif;">${p.bulk}</td>
        <td class="tbl-right" style="padding:8px 4px;font-size:13px;font-weight:700;color:var(--text2);border-bottom:1px solid var(--border);font-family:monospace;">${p.sg.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // Sand Needed <-> Clean Volume
  const snClean = parseFloat(document.getElementById('sandneed-clean')?.value) || 0;
  const snPpg   = parseFloat(document.getElementById('sandneed-ppg')?.value)   || 0;
  const snLbs = snClean * 42 * snPpg;
  if (document.getElementById('sandneed-lbs')) document.getElementById('sandneed-lbs').textContent = Math.round(snLbs).toLocaleString();
  if (document.getElementById('sandneed-clean-out')) document.getElementById('sandneed-clean-out').textContent = (snPpg > 0 ? (snLbs/42/snPpg) : 0).toLocaleString(undefined,{maximumFractionDigits:0});

  // AVF / CFR / Yield / Slurry Density
  const ppa = parseFloat(document.getElementById('propcalc-ppa')?.value) || 0;
  const sg  = parseFloat(document.getElementById('propcalc-sg')?.value)  || 2.65;
  const waterDens = 8.33;
  const avfVal = 1 / (waterDens * sg);
  const avf = ppa * avfVal;
  const cfr = 1 / ((ppa / (sg * waterDens)) + 1);
  const propYield = (ppa * avfVal) + 1;
  const slurryDens = waterDens + (ppa / ((ppa / (sg * waterDens)) + 1));
  if (document.getElementById('propcalc-avf')) document.getElementById('propcalc-avf').textContent = avfVal.toFixed(4);
  if (document.getElementById('propcalc-cfr')) document.getElementById('propcalc-cfr').textContent = cfr.toFixed(3);
  if (document.getElementById('propcalc-yield')) document.getElementById('propcalc-yield').textContent = propYield.toFixed(3);
  if (document.getElementById('propcalc-slurrydens')) document.getElementById('propcalc-slurrydens').textContent = slurryDens.toFixed(2);

  // Proppant Concentration Method 1 (Pump Rates)
  const pcSlurryRate = parseFloat(document.getElementById('propconc-slurryrate')?.value) || 0;
  const pcCleanRate  = parseFloat(document.getElementById('propconc-cleanrate')?.value)  || 0;
  const pcSg1        = parseFloat(document.getElementById('propconc-sg1')?.value)        || 2.65;
  let ppaMethod1 = 0;
  if (pcCleanRate > 0 && pcSlurryRate >= pcCleanRate) {
    ppaMethod1 = ((pcSlurryRate / pcCleanRate) - 1) * 8.33 * pcSg1;
  }
  if (document.getElementById('propconc-res1')) {
    document.getElementById('propconc-res1').textContent = ppaMethod1.toFixed(2);
  }

  // Proppant Concentration Method 2 (Densitometer / Measured Density)
  const pcCarrier  = parseFloat(document.getElementById('propconc-carrier')?.value)  || 8.33;
  const pcMeasured = parseFloat(document.getElementById('propconc-measured')?.value) || 8.33;
  const pcSg2      = parseFloat(document.getElementById('propconc-sg2')?.value)      || 2.65;
  let ppaMethod2 = 0;
  const solidDens = pcSg2 * 8.33;
  if (pcMeasured > pcCarrier && pcMeasured < solidDens) {
    const denom = 1 - (pcMeasured / solidDens);
    ppaMethod2 = (pcMeasured - pcCarrier) / denom;
  }
  if (document.getElementById('propconc-res2')) {
    document.getElementById('propconc-res2').textContent = ppaMethod2.toFixed(2);
  }

  // Sand Ramp Average PPA & Total Sand
  const rStart = parseFloat(document.getElementById('ramp-start')?.value) || 0;
  const rEnd   = parseFloat(document.getElementById('ramp-end')?.value)   || 0;
  const rVol   = parseFloat(document.getElementById('ramp-vol')?.value)   || 0;
  const rAvgPpa = (rStart + rEnd) / 2;
  const rTotalLbs = rAvgPpa * rVol * 42;
  if (document.getElementById('ramp-avgppa')) document.getElementById('ramp-avgppa').textContent = rAvgPpa.toFixed(2);
  if (document.getElementById('ramp-totallbs')) document.getElementById('ramp-totallbs').textContent = Math.round(rTotalLbs).toLocaleString();

  // PPR Calculator (Dimensions)
  const augR   = parseFloat(document.getElementById('ppr-augr')?.value)   || 0;
  const shaftR = parseFloat(document.getElementById('ppr-shaftr')?.value) || 0;
  const pitch  = parseFloat(document.getElementById('ppr-pitch')?.value)  || 0;
  const bulk   = parseFloat(document.getElementById('ppr-bulk')?.value)   || 0;
  const ppr = 1.41 * (Math.pow(augR,2) - Math.pow(shaftR,2)) * pitch * bulk / 1728;
  if (document.getElementById('ppr-result')) document.getElementById('ppr-result').textContent = ppr.toFixed(4);

  // PPR Recalibration
  const pprOld    = parseFloat(document.getElementById('pprrecal-old')?.value)    || 0;
  const pprActual = parseFloat(document.getElementById('pprrecal-actual')?.value) || 0;
  const pprDesign = parseFloat(document.getElementById('pprrecal-design')?.value) || 0;
  const pprNew = pprDesign > 0 ? pprOld * (pprActual / pprDesign) : pprOld;
  if (document.getElementById('pprrecal-new')) document.getElementById('pprrecal-new').textContent = pprNew.toFixed(4);

  // Auger RPM, PPM & PPT Rates
  const arRate = parseFloat(document.getElementById('augerrpm-rate')?.value) || 0;
  const arPpg  = parseFloat(document.getElementById('augerrpm-ppg')?.value)  || 0;
  const arPpr  = parseFloat(document.getElementById('augerrpm-ppr')?.value)  || 0;
  const totalRpm = arPpr > 0 ? arRate * arPpg * 42 / arPpr : 0;
  const ppm = totalRpm * arPpr;
  const ppt = arPpg * 1000;
  if (document.getElementById('augerrpm-total')) document.getElementById('augerrpm-total').textContent = totalRpm.toFixed(1);
  if (document.getElementById('augerrpm-ppm')) document.getElementById('augerrpm-ppm').textContent = Math.round(ppm).toLocaleString();
  if (document.getElementById('augerrpm-ppt')) document.getElementById('augerrpm-ppt').textContent = Math.round(ppt).toLocaleString();

  // Multi-Auger Priority RPM Allocator
  const maTotalRpm   = parseFloat(document.getElementById('multiauger-totalrpm')?.value)   || 0;
  const maCount      = parseInt(document.getElementById('multiauger-count')?.value)        || 3;
  const maThreshold  = parseFloat(document.getElementById('multiauger-threshold')?.value)  || 50;
  const maContainer  = document.getElementById('multiauger-results');
  if (maContainer) {
    const isOver = maTotalRpm > (maThreshold * maCount);
    let augerRPMs = [];
    if (isOver) {
      const equalRpm = maTotalRpm / maCount;
      augerRPMs = Array(maCount).fill(equalRpm);
    } else {
      let remRpm = maTotalRpm;
      for (let i = 0; i < maCount; i++) {
        const take = Math.min(remRpm, maThreshold);
        augerRPMs.push(take);
        remRpm -= take;
      }
    }
    maContainer.innerHTML = augerRPMs.map((rpm, i) => `
      <div class="tile">
        <div class="lbl">Auger ${i + 1} RPM ${isOver ? '(Equal Run)' : `(P${i + 1})`}</div>
        <div class="val" style="color:var(--brand);">${rpm.toFixed(1)}</div>
        <div class="unit">RPM</div>
      </div>
    `).join('');
  }

  // Job Prop Total from Cum Volumes
  const jpSlurry = parseFloat(document.getElementById('jobprop-slurry')?.value) || 0;
  const jpClean  = parseFloat(document.getElementById('jobprop-clean')?.value)  || 0;
  const jpChem   = parseFloat(document.getElementById('jobprop-chem')?.value)   || 0;
  const jpTotal  = avfVal > 0 ? (jpSlurry - jpClean - jpChem) / avfVal : 0;
  if (document.getElementById('jobprop-total')) document.getElementById('jobprop-total').textContent = Math.round(jpTotal).toLocaleString();
}