/* ═══════════════════════════════════════════════════════════
   VoltX Academy – Sorting Virtual Compiler Simulation
   Slide 36: Step-by-step execution of bubble_sort.c
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── The C program lines ──────────────────────────────────
const sortProgram = [
  { line:1,  code:'#include <stdio.h>'              },
  { line:3,  code:'int main() {'                    },
  { line:4,  code:'  int arr[] = {64,34,25,12,22};' },
  { line:5,  code:'  int n = 5;'                    },
  { line:6,  code:'  int i, j, temp;'               },
  { line:8,  code:'  for(i=0; i<n-1; i++) {'        },
  { line:9,  code:'    for(j=0; j<n-i-1; j++) {'    },
  { line:10, code:'      if(arr[j] > arr[j+1]) {'   },
  { line:11, code:'        temp = arr[j];'           },
  { line:12, code:'        arr[j] = arr[j+1];'      },
  { line:13, code:'        arr[j+1] = temp;'        },
  { line:14, code:'      }'                         },
  { line:15, code:'    }  // end j-loop'            },
  { line:16, code:'  }  // end i-loop'              },
  { line:18, code:'  printf("Sorted: ");'           },
  { line:19, code:'  for(i=0; i<n; i++)'           },
  { line:20, code:'    printf("%d ", arr[i]);'      },
  { line:21, code:'  return 0;'                     },
  { line:22, code:'}'                               }
];

// ─── Build execution steps ────────────────────────────────
function buildSortCompSteps() {
  const steps = [];
  const arr = [64, 34, 25, 12, 22];
  const n = arr.length;

  steps.push({ lineIdx:0, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'#include <stdio.h> processed.' });
  steps.push({ lineIdx:1, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'main() function begins.' });
  steps.push({ lineIdx:2, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'Array declared: arr = [64, 34, 25, 12, 22]' });
  steps.push({ lineIdx:3, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'n = 5 (number of elements).' });
  steps.push({ lineIdx:4, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'Variables i, j, temp declared.' });

  for(let i=0; i<n-1; i++) {
    steps.push({ lineIdx:5, i:i, j:null, temp:null, swapped:null, arr:[...arr], desc:`Outer loop: i = ${i}. Condition: ${i} < ${n-1} = true. Starting pass ${i+1}.`, comparing:[] });

    for(let j=0; j<n-i-1; j++) {
      steps.push({ lineIdx:6, i:i, j:j, temp:null, swapped:null, arr:[...arr], desc:`Inner loop: j = ${j}. Condition: ${j} < ${n-i-1} = true.`, comparing:[j,j+1] });

      // Evaluate condition
      const cond = arr[j] > arr[j+1];
      steps.push({
        lineIdx:7, i:i, j:j, temp:null, swapped:'no',
        arr:[...arr],
        desc:`Comparing arr[${j}] = ${arr[j]} and arr[${j+1}] = ${arr[j+1]}. Condition (${arr[j]} > ${arr[j+1]}) = ${cond ? 'TRUE → swap' : 'FALSE → no swap'}`,
        comparing:[j,j+1]
      });

      if(cond) {
        const temp = arr[j];
        steps.push({ lineIdx:8,  i:i,j:j, temp:temp, swapped:'in-progress', arr:[...arr], desc:`temp = arr[${j}] = ${temp}`, comparing:[], swapCells:[j,j+1] });
        arr[j] = arr[j+1];
        steps.push({ lineIdx:9,  i:i,j:j, temp:temp, swapped:'in-progress', arr:[...arr], desc:`arr[${j}] = arr[${j+1}] = ${arr[j]}`, comparing:[], swapCells:[j,j+1] });
        arr[j+1] = temp;
        steps.push({ lineIdx:10, i:i,j:j, temp:temp, swapped:'YES',         arr:[...arr], desc:`arr[${j+1}] = temp = ${temp}. Swap complete!`, comparing:[], swapCells:[j,j+1] });
      }
    }

    // Mark sorted tail
    const sortedFrom = n - 1 - i;
    steps.push({
      lineIdx:12, i:i, j:null, temp:null, swapped:null,
      arr:[...arr], desc:`j-loop ended. Element arr[${sortedFrom}] = ${arr[sortedFrom]} is now in its final position.`,
      sortedIndices: Array.from({length:i+1},(_,k)=>n-1-k)
    });
  }

  steps.push({ lineIdx:13, i:null, j:null, temp:null, swapped:null, arr:[...arr], desc:'i-loop ended. All elements sorted!', sortedIndices:[0,1,2,3,4] });

  // Print steps
  steps.push({ lineIdx:14, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'printf("Sorted: ") — printing label', sortedIndices:[0,1,2,3,4] });
  steps.push({ lineIdx:15, i:0,j:null,temp:null,swapped:null,arr:[...arr], desc:'Print loop begins.', sortedIndices:[0,1,2,3,4] });
  let outStr = 'Sorted: ';
  for(let i=0;i<n;i++) {
    outStr += arr[i] + ' ';
    steps.push({
      lineIdx:16, i:i,j:null,temp:null,swapped:null,arr:[...arr],
      desc:`printf: arr[${i}] = ${arr[i]}`,
      sortedIndices:[0,1,2,3,4],
      consoleOut: outStr.trim()
    });
  }
  steps.push({ lineIdx:17, i:null,j:null,temp:null,swapped:null,arr:[...arr], desc:'return 0; — program exits successfully ✅', sortedIndices:[0,1,2,3,4], consoleOut: outStr.trim() });

  return steps;
}

// ─── State ────────────────────────────────────────────────
let sortCompSteps = [];
let sortCompCurrent = 0;

// ─── Render code lines ────────────────────────────────────
function renderSortCode() {
  const container = document.getElementById('sort-exec-lines');
  if(!container) return;
  container.innerHTML = '';
  sortProgram.forEach((pl, idx) => {
    const div = document.createElement('div');
    div.className = 'exec-line';
    div.id = `sort-el-${idx}`;
    div.innerHTML = `<span class="el-num">${pl.line}</span><span class="el-code">${escapeSortHtml(pl.code)}</span>`;
    container.appendChild(div);
  });
}

function escapeSortHtml(str) {
  return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Apply a step ─────────────────────────────────────────
function applySortCompStep(stepData) {
  // Highlight code line
  document.querySelectorAll('#sort-exec-lines .exec-line').forEach(el => {
    el.classList.remove('active-line');
    if(!el.classList.contains('executed-line')) el.classList.add('executed-line');
  });
  const active = document.getElementById(`sort-el-${stepData.lineIdx}`);
  if(active) {
    active.classList.remove('executed-line');
    active.classList.add('active-line');
    active.scrollIntoView({ block:'nearest', behavior:'smooth' });
  }

  // Update variable watch
  const watchI    = document.getElementById('vw-sort-i');
  const watchJ    = document.getElementById('vw-sort-j');
  const watchTemp = document.getElementById('vw-sort-temp');
  const watchSwap = document.getElementById('vw-sort-swap');
  if(watchI)    watchI.textContent    = stepData.i    !== null ? stepData.i    : '—';
  if(watchJ)    watchJ.textContent    = stepData.j    !== null ? stepData.j    : '—';
  if(watchTemp) watchTemp.textContent = stepData.temp !== null ? stepData.temp : '—';
  if(watchSwap) watchSwap.textContent = stepData.swapped !== null ? stepData.swapped : '—';

  // Update array display
  updateSortArrDisplay(stepData);

  // Console output
  const consoleEl = document.getElementById('sort-console-text');
  if(consoleEl && stepData.consoleOut !== undefined) {
    consoleEl.textContent = stepData.consoleOut;
  }
}

function updateSortArrDisplay(stepData) {
  const arr = stepData.arr;
  for(let i=0;i<5;i++) {
    const el = document.getElementById(`sc-${i}`);
    if(!el) continue;
    el.textContent = arr[i];
    el.className = 'sad-cell';

    if(stepData.swapCells && stepData.swapCells.includes(i)) {
      el.classList.add('swapping-cell');
    } else if(stepData.comparing && stepData.comparing.includes(i)) {
      el.classList.add('comparing-cell');
    } else if(stepData.sortedIndices && stepData.sortedIndices.includes(i)) {
      el.classList.add('sorted-cell');
    }
  }
}

// ─── Step controls ────────────────────────────────────────
function sortCompilerStep(dir) {
  const newStep = sortCompCurrent + dir;
  if(newStep < 0 || newStep >= sortCompSteps.length) return;
  sortCompCurrent = newStep;
  const step = sortCompSteps[sortCompCurrent];
  applySortCompStep(step);

  document.getElementById('sort-comp-ind').textContent = `Step ${sortCompCurrent} / ${sortCompSteps.length-1}`;
  document.getElementById('sort-comp-prev').disabled = sortCompCurrent <= 0;
  document.getElementById('sort-comp-next').disabled = sortCompCurrent >= sortCompSteps.length-1;
}

function sortCompilerReset() {
  sortCompCurrent = 0;
  // Reset code highlights
  document.querySelectorAll('#sort-exec-lines .exec-line').forEach(el => {
    el.classList.remove('active-line','executed-line');
  });
  // Reset variable watch
  ['vw-sort-i','vw-sort-j','vw-sort-temp','vw-sort-swap'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = '—';
  });
  // Reset array display
  const initArr = [64,34,25,12,22];
  initArr.forEach((v,i) => {
    const el = document.getElementById(`sc-${i}`);
    if(el) { el.textContent = v; el.className = 'sad-cell'; }
  });
  // Reset console
  const con = document.getElementById('sort-console-text');
  if(con) con.textContent = '';

  document.getElementById('sort-comp-ind').textContent = 'Step 0';
  document.getElementById('sort-comp-prev').disabled = true;
  document.getElementById('sort-comp-next').disabled = false;
}

// ─── Init ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  sortCompSteps = buildSortCompSteps();
  renderSortCode();
  sortCompilerReset();
});

// Expose
window.sortCompilerStep  = sortCompilerStep;
window.sortCompilerReset = sortCompilerReset;
