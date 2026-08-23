function goDisplay(numPumps, target) {
  const best = goSols[goSelIdx];

  document.getElementById('go-achieved').textContent = best.achievedRate.toFixed(1);

  const errEl = document.getElementById('go-err-badge');
  if (best.error < 0.05) {
    errEl.innerHTML = `<span class="badge badge-green">✓ EXACT MATCH</span>`;
  } else {
    const dir = best.achievedRate > target ? 'over' : 'under';
    errEl.innerHTML = `<span class="badge badge-yellow">${best.error.toFixed(1)} BPM ${dir}</span>`;
  }

  document.getElementById('go-midband').textContent = `${Math.round(best.midPct)}%`;

  // Distribution table
  const rows = [];
  for (let g=1; g<=9; g++) {
    const cnt = best.gearCounts[g] || 0;
    if (!cnt) continue;
    const isMid = g>=4 && g<=6;
    const rate  = ALL_GEAR_RATES[g] || 0;
    const pct   = Math.round((cnt/numPumps)*100);
    rows.push(`<tr class="${isMid?'gear-mid-row':''}">
      <td style="font-weight:700;padding:9px 6px;">${gearLabel(g)}</td>
      <td class="tbl-right font-display" style="font-weight:900;color:${isMid?'var(--brand)':'var(--text)'};padding:9px 6px;">${cnt}</td>
      <td class="tbl-right" style="color:var(--text2);font-family:monospace;padding:9px 6px;">${rate.toFixed(1)}</td>
      <td class="tbl-right" style="font-family:monospace;font-weight:600;padding:9px 6px;">${(cnt*rate).toFixed(1)}</td>
      <td class="tbl-right" style="color:var(--text2);font-family:monospace;padding:9px 6px;">${pct}%</td>
    </tr>`);
  }
  document.getElementById('go-tbl').innerHTML = rows.join('');

  // Alternatives
  if (goSols.length > 1) {
    document.getElementById('go-alts-wrap').classList.remove('hidden');
    document.getElementById('go-alts').innerHTML = goSols.slice(1,4).map((sol,i) => {
      const sum = Object.entries(sol.gearCounts)
        .filter(([,c])=>c>0).sort(([a],[b])=>+a-+b)
        .map(([g,c])=>`${c}×${gearOrd(+g)}`).join(', ');
      const sel = goSelIdx === i+1;
      return `<div class="alt-card${sel?' sel':''}" onclick="goSel(${i+1},${numPumps},${target})">
        <div>
          <div style="font-size:15px;font-weight:700;">${sol.achievedRate.toFixed(1)} BPM</div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px;">${sum}</div>
        </div>
        <div class="text-right">
          <div class="lbl" style="margin:0 0 2px;">MID-BAND</div>
          <div class="font-display" style="font-size:20px;font-weight:900;color:var(--brand);">${Math.round(sol.midPct)}%</div>
        </div>
      </div>`;
    }).join('');
  } else {
    document.getElementById('go-alts-wrap').classList.add('hidden');
  }

  // Field notes
  const notes = [];
  const mp = Math.round(best.midPct);
  notes.push(best.midPct >= 70
    ? `Excellent mid-band concentration — ${mp}% of pumps in 4th–6th gear. Very easy to fine-tune rate on the fly.`
    : `Good balance with ${mp}% in the preferred 4th–6th band.`);
  if (best.spread <= 2)      notes.push(`Very tight spread (${best.spread} gears) — ideal for location monitoring.`);
  else if (best.spread <= 4) notes.push(`Manageable spread of ${best.spread} gears.`);
  if ((best.gearCounts[8]||0)>0 || (best.gearCounts[9]||0)>0)
    notes.push(`⚠️ Extreme gears active. Only approved for critical rate situations.`);
  notes.push(`Assign the largest group to one pump line or color-code for quick visual checks on location.`);

  document.getElementById('go-notes').innerHTML = notes.map(n =>
    `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
       <span style="color:var(--brand);font-size:12px;flex-shrink:0;margin-top:1px;">✓</span>
       <span style="font-size:12px;font-weight:500;color:var(--text);line-height:1.4;">${n}</span>
     </div>`).join('');
}