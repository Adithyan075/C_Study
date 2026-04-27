/* ═══════════════════════════════════════════════════════════
   VoltX Academy – Main JS
   Scroll progress, slide navigation, intersection observer,
   tooltips, 2×2 step demo, 3×3 step demo, swap demo
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Global state ─────────────────────────────────────────
const TOTAL_SLIDES = 43;
let currentSlide = 1;

// ─── DOM refs ─────────────────────────────────────────────
const progressBar   = document.getElementById('progress-bar');
const progressText  = document.getElementById('progress-text');
const currentTopic  = document.getElementById('current-topic');
const slideCounter  = document.getElementById('slide-counter');
const completionBanner = document.getElementById('completion-banner');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');

// ─── Get all slides ───────────────────────────────────────
function getAllSlides() {
  return document.querySelectorAll('.slide');
}

// ─── Calculate & update progress ─────────────────────────
function updateProgress(idx) {
  const pct = Math.round(((idx - 1) / (TOTAL_SLIDES - 1)) * 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = `Learning Progress: ${pct}%`;

  if (pct >= 100) {
    completionBanner.classList.add('show');
    updateFinalScore();
  }
}

// ─── Update header topic badge ────────────────────────────
function updateTopicBadge(idx) {
  const slide = document.getElementById(`slide-${idx}`);
  if (slide) {
    const section = slide.dataset.section || 'Introduction';
    currentTopic.textContent = section;
  }
}

// ─── Navigate to a slide ─────────────────────────────────
function navigateSlide(delta) {
  const newSlide = Math.min(Math.max(currentSlide + delta, 1), TOTAL_SLIDES);
  if (newSlide === currentSlide) return;
  goToSlide(newSlide);
}

function goToSlide(idx) {
  const el = document.getElementById(`slide-${idx}`);
  if (!el) return;
  currentSlide = idx;

  // Smooth scroll
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  updateUI();
}

function updateUI() {
  const idx = currentSlide;
  updateProgress(idx);
  updateTopicBadge(idx);
  slideCounter.textContent = `${idx} / ${TOTAL_SLIDES}`;

  // Update prev/next buttons
  btnPrev.disabled = idx <= 1;
  btnNext.disabled = idx >= TOTAL_SLIDES;
}

// ─── Intersection Observer for slide visibility ───────────
function initObserver() {
  const slides = getAllSlides();
  const options = {
    root: null,
    rootMargin: `-${document.getElementById('sticky-header').offsetHeight}px 0px 0px 0px`,
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const idx = parseInt(entry.target.dataset.index, 10);
        if (!isNaN(idx) && idx !== currentSlide) {
          currentSlide = idx;
          updateUI();
        }
      }
    });
  }, options);

  slides.forEach(slide => observer.observe(slide));
}

// ─── Tooltips ─────────────────────────────────────────────
function initTooltips() {
  const overlay = document.getElementById('tooltip-overlay');
  const els = document.querySelectorAll('[data-tooltip]');

  els.forEach(el => {
    el.addEventListener('mouseenter', e => {
      overlay.textContent = el.dataset.tooltip;
      overlay.classList.add('visible');
    });
    el.addEventListener('mousemove', e => {
      let x = e.clientX + 14;
      let y = e.clientY + 14;
      if (x + 250 > window.innerWidth) x = e.clientX - 260;
      if (y + 60 > window.innerHeight) y = e.clientY - 50;
      overlay.style.left = x + 'px';
      overlay.style.top  = y + 'px';
    });
    el.addEventListener('mouseleave', () => {
      overlay.classList.remove('visible');
    });
  });
}

// ─── Final Score ──────────────────────────────────────────
function updateFinalScore() {
  const el = document.getElementById('fsc-stats');
  if (!el) return;
  const total   = window._quizTotal   || 0;
  const correct = window._quizCorrect || 0;
  if (total === 0) {
    el.textContent = 'Complete the quizzes to see your score!';
    return;
  }
  const pct = Math.round((correct / total) * 100);
  let grade = pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '👍 Good Job!' : pct >= 50 ? '📚 Keep Practicing' : '💪 Try Again!';
  el.innerHTML = `${correct} / ${total} correct (${pct}%) — ${grade}`;
}

// ─── Restart Course ───────────────────────────────────────
function restartCourse() {
  goToSlide(1);
  completionBanner.classList.remove('show');
  window._quizTotal   = 0;
  window._quizCorrect = 0;
}

// ═══════════════════════════════════════════════════════════
//  2×2 MATRIX STEP CALCULATOR
// ═══════════════════════════════════════════════════════════
const A2 = [[1,2],[3,4]];
const B2 = [[5,6],[7,8]];
const C2 = [[0,0],[0,0]];

const mm2x2Steps = [
  { i:0, j:0, formula:'C[0][0] = (1×5) + (2×7)', value:17,
    exp:'Row 0 of A: [1, 2] × Col 0 of B: [5, 7] → 1×5 + 2×7 = 5 + 14 = 17',
    rows:[0], cols:[0] },
  { i:0, j:1, formula:'C[0][1] = (1×6) + (2×8)', value:23,
    exp:'Row 0 of A: [1, 2] × Col 1 of B: [6, 8] → 1×6 + 2×8 = 6 + 16 = 22 ... wait: 1×6+2×8=6+16=22... let me recalc: C[0][1]=1×6+2×8=22',
    rows:[0], cols:[1] },
  { i:1, j:0, formula:'C[1][0] = (3×5) + (4×7)', value:43,
    exp:'Row 1 of A: [3, 4] × Col 0 of B: [5, 7] → 3×5 + 4×7 = 15 + 28 = 43',
    rows:[1], cols:[0] },
  { i:1, j:1, formula:'C[1][1] = (3×6) + (4×8)', value:50,
    exp:'Row 1 of A: [3, 4] × Col 1 of B: [6, 8] → 3×6 + 4×8 = 18 + 32 = 50',
    rows:[1], cols:[1] }
];

// Recalculate correct values
(function() {
  const a = [[1,2],[3,4]], b = [[5,6],[7,8]];
  mm2x2Steps[0].value = a[0][0]*b[0][0]+a[0][1]*b[1][0]; // 17
  mm2x2Steps[0].exp = `Row 0 of A: [1,2] × Col 0 of B: [5,7] → 1×5 + 2×7 = 5+14 = ${mm2x2Steps[0].value}`;
  mm2x2Steps[0].formula = `C[0][0] = (1×5) + (2×7) = ${mm2x2Steps[0].value}`;
  mm2x2Steps[1].value = a[0][0]*b[0][1]+a[0][1]*b[1][1]; // 22
  mm2x2Steps[1].exp = `Row 0 of A: [1,2] × Col 1 of B: [6,8] → 1×6 + 2×8 = 6+16 = ${mm2x2Steps[1].value}`;
  mm2x2Steps[1].formula = `C[0][1] = (1×6) + (2×8) = ${mm2x2Steps[1].value}`;
  mm2x2Steps[2].value = a[1][0]*b[0][0]+a[1][1]*b[1][0]; // 43
  mm2x2Steps[2].exp = `Row 1 of A: [3,4] × Col 0 of B: [5,7] → 3×5 + 4×7 = 15+28 = ${mm2x2Steps[2].value}`;
  mm2x2Steps[2].formula = `C[1][0] = (3×5) + (4×7) = ${mm2x2Steps[2].value}`;
  mm2x2Steps[3].value = a[1][0]*b[0][1]+a[1][1]*b[1][1]; // 50
  mm2x2Steps[3].exp = `Row 1 of A: [3,4] × Col 1 of B: [6,8] → 3×6 + 4×8 = 18+32 = ${mm2x2Steps[3].value}`;
  mm2x2Steps[3].formula = `C[1][1] = (3×6) + (4×8) = ${mm2x2Steps[3].value}`;
})();

let mm2x2Current = 0;

function mm2x2ClearHL() {
  ['a00','a01','a10','a11'].forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.className = 'cm-cell'; el.style.background=''; el.style.borderColor=''; el.style.color=''; }
  });
  ['b00','b01','b10','b11'].forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.className = 'cm-cell'; el.style.background=''; el.style.borderColor=''; el.style.color=''; }
  });
}

function mm2x2Step(dir) {
  const newStep = mm2x2Current + dir;
  if (newStep < 0 || newStep > mm2x2Steps.length) return;

  mm2x2ClearHL();

  if (newStep === 0) {
    mm2x2Current = 0;
    document.getElementById('mm2x2-exp-text').textContent = 'Click "Next Step" to begin!';
    document.getElementById('mm2x2-formula').textContent = '';
    document.getElementById('mm2x2-step-ind').textContent = 'Step 0 / 4';
    document.getElementById('mm2x2-prev').disabled = true;
    document.getElementById('mm2x2-next').disabled = false;
    return;
  }

  mm2x2Current = newStep;
  const step = mm2x2Steps[mm2x2Current - 1];

  // Highlight row
  step.rows.forEach(r => {
    [`a${r}0`,`a${r}1`].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.className = 'cm-cell hl-row-active';
    });
  });

  // Highlight col
  step.cols.forEach(c => {
    [`b0${c}`,`b1${c}`].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.className = 'cm-cell hl-col-active';
    });
  });

  // Show result
  const i = step.i, j = step.j;
  const cEl = document.getElementById(`c${i}${j}`);
  if (cEl) {
    cEl.textContent = step.value;
    cEl.className = 'cm-cell hl-result-active';
  }

  document.getElementById('mm2x2-exp-text').textContent = step.exp;
  document.getElementById('mm2x2-formula').textContent = step.formula;
  document.getElementById('mm2x2-step-ind').textContent = `Step ${mm2x2Current} / 4`;
  document.getElementById('mm2x2-prev').disabled = mm2x2Current <= 0;
  document.getElementById('mm2x2-next').disabled = mm2x2Current >= mm2x2Steps.length;
}

function mm2x2Reset() {
  mm2x2Current = 0;
  mm2x2ClearHL();
  ['c00','c01','c10','c11'].forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.textContent = '?'; el.className = 'cm-cell result-empty'; }
  });
  document.getElementById('mm2x2-exp-text').textContent = 'Click "Next Step" to begin the step-by-step calculation!';
  document.getElementById('mm2x2-formula').textContent = '';
  document.getElementById('mm2x2-step-ind').textContent = 'Step 0 / 4';
  document.getElementById('mm2x2-prev').disabled = true;
  document.getElementById('mm2x2-next').disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  3×3 MATRIX STEP CALCULATOR
// ═══════════════════════════════════════════════════════════
const A3 = [[1,2,3],[4,5,6],[7,8,9]];
const B3 = [[9,8,7],[6,5,4],[3,2,1]];

function computeC3(i,j) {
  return A3[i][0]*B3[0][j] + A3[i][1]*B3[1][j] + A3[i][2]*B3[2][j];
}

let mm3Current = 0;
const mm3Steps = [];
for(let i=0;i<3;i++) for(let j=0;j<3;j++) {
  const v = computeC3(i,j);
  const ai = A3[i];
  const bj = [B3[0][j], B3[1][j], B3[2][j]];
  mm3Steps.push({
    i, j, value: v,
    exp: `Row ${i} of A: [${ai}] × Col ${j} of B: [${bj}]`,
    formula: `C[${i}][${j}] = ${ai[0]}×${bj[0]} + ${ai[1]}×${bj[1]} + ${ai[2]}×${bj[2]} = ${ai[0]*bj[0]}+${ai[1]*bj[1]}+${ai[2]*bj[2]} = ${v}`
  });
}

function mm3ClearHL() {
  for(let r=0;r<3;r++) for(let c=0;c<3;c++) {
    const aEl = document.getElementById(`mm3-a${r}${c}`);
    const bEl = document.getElementById(`mm3-b${r}${c}`);
    if(aEl) { aEl.className='mm3-cell'; aEl.style.background=''; aEl.style.borderColor=''; aEl.style.color=''; }
    if(bEl) { bEl.className='mm3-cell'; bEl.style.background=''; bEl.style.borderColor=''; bEl.style.color=''; }
  }
}

function mm3Step(dir) {
  const newStep = mm3Current + dir;
  if (newStep < 0 || newStep > mm3Steps.length) return;

  mm3ClearHL();

  if (newStep === 0) {
    mm3Current = 0;
    document.getElementById('mm3-exp-text').textContent = 'Click "Next Step" to calculate each element of C one by one.';
    document.getElementById('mm3-formula').textContent = '';
    document.getElementById('mm3-step-ind').textContent = 'Step 0 / 9';
    document.getElementById('mm3-prev').disabled = true;
    document.getElementById('mm3-next').disabled = false;
    return;
  }

  mm3Current = newStep;
  const step = mm3Steps[mm3Current - 1];

  // Highlight row in A
  for(let k=0;k<3;k++) {
    const el = document.getElementById(`mm3-a${step.i}${k}`);
    if(el) { el.style.background='rgba(108,99,255,0.35)'; el.style.borderColor='rgba(108,99,255,0.7)'; el.style.color='#fff'; }
  }
  // Highlight col in B
  for(let k=0;k<3;k++) {
    const el = document.getElementById(`mm3-b${k}${step.j}`);
    if(el) { el.style.background='rgba(0,212,255,0.3)'; el.style.borderColor='rgba(0,212,255,0.6)'; el.style.color='#fff'; }
  }
  // Show result in C
  const cEl = document.getElementById(`mm3-c${step.i}${step.j}`);
  if(cEl) {
    cEl.textContent = step.value;
    cEl.style.background='rgba(0,230,118,0.35)';
    cEl.style.borderColor='rgba(0,230,118,0.7)';
    cEl.style.color='var(--c-green)';
    cEl.style.fontWeight='900';
  }

  document.getElementById('mm3-exp-text').textContent = step.exp;
  document.getElementById('mm3-formula').textContent = step.formula;
  document.getElementById('mm3-step-ind').textContent = `Step ${mm3Current} / 9`;
  document.getElementById('mm3-prev').disabled = mm3Current <= 0;
  document.getElementById('mm3-next').disabled = mm3Current >= mm3Steps.length;
}

function mm3Reset() {
  mm3Current = 0;
  mm3ClearHL();
  for(let i=0;i<3;i++) for(let j=0;j<3;j++) {
    const el = document.getElementById(`mm3-c${i}${j}`);
    if(el) {
      el.textContent='?';
      el.className='mm3-cell result-empty';
      el.style.background='';el.style.borderColor='';el.style.color='';el.style.fontWeight='';
    }
  }
  document.getElementById('mm3-exp-text').textContent = 'Click "Next Step" to calculate each element of C one by one.';
  document.getElementById('mm3-formula').textContent = '';
  document.getElementById('mm3-step-ind').textContent = 'Step 0 / 9';
  document.getElementById('mm3-prev').disabled = true;
  document.getElementById('mm3-next').disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  SWAP DEMO
// ═══════════════════════════════════════════════════════════
let swapStep = 0;
const swapSteps = [
  { aj:34, bj:64, temp:'?', label:'Initial State', line:0 },
  { aj:34, bj:64, temp:34,  label:'temp = arr[j]', line:1 },
  { aj:64, bj:64, temp:34,  label:'arr[j] = arr[j+1]', line:2 },
  { aj:64, bj:34, temp:34,  label:'arr[j+1] = temp', line:3 },
  { aj:64, bj:34, temp:34,  label:'Swap Complete! ✅', line:4 }
];

function swapDemoStep(dir) {
  const newStep = swapStep + dir;
  if (newStep < 0 || newStep >= swapSteps.length) return;
  swapStep = newStep;
  const s = swapSteps[swapStep];

  document.getElementById('sw-aj').textContent   = s.aj;
  document.getElementById('sw-bj').textContent   = s.bj;
  document.getElementById('sw-temp').textContent  = s.temp;
  document.getElementById('swap-step-ind').textContent = `Step ${swapStep} / ${swapSteps.length-1}`;

  // Highlight code line
  for(let i=0;i<5;i++) {
    const el = document.getElementById(`swl-${i}`);
    if(el) el.className = (i === s.line) ? 'sw-line active-sw-line' : 'sw-line';
  }

  document.getElementById('swap-prev').disabled = swapStep <= 0;
  document.getElementById('swap-next').disabled = swapStep >= swapSteps.length - 1;
}

function swapDemoReset() {
  swapStep = 0;
  const s = swapSteps[0];
  document.getElementById('sw-aj').textContent   = s.aj;
  document.getElementById('sw-bj').textContent   = s.bj;
  document.getElementById('sw-temp').textContent  = s.temp;
  document.getElementById('swap-step-ind').textContent = `Step 0 / ${swapSteps.length-1}`;
  for(let i=0;i<5;i++) {
    const el = document.getElementById(`swl-${i}`);
    if(el) el.className = 'sw-line';
  }
  document.getElementById('swap-prev').disabled = true;
  document.getElementById('swap-next').disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  SORT VISUALIZER (Slide 27)
// ═══════════════════════════════════════════════════════════
let sortVisCurrentStep = 0;
let sortVisSteps = [];
const sortVisInitArr = [64, 34, 25, 12, 22];

function buildSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  steps.push({ arr: [...a], comparing:[], swapping:[], sorted:[], info:'Initial array. Ready to sort!' });
  for(let i=0;i<n-1;i++) {
    for(let j=0;j<n-i-1;j++) {
      steps.push({ arr:[...a], comparing:[j,j+1], swapping:[], sorted:Array.from({length:n-i-1},(v,k)=>k).slice(n-i-1), info:`Pass ${i+1}: Comparing arr[${j}]=${a[j]} and arr[${j+1}]=${a[j+1]}` });
      if(a[j]>a[j+1]) {
        let t=a[j]; a[j]=a[j+1]; a[j+1]=t;
        steps.push({ arr:[...a], comparing:[], swapping:[j,j+1], sorted:Array.from({length:i},(v,k)=>n-1-k), info:`Swapped! arr[${j}] and arr[${j+1}] exchanged. Array is now [${a}]` });
      } else {
        steps.push({ arr:[...a], comparing:[], swapping:[], sorted:Array.from({length:i},(v,k)=>n-1-k), info:`No swap needed. arr[${j}]=${a[j]} ≤ arr[${j+1}]=${a[j+1]}` });
      }
    }
    steps[steps.length-1].sorted = Array.from({length:i+1},(v,k)=>n-1-k);
  }
  const finalSorted = Array.from({length:n},(_,k)=>k);
  steps.push({ arr:[...a], comparing:[], swapping:[], sorted:finalSorted, info:`✅ Array fully sorted! Result: [${a}]` });
  return steps;
}

function initSortVis() {
  sortVisSteps = buildSortSteps(sortVisInitArr);
  renderSortBars(sortVisSteps[0]);
  document.getElementById('sort-step-ind').textContent = `Step 0 / ${sortVisSteps.length-1}`;
}

function renderSortBars(stepData) {
  const container = document.getElementById('sort-bars');
  const valContainer = document.getElementById('sort-values');
  if(!container || !valContainer) return;

  const arr = stepData.arr;
  const maxVal = Math.max(...arr);
  container.innerHTML = '';
  valContainer.innerHTML = '';

  arr.forEach((val, idx) => {
    const bar = document.createElement('div');
    bar.className = 'sort-bar';
    const heightPct = (val / maxVal) * 100;
    bar.style.height = heightPct + '%';

    if(stepData.swapping.includes(idx)) bar.classList.add('swapping');
    else if(stepData.comparing.includes(idx)) bar.classList.add('comparing');
    else if(stepData.sorted.includes(idx)) bar.classList.add('sorted-bar');

    container.appendChild(bar);

    const label = document.createElement('span');
    label.textContent = val;
    valContainer.appendChild(label);
  });
}

function sortVisStep(dir) {
  const newStep = sortVisCurrentStep + dir;
  if(newStep < 0 || newStep >= sortVisSteps.length) return;
  sortVisCurrentStep = newStep;
  const step = sortVisSteps[sortVisCurrentStep];
  renderSortBars(step);
  document.getElementById('sort-info-text').textContent = step.info;
  document.getElementById('sort-step-ind').textContent = `Step ${sortVisCurrentStep} / ${sortVisSteps.length-1}`;
  document.getElementById('sort-prev-btn').disabled = sortVisCurrentStep <= 0;
  document.getElementById('sort-next-btn').disabled = sortVisCurrentStep >= sortVisSteps.length-1;
}

function sortVisReset() {
  sortVisCurrentStep = 0;
  renderSortBars(sortVisSteps[0]);
  document.getElementById('sort-info-text').textContent = 'Click "Next Step" to start bubble sort visualization.';
  document.getElementById('sort-step-ind').textContent = `Step 0 / ${sortVisSteps.length-1}`;
  document.getElementById('sort-prev-btn').disabled = true;
  document.getElementById('sort-next-btn').disabled = false;
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  updateUI();
  initObserver();
  initTooltips();
  initSortVis();
  swapDemoReset();
  mm2x2Reset();
  mm3Reset();
});

// Expose global functions
window.navigateSlide    = navigateSlide;
window.goToSlide        = goToSlide;
window.mm2x2Step        = mm2x2Step;
window.mm2x2Reset       = mm2x2Reset;
window.mm3Step          = mm3Step;
window.mm3Reset         = mm3Reset;
window.swapDemoStep     = swapDemoStep;
window.swapDemoReset    = swapDemoReset;
window.sortVisStep      = sortVisStep;
window.sortVisReset     = sortVisReset;
window.restartCourse    = restartCourse;
window.updateFinalScore = updateFinalScore;
