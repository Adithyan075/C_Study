/* ═══════════════════════════════════════════════════════════
   VoltX Academy – Matrix Virtual Compiler Simulation
   Slide 20: Step-by-step execution of matrix_multiply.c
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── The C program lines to display ──────────────────────
const matProgram = [
  { line:1,  code:'#include <stdio.h>',                    indent:0 },
  { line:2,  code:'#define N 3',                           indent:0 },
  { line:4,  code:'int main() {',                          indent:0 },
  { line:5,  code:'int A[N][N]={{1,2,3},{4,5,6},{7,8,9}};', indent:1 },
  { line:6,  code:'int B[N][N]={{9,8,7},{6,5,4},{3,2,1}};', indent:1 },
  { line:7,  code:'int C[N][N] = {0};',                    indent:1 },
  { line:8,  code:'int i, j, k;',                          indent:1 },
  { line:10, code:'for(i=0; i<N; i++) {',                  indent:1 },
  { line:11, code:'  for(j=0; j<N; j++) {',                indent:2 },
  { line:12, code:'    C[i][j] = 0;',                      indent:3 },
  { line:13, code:'    for(k=0; k<N; k++) {',              indent:3 },
  { line:14, code:'      C[i][j] += A[i][k] * B[k][j];',  indent:4 },
  { line:15, code:'    }  // end k-loop',                  indent:3 },
  { line:16, code:'  }  // end j-loop',                    indent:2 },
  { line:17, code:'}  // end i-loop',                      indent:1 },
  { line:19, code:'for(i=0; i<N; i++) {',                  indent:1 },
  { line:21, code:'  printf("%d ", C[i][j]);',             indent:2 },
  { line:23, code:'  printf("\\n");',                      indent:2 },
  { line:24, code:'}',                                     indent:1 },
  { line:25, code:'return 0;',                             indent:1 },
  { line:26, code:'}',                                     indent:0 }
];

// ─── Matrix data ──────────────────────────────────────────
const matA = [[1,2,3],[4,5,6],[7,8,9]];
const matB = [[9,8,7],[6,5,4],[3,2,1]];
let matC = [[0,0,0],[0,0,0],[0,0,0]];

// ─── Build execution steps ────────────────────────────────
function buildMatSteps() {
  const steps = [];

  // Step 0: Include/define
  steps.push({ lineIdx:0, desc:'#include directive processed', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:1, desc:'N defined as 3 (3×3 matrix)', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:2, desc:'main() function begins', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:3, desc:'Matrix A declared and initialized:\n[[1,2,3],[4,5,6],[7,8,9]]', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:4, desc:'Matrix B declared and initialized:\n[[9,8,7],[6,5,4],[3,2,1]]', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:5, desc:'Matrix C declared. All 9 elements set to 0.', i:null, j:null, k:null, phase:'init' });
  steps.push({ lineIdx:6, desc:'Loop variables i, j, k declared.', i:null, j:null, k:null, phase:'init' });

  // Triple loop
  const C = [[0,0,0],[0,0,0],[0,0,0]];
  for(let i=0; i<3; i++) {
    steps.push({ lineIdx:7, desc:`Outer loop: i = ${i}. (i < 3 → continue)`, i:i, j:null, k:null, phase:'outer' });
    for(let j=0; j<3; j++) {
      steps.push({ lineIdx:8, desc:`Middle loop: j = ${j}. (j < 3 → continue)`, i:i, j:j, k:null, phase:'middle' });
      C[i][j] = 0;
      steps.push({ lineIdx:9, desc:`C[${i}][${j}] reset to 0 before accumulation.`, i:i, j:j, k:null, phase:'reset', cState: C.map(r=>[...r]) });
      for(let k=0; k<3; k++) {
        steps.push({ lineIdx:10, desc:`Inner loop: k = ${k}. (k < 3 → continue)`, i:i, j:j, k:k, phase:'inner' });
        const prod = matA[i][k] * matB[k][j];
        C[i][j] += prod;
        steps.push({
          lineIdx:11,
          desc:`C[${i}][${j}] += A[${i}][${k}] × B[${k}][${j}] = ${matA[i][k]} × ${matB[k][j]} = ${prod}\nC[${i}][${j}] is now ${C[i][j]}`,
          i:i, j:j, k:k,
          phase:'multiply',
          cState: C.map(r=>[...r]),
          prod: prod,
          newVal: C[i][j]
        });
      }
      steps.push({ lineIdx:12, desc:`k-loop ended. C[${i}][${j}] final = ${C[i][j]}`, i:i, j:j, k:null, phase:'kend', cState: C.map(r=>[...r]) });
    }
    steps.push({ lineIdx:13, desc:`j-loop ended. Row ${i} of C complete.`, i:i, j:null, k:null, phase:'jend' });
  }
  steps.push({ lineIdx:14, desc:`i-loop ended. All rows computed!`, i:null, j:null, k:null, phase:'iend' });

  // Print phase
  const consoleLines = [];
  for(let i=0; i<3; i++) {
    steps.push({ lineIdx:15, desc:`Print loop: i = ${i}`, i:i, j:null, k:null, phase:'print' });
    let row = '';
    for(let j=0; j<3; j++) {
      row += C[i][j] + ' ';
      steps.push({
        lineIdx:16,
        desc:`printf: C[${i}][${j}] = ${C[i][j]}`,
        i:i, j:j, k:null,
        phase:'printval',
        consoleOut: consoleLines.join('\n') + (row.trim() ? '\n' + row : ''),
        cState: C.map(r=>[...r])
      });
    }
    consoleLines.push(row.trim());
    steps.push({
      lineIdx:17,
      desc:`Newline printed. Row ${i} output done.`,
      i:i, j:null, k:null,
      phase:'newline',
      consoleOut: consoleLines.join('\n')
    });
  }

  steps.push({ lineIdx:19, desc:'return 0 — program ends successfully ✅', i:null, j:null, k:null, phase:'end', consoleOut: consoleLines.join('\n') });
  return steps;
}

// ─── State ────────────────────────────────────────────────
let matSteps = [];
let matCurrent = 0;

// ─── Render the code lines in the compiler panel ──────────
function renderMatCode() {
  const container = document.getElementById('mat-exec-lines');
  if(!container) return;
  container.innerHTML = '';
  matProgram.forEach((pl, idx) => {
    const div = document.createElement('div');
    div.className = 'exec-line';
    div.id = `mat-el-${idx}`;
    div.innerHTML = `<span class="el-num">${pl.line}</span><span class="el-code">${escapeHtml(pl.code)}</span>`;
    container.appendChild(div);
  });
}

function escapeHtml(str) {
  return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Apply a step ─────────────────────────────────────────
function applyMatStep(stepData) {
  // Highlight code line
  document.querySelectorAll('#mat-exec-lines .exec-line').forEach(el => {
    el.classList.remove('active-line');
    if(!el.classList.contains('executed-line')) el.classList.add('executed-line');
  });
  const active = document.getElementById(`mat-el-${stepData.lineIdx}`);
  if(active) {
    active.classList.remove('executed-line');
    active.classList.add('active-line');
    active.scrollIntoView({ block:'nearest', behavior:'smooth' });
  }

  // Update variable watch
  const viEl = document.getElementById('vw-mat-i');
  const vjEl = document.getElementById('vw-mat-j');
  const vkEl = document.getElementById('vw-mat-k');
  if(viEl) viEl.textContent = stepData.i !== null ? stepData.i : '—';
  if(vjEl) vjEl.textContent = stepData.j !== null ? stepData.j : '—';
  if(vkEl) vkEl.textContent = stepData.k !== null ? stepData.k : '—';

  // Update C matrix
  if(stepData.cState) {
    for(let r=0;r<3;r++) for(let c=0;c<3;c++) {
      const el = document.getElementById(`mr-c${r}${c}`);
      if(el) {
        const newVal = stepData.cState[r][c];
        const oldVal = parseInt(el.textContent, 10) || 0;
        el.textContent = newVal;
        if(newVal !== oldVal || (stepData.i===r && stepData.j===c && stepData.phase==='multiply')) {
          el.classList.add('updated');
          setTimeout(() => el.classList.remove('updated'), 800);
        }
      }
    }
  }

  // Console output
  const consoleEl = document.getElementById('mat-console-text');
  if(consoleEl && stepData.consoleOut !== undefined) {
    consoleEl.innerHTML = stepData.consoleOut.split('\n').map(l=>
      `<span>${escapeHtml(l)}</span>`
    ).join('<br>');
  }
}

// ─── Step controls ────────────────────────────────────────
function matCompilerStep(dir) {
  const newStep = matCurrent + dir;
  if(newStep < 0 || newStep >= matSteps.length) return;
  matCurrent = newStep;
  const step = matSteps[matCurrent];
  applyMatStep(step);

  document.getElementById('mat-step-ind').textContent = `Step ${matCurrent} / ${matSteps.length-1}`;
  document.getElementById('mat-prev-btn').disabled = matCurrent <= 0;
  document.getElementById('mat-next-btn').disabled = matCurrent >= matSteps.length-1;
}

function matCompilerReset() {
  matCurrent = 0;
  // Reset code highlights
  document.querySelectorAll('#mat-exec-lines .exec-line').forEach(el => {
    el.classList.remove('active-line','executed-line');
  });
  // Reset variable watch
  ['vw-mat-i','vw-mat-j','vw-mat-k'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = '—';
  });
  // Reset C matrix
  for(let r=0;r<3;r++) for(let c=0;c<3;c++) {
    const el = document.getElementById(`mr-c${r}${c}`);
    if(el) { el.textContent='0'; el.classList.remove('updated'); }
  }
  // Reset console
  const con = document.getElementById('mat-console-text');
  if(con) con.innerHTML = '';

  document.getElementById('mat-step-ind').textContent = 'Step 0';
  document.getElementById('mat-prev-btn').disabled = true;
  document.getElementById('mat-next-btn').disabled = false;
}

// ─── Init ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  matSteps = buildMatSteps();
  renderMatCode();
  matCompilerReset();
});

// Expose
window.matCompilerStep  = matCompilerStep;
window.matCompilerReset = matCompilerReset;
