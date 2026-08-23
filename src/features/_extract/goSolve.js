function goSolve(numPumps, target, gears) {
  const candidates = [];
  const counts = {};

  function bt(idx, rem, rate) {
    if (idx === gears.length) {
      if (rem !== 0) return;
      let mid=0, minG=999, maxG=0, used=0;
      for (const [g,c] of Object.entries(counts)) {
        const gc=+g, cnt=+c;
        if (cnt>0) { used++; if(gc>=4&&gc<=6) mid+=cnt; minG=Math.min(minG,gc); maxG=Math.max(maxG,gc); }
      }
      const spread = used>0 ? maxG-minG : 0;
      const midPct = (mid/numPumps)*100;
      const err    = Math.abs(rate-target);
      const score  = err*1200 + spread*25 + used*12 - midPct*4;
      candidates.push({ gearCounts:{...counts}, achievedRate:rate, error:err, spread, numTypes:used, midCount:mid, midPct, score });
      return;
    }
    const [g,r] = gears[idx];
    for (let c=0; c<=rem; c++) { counts[g]=c; bt(idx+1, rem-c, rate+c*r); }
    counts[g]=0;
  }

  bt(0, numPumps, 0);
  return candidates.sort((a,b)=>a.score-b.score).slice(0,5);
}