/* ═══════════════════════════════════════════════════════════
   VoltX Academy – Quiz System
   Interactive quizzes with hints, instant feedback,
   and global score tracking
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Global score tracker ─────────────────────────────────
window._quizTotal   = window._quizTotal   || 0;
window._quizCorrect = window._quizCorrect || 0;

// Track per-quiz state
const quizState = {};

/**
 * checkAnswer(btn, type, quizId)
 *  btn    – the clicked button element
 *  type   – 'correct' | 'wrong'
 *  quizId – the id of the quiz container div
 */
function checkAnswer(btn, type, quizId) {
  const questionEl = btn.closest('.quiz-question');
  if (!questionEl) return;

  // Prevent re-answering
  if (questionEl.dataset.answered === 'true') return;
  questionEl.dataset.answered = 'true';

  // Disable all options
  const opts = questionEl.querySelectorAll('.q-opt');
  opts.forEach(o => {
    o.disabled = true;
    // Mark the correct one regardless
    if (o.dataset.isCorrect === 'true' || o === btn && type === 'correct') {
      // will style below
    }
  });

  // Style selected
  if (type === 'correct') {
    btn.classList.add('correct-ans');
    window._quizCorrect++;
    showFeedback(questionEl, true);
  } else {
    btn.classList.add('wrong-ans');
    // Reveal correct answer
    opts.forEach(o => {
      if (o.onclick && o.onclick.toString().includes("'correct'")) {
        o.classList.add('correct-ans');
      }
    });
    showFeedback(questionEl, false);
    // Show hint
    const hint = questionEl.querySelector('.q-hint');
    if (hint) hint.classList.remove('hidden');
  }

  window._quizTotal++;

  // Animate to next question after delay
  setTimeout(() => {
    nextQuestion(quizId, questionEl);
  }, 1800);
}

function showFeedback(questionEl, isCorrect) {
  const fb = questionEl.querySelector('.q-feedback');
  if (!fb) return;
  fb.classList.remove('hidden');
  if (isCorrect) {
    fb.textContent = '✅ Correct! Great job!';
    fb.classList.add('feedback-correct');
    fb.classList.remove('feedback-wrong');
  } else {
    fb.textContent = '❌ Not quite. The correct answer is highlighted above.';
    fb.classList.add('feedback-wrong');
    fb.classList.remove('feedback-correct');
  }
}

function nextQuestion(quizId, currentQEl) {
  if (!quizState[quizId]) quizState[quizId] = { answered: 0, correct: 0, total: 0 };

  // Hide current question with fade
  currentQEl.style.opacity = '0';
  currentQEl.style.transform = 'translateX(-20px)';
  currentQEl.style.transition = 'all 0.4s ease';

  setTimeout(() => {
    currentQEl.classList.remove('active-q');
    currentQEl.classList.add('hidden');

    // Find next question
    const container = document.getElementById(quizId);
    if (!container) return;

    const allQs = container.querySelectorAll('.quiz-question');
    let foundNext = false;
    let prevWasHidden = true;

    for (let i = 0; i < allQs.length; i++) {
      const q = allQs[i];
      if (q === currentQEl) {
        // This was the current one
        if (i + 1 < allQs.length) {
          const nextQ = allQs[i + 1];
          if (nextQ.classList.contains('hidden') && !nextQ.classList.contains('quiz-score')) {
            nextQ.classList.remove('hidden');
            nextQ.classList.add('active-q');
            nextQ.style.opacity = '0';
            nextQ.style.transform = 'translateX(20px)';
            setTimeout(() => {
              nextQ.style.opacity = '1';
              nextQ.style.transform = 'translateX(0)';
              nextQ.style.transition = 'all 0.4s ease';
            }, 50);
            foundNext = true;
          }
        }
        break;
      }
    }

    // If no next question, show score
    if (!foundNext) {
      showQuizScore(quizId, container);
    }
  }, 400);
}

function showQuizScore(quizId, container) {
  const scoreEl = document.getElementById(`score-${quizId}`);
  if (!scoreEl) return;

  // Count correct answers for this quiz
  const allQs = container.querySelectorAll('.quiz-question');
  let total = allQs.length;
  let correct = 0;
  allQs.forEach(q => {
    if (q.querySelector('.correct-ans.q-opt:not(.wrong-ans)')) correct++;
    // check if the button marked correct-ans was selected
  });

  // Simpler: count feedback-correct divs
  correct = container.querySelectorAll('.feedback-correct').length;
  total   = container.querySelectorAll('.quiz-question').length;

  const pct = total > 0 ? Math.round((correct/total)*100) : 0;
  let msg = '';
  if (pct === 100) msg = '🏆 Perfect Score!';
  else if (pct >= 66) msg = '👍 Well Done!';
  else if (pct >= 33) msg = '📚 Keep Practicing!';
  else msg = '💪 Review and Try Again!';

  scoreEl.textContent = `Quiz Complete! ${correct}/${total} correct (${pct}%) — ${msg}`;
  scoreEl.classList.remove('hidden');
  scoreEl.style.opacity = '0';
  setTimeout(() => {
    scoreEl.style.opacity = '1';
    scoreEl.style.transition = 'opacity 0.5s ease';
  }, 100);

  // Update final score display
  if (window.updateFinalScore) window.updateFinalScore();
}

// ─── Keyboard navigation hint ─────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (window.navigateSlide) window.navigateSlide(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (window.navigateSlide) window.navigateSlide(-1);
  }
});

// ─── Expose ───────────────────────────────────────────────
window.checkAnswer = checkAnswer;
