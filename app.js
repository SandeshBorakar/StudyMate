/**
 * StudyMate – AI Learning Assistant
 * Frontend Application Controller
 * 
 * Interacts with the secure backend AI endpoints (/api/explain, /api/notes, /api/quiz, /api/ask).
 * Seamlessly falls back to mockData.js if the backend AI API is unconfigured or unavailable.
 */

// Global Application State
const state = {
  currentTopic: '',
  topicData: null,
  activeTab: 'explain',
  explanationMode: 'standard', // 'standard' | 'beginner'
  quizAnswers: {},             // { [questionIdx]: selectedOptionIdx }
  isQuizSubmitted: false,
  isLoading: false,
  aiBackendOnline: false
};

// DOM Element References
const elements = {
  // Navigation & Status
  navLinks: document.querySelectorAll('.nav-item'),
  navBadge: document.querySelector('.nav-badge'),
  navBadgeText: document.querySelector('.nav-badge span:last-child'),
  statusDot: document.querySelector('.status-dot'),
  
  // Hero & Search
  topicInput: document.getElementById('topicInput'),
  clearTopicBtn: document.getElementById('clearTopicBtn'),
  btnExplain: document.getElementById('btnExplain'),
  btnNotes: document.getElementById('btnNotes'),
  btnQuiz: document.getElementById('btnQuiz'),
  topicChips: document.querySelectorAll('.topic-chip'),

  // Toast
  toastAlert: document.getElementById('toastAlert'),
  toastIcon: document.getElementById('toastIcon'),
  toastMessage: document.getElementById('toastMessage'),
  toastCloseBtn: document.getElementById('toastCloseBtn'),

  // Loading Screen
  loadingIndicator: document.getElementById('loadingIndicator'),
  loadingTitle: document.getElementById('loadingTitle'),
  loadingSubtitle: document.getElementById('loadingSubtitle'),

  // Results Container
  resultsWrapper: document.getElementById('resultsWrapper'),
  currentTopicTitle: document.getElementById('currentTopicTitle'),
  
  // Tabs
  tabButtons: document.querySelectorAll('.tab-btn'),
  panels: document.querySelectorAll('.content-panel'),

  // Explanation Panel
  modeStandardBtn: document.getElementById('modeStandardBtn'),
  modeBeginnerBtn: document.getElementById('modeBeginnerBtn'),
  standardExplanationView: document.getElementById('standardExplanationView'),
  beginnerExplanationView: document.getElementById('beginnerExplanationView'),
  simpleDefinitionText: document.getElementById('simpleDefinitionText'),
  detailedExplanationText: document.getElementById('detailedExplanationText'),
  realWorldExampleText: document.getElementById('realWorldExampleText'),
  standardExplanationText: document.getElementById('standardExplanationText'),
  beginnerExplanationText: document.getElementById('beginnerExplanationText'),
  keyTakeawaysList: document.getElementById('keyTakeawaysList'),
  btnCopyExplanation: document.getElementById('btnCopyExplanation'),
  btnJumpToNotes: document.getElementById('btnJumpToNotes'),

  // Notes Panel
  notesOverviewText: document.getElementById('notesOverviewText'),
  notesSectionsList: document.getElementById('notesSectionsList'),
  btnCopyNotes: document.getElementById('btnCopyNotes'),
  btnPrintNotes: document.getElementById('btnPrintNotes'),

  // Quiz Panel
  quizStatusBadge: document.getElementById('quizStatusBadge'),
  answeredCount: document.getElementById('answeredCount'),
  quizQuestionsList: document.getElementById('quizQuestionsList'),
  btnSubmitQuiz: document.getElementById('btnSubmitQuiz'),
  quizErrorPrompt: document.getElementById('quizErrorPrompt'),
  quizScoreBanner: document.getElementById('quizScoreBanner'),
  scoreNumber: document.getElementById('scoreNumber'),
  scorePercent: document.getElementById('scorePercent'),
  scoreTitle: document.getElementById('scoreTitle'),
  scoreMessage: document.getElementById('scoreMessage'),
  btnRetakeQuiz: document.getElementById('btnRetakeQuiz'),

  // Ask AI Panel
  askInput: document.getElementById('askInput'),
  btnAskAI: document.getElementById('btnAskAI'),
  askLoading: document.getElementById('askLoading'),
  askAnswerBox: document.getElementById('askAnswerBox'),
  answerTitle: document.getElementById('answerTitle'),
  answerContent: document.getElementById('answerContent'),
  btnCopyAnswer: document.getElementById('btnCopyAnswer'),
  askSuggestionBtns: document.querySelectorAll('.ask-suggestion-btn')
};

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
let toastTimeout = null;

function showToast(message, type = 'warning') {
  clearTimeout(toastTimeout);

  elements.toastMessage.textContent = message;
  elements.toastAlert.className = 'toast-alert show';

  if (type === 'error') {
    elements.toastAlert.classList.add('toast-error');
    elements.toastIcon.textContent = '❌';
  } else if (type === 'success') {
    elements.toastAlert.classList.add('toast-success');
    elements.toastIcon.textContent = '✅';
  } else if (type === 'info') {
    elements.toastIcon.textContent = 'ℹ️';
  } else {
    elements.toastIcon.textContent = '⚠️';
  }

  toastTimeout = setTimeout(() => {
    hideToast();
  }, 4000);
}

function hideToast() {
  elements.toastAlert.classList.remove('show');
}

if (elements.toastCloseBtn) {
  elements.toastCloseBtn.addEventListener('click', hideToast);
}

/* ==========================================================================
   Check Backend Status on Startup
   ========================================================================== */
async function checkBackendStatus() {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      const data = await res.json();
      state.aiBackendOnline = data.aiAvailable;
      if (elements.navBadgeText) {
        if (data.aiAvailable) {
          elements.navBadgeText.textContent = '⚡ Live AI Active';
          if (elements.statusDot) elements.statusDot.style.background = '#10b981';
        } else {
          elements.navBadgeText.textContent = '📚 Fallback Mode';
          if (elements.statusDot) elements.statusDot.style.background = '#f59e0b';
        }
      }
    }
  } catch (err) {
    console.warn('Could not contact backend status endpoint, using client-side fallback.');
    if (elements.navBadgeText) elements.navBadgeText.textContent = '📚 Fallback Mode';
  }
}

/* ==========================================================================
   Navigation & Tab Management
   ========================================================================== */
function switchTab(targetTabName) {
  state.activeTab = targetTabName;

  // Update tab buttons
  elements.tabButtons.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === targetTabName;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget);
  });

  // Update panels
  elements.panels.forEach(panel => {
    const isTarget = panel.id === `${targetTabName}-container`;
    panel.classList.toggle('active', isTarget);
  });

  // Update navbar links active state
  elements.navLinks.forEach(link => {
    const target = link.getAttribute('data-target');
    if (target === `${targetTabName}-container`) {
      elements.navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// Attach Tab Switcher clicks
elements.tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    switchTab(tab);
  });
});

// Attach Navigation bar clicks
elements.navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    elements.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    if (targetId === 'home-section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetId === 'ask-ai-section') {
      const askSec = document.getElementById('ask-ai-section');
      if (askSec) askSec.scrollIntoView({ behavior: 'smooth' });
    } else {
      const tabName = targetId.replace('-container', '');
      if (state.topicData) {
        switchTab(tabName);
        elements.resultsWrapper.scrollIntoView({ behavior: 'smooth' });
      } else {
        showToast('Please enter a topic and click an action button first!');
        elements.topicInput.focus();
      }
    }
  });
});

/* ==========================================================================
   AI API Fetchers with Seamless Fallback
   ========================================================================== */

/**
 * Fetch Explain data from backend or fallback to mockData.js
 */
async function fetchExplainData(topic) {
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const result = await res.json();
    if (result.success && result.data && (result.data.simpleDefinition || result.data.standardExplanation)) {
      return { source: 'ai', data: result.data };
    }
  } catch (err) {
    console.warn('Explain endpoint error:', err.message);
  }
  // Fallback to local mock generator
  const fallbackData = getTopicStudyData(topic);
  return {
    source: 'mock',
    data: {
      title: fallbackData.title,
      simpleDefinition: fallbackData.simpleDefinition || fallbackData.standardExplanation,
      detailedExplanation: fallbackData.detailedExplanation || fallbackData.standardExplanation,
      realWorldExample: fallbackData.realWorldExample || fallbackData.beginnerExplanation,
      standardExplanation: fallbackData.standardExplanation,
      beginnerExplanation: fallbackData.beginnerExplanation,
      keyTakeaways: fallbackData.keyTakeaways
    }
  };
}

/**
 * Fetch Notes data from backend or fallback to mockData.js
 */
async function fetchNotesData(topic) {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const result = await res.json();
    if (result.success && result.data && result.data.notes) {
      return { source: 'ai', data: result.data };
    }
  } catch (err) {
    console.warn('Notes endpoint error:', err.message);
  }
  // Fallback to local mock generator
  const fallbackData = getTopicStudyData(topic);
  return {
    source: 'mock',
    data: {
      title: fallbackData.title,
      notes: fallbackData.notes
    }
  };
}

/**
 * Fetch Quiz data from backend or fallback to mockData.js
 */
async function fetchQuizData(topic) {
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const result = await res.json();
    if (result.success && result.data && Array.isArray(result.data.quiz) && result.data.quiz.length >= 5) {
      return { source: 'ai', data: result.data };
    }
  } catch (err) {
    console.warn('Quiz endpoint error:', err.message);
  }
  // Fallback to local mock generator
  const fallbackData = getTopicStudyData(topic);
  return {
    source: 'mock',
    data: {
      quiz: fallbackData.quiz
    }
  };
}

/* ==========================================================================
   Topic Search & Execution Flow
   ========================================================================== */
async function handleTopicAction(preferredTab = 'explain') {
  const topicQuery = elements.topicInput.value.trim();

  // Validate topic input
  if (!topicQuery) {
    showToast('Please enter a topic or subject name first!', 'warning');
    elements.topicInput.focus();
    return;
  }

  // Update state
  state.currentTopic = topicQuery;

  // Show loading indicator
  startSimulatedLoading(topicQuery);

  try {
    // 1. Fetch targeted data from backend with fallback
    let sourceUsed = 'ai';

    const [explainResult, notesResult, quizResult] = await Promise.all([
      fetchExplainData(topicQuery),
      fetchNotesData(topicQuery),
      fetchQuizData(topicQuery)
    ]);

    if (explainResult.source === 'mock' || notesResult.source === 'mock' || quizResult.source === 'mock') {
      sourceUsed = 'mock';
    }

    // Combine into full study data package
    state.topicData = {
      title: explainResult.data.title || notesResult.data.title || topicQuery,
      simpleDefinition: explainResult.data.simpleDefinition || explainResult.data.standardExplanation,
      detailedExplanation: explainResult.data.detailedExplanation || explainResult.data.standardExplanation,
      realWorldExample: explainResult.data.realWorldExample || explainResult.data.beginnerExplanation,
      standardExplanation: explainResult.data.standardExplanation || explainResult.data.simpleDefinition,
      beginnerExplanation: explainResult.data.beginnerExplanation || explainResult.data.simpleDefinition,
      keyTakeaways: explainResult.data.keyTakeaways || [],
      notes: notesResult.data.notes,
      quiz: quizResult.data.quiz
    };

    stopSimulatedLoading(() => {
      renderAllContent(preferredTab);
      if (sourceUsed === 'ai') {
        showToast(`AI generated study materials for "${topicQuery}"!`, 'success');
      } else {
        showToast(`Loaded reference study materials for "${topicQuery}".`, 'info');
      }
    });
  } catch (err) {
    console.error('Error generating study materials:', err);
    // Safe emergency fallback
    state.topicData = getTopicStudyData(topicQuery);
    stopSimulatedLoading(() => {
      renderAllContent(preferredTab);
      showToast('Loaded reference study materials.', 'info');
    });
  }
}

/**
 * Loading Screen Controls
 */
function startSimulatedLoading(topicName) {
  state.isLoading = true;
  elements.resultsWrapper.style.display = 'none';
  elements.loadingIndicator.style.display = 'flex';
  
  elements.loadingTitle.textContent = `Analyzing "${topicName}"...`;
  elements.loadingSubtitle.textContent = 'Crafting student-friendly explanations, structured notes, and quiz questions...';

  elements.loadingIndicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function stopSimulatedLoading(onComplete) {
  elements.loadingIndicator.style.display = 'none';
  elements.resultsWrapper.style.display = 'block';
  state.isLoading = false;
  if (onComplete) onComplete();
  elements.resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Main rendering router for active topic
 */
function renderAllContent(targetTab = 'explain') {
  if (!state.topicData) return;

  // Update Header Title
  elements.currentTopicTitle.textContent = state.topicData.title;

  // Render Subcomponents
  renderExplanationView();
  renderNotesView();
  renderQuizView();

  // Switch to requested tab
  switchTab(targetTab);
}

/* ==========================================================================
   1. AI Explanation Rendering & Mode Switcher
   ========================================================================== */
function renderExplanationView() {
  const data = state.topicData;
  if (!data) return;

  // Title
  if (data.title && elements.currentTopicTitle) {
    elements.currentTopicTitle.textContent = data.title;
  }

  // 1. Simple Definition
  if (elements.simpleDefinitionText) {
    elements.simpleDefinitionText.textContent = data.simpleDefinition || data.standardExplanation || '';
  }

  // 2. Detailed Explanation
  if (elements.detailedExplanationText) {
    const rawDetailed = data.detailedExplanation || data.standardExplanation || '';
    elements.detailedExplanationText.innerHTML = formatMarkdownBold(rawDetailed).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  }

  // 3. Real-World Example
  if (elements.realWorldExampleText) {
    elements.realWorldExampleText.textContent = data.realWorldExample || data.beginnerExplanation || '';
  }

  // Beginner View
  if (elements.beginnerExplanationText) {
    elements.beginnerExplanationText.textContent = data.beginnerExplanation || data.simpleDefinition || '';
  }

  // 4. Key Takeaways
  elements.keyTakeawaysList.innerHTML = '';
  if (data.keyTakeaways && data.keyTakeaways.length > 0) {
    data.keyTakeaways.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      elements.keyTakeawaysList.appendChild(li);
    });
  }

  // Set mode to active
  setExplanationMode(state.explanationMode);
}

function setExplanationMode(mode) {
  state.explanationMode = mode;

  if (mode === 'beginner') {
    elements.modeBeginnerBtn.classList.add('active');
    elements.modeStandardBtn.classList.remove('active');
    elements.beginnerExplanationView.classList.add('active');
    elements.standardExplanationView.classList.remove('active');
  } else {
    elements.modeStandardBtn.classList.add('active');
    elements.modeBeginnerBtn.classList.remove('active');
    elements.standardExplanationView.classList.add('active');
    elements.beginnerExplanationView.classList.remove('active');
  }
}

// Mode toggle clicks
elements.modeStandardBtn.addEventListener('click', () => setExplanationMode('standard'));
elements.modeBeginnerBtn.addEventListener('click', () => setExplanationMode('beginner'));

// Copy Explanation
elements.btnCopyExplanation.addEventListener('click', () => {
  const data = state.topicData;
  if (!data) return;

  let textToCopy = '';
  if (state.explanationMode === 'beginner') {
    textToCopy = `${data.title}\n\nSimple Definition:\n${data.simpleDefinition || ''}\n\nIntuitive Picture & Analogy:\n${data.beginnerExplanation || ''}\n\nKey Takeaways:\n${(data.keyTakeaways || []).map(t => '• ' + t).join('\n')}`;
  } else {
    textToCopy = `${data.title}\n\n1. Simple Definition:\n${data.simpleDefinition || ''}\n\n2. Detailed Explanation:\n${data.detailedExplanation || data.standardExplanation || ''}\n\n3. Real-World Example:\n${data.realWorldExample || ''}\n\n4. Key Takeaways:\n${(data.keyTakeaways || []).map(t => '• ' + t).join('\n')}`;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast('Explanation copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard.', 'error');
  });
});

// Jump to Notes
elements.btnJumpToNotes.addEventListener('click', () => {
  switchTab('notes');
});

/* ==========================================================================
   2. Study Notes Rendering
   ========================================================================== */
function renderNotesView() {
  const data = state.topicData;
  if (!data || !data.notes) return;

  // Overview
  elements.notesOverviewText.textContent = data.notes.overview;

  // Sections List
  elements.notesSectionsList.innerHTML = '';

  data.notes.sections.forEach(sec => {
    const card = document.createElement('div');
    card.className = 'note-section-card';

    const title = document.createElement('h4');
    title.className = 'note-section-title';
    title.textContent = sec.heading;
    card.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'note-points-list';

    sec.points.forEach(rawPoint => {
      const li = document.createElement('li');
      li.className = 'note-point-item';

      // Parse markdown bold **text** safely
      li.innerHTML = formatMarkdownBold(rawPoint);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    elements.notesSectionsList.appendChild(card);
  });
}

// Helper to convert **bold** into <strong>bold</strong> safely
function formatMarkdownBold(text) {
  if (!text) return '';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Copy Notes
elements.btnCopyNotes.addEventListener('click', () => {
  if (!state.topicData || !state.topicData.notes) return;

  const title = state.topicData.title;
  const overview = state.topicData.notes.overview;
  
  let formattedText = `# Study Notes: ${title}\n\n`;
  formattedText += `Overview:\n${overview}\n\n`;

  state.topicData.notes.sections.forEach(sec => {
    formattedText += `${sec.heading}\n`;
    sec.points.forEach(pt => {
      formattedText += `• ${pt.replace(/\*\*/g, '')}\n`;
    });
    formattedText += '\n';
  });

  navigator.clipboard.writeText(formattedText).then(() => {
    showToast('Full study notes copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy notes.', 'error');
  });
});

// Print Notes
elements.btnPrintNotes.addEventListener('click', () => {
  window.print();
});

/* ==========================================================================
   3. Quiz Rendering, Grading & Review System
   ========================================================================== */
function renderQuizView() {
  const data = state.topicData;
  if (!data || !data.quiz) return;

  // Reset quiz state
  state.quizAnswers = {};
  state.isQuizSubmitted = false;

  elements.quizScoreBanner.style.display = 'none';
  elements.quizErrorPrompt.style.display = 'none';
  elements.btnSubmitQuiz.style.display = 'inline-flex';
  elements.answeredCount.textContent = '0';
  elements.quizQuestionsList.innerHTML = '';

  // Render 5 MCQs
  data.quiz.forEach((qItem, qIndex) => {
    const qCard = document.createElement('div');
    qCard.className = 'quiz-question-card';
    qCard.id = `quiz-card-${qIndex}`;

    // Header
    const qHeader = document.createElement('div');
    qHeader.className = 'question-header';

    const qBadge = document.createElement('span');
    qBadge.className = 'q-number-badge';
    qBadge.textContent = `Q${qIndex + 1}`;

    const qText = document.createElement('h4');
    qText.className = 'q-text';
    qText.textContent = qItem.question;

    qHeader.appendChild(qBadge);
    qHeader.appendChild(qText);
    qCard.appendChild(qHeader);

    // Options Container
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'quiz-options-group';

    qItem.options.forEach((optText, optIndex) => {
      const label = document.createElement('label');
      label.className = 'quiz-option-label';
      label.id = `opt-label-${qIndex}-${optIndex}`;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question_${qIndex}`;
      radio.value = optIndex;
      radio.className = 'quiz-option-input';

      radio.addEventListener('change', () => {
        if (state.isQuizSubmitted) return;
        handleQuizOptionSelect(qIndex, optIndex);
      });

      const spanText = document.createElement('span');
      spanText.className = 'option-text';
      spanText.textContent = optText;

      label.appendChild(radio);
      label.appendChild(spanText);
      optionsGroup.appendChild(label);
    });

    qCard.appendChild(optionsGroup);

    // Hidden Explanation container for review after submit
    const explanationBox = document.createElement('div');
    explanationBox.className = 'question-explanation-box';
    explanationBox.id = `explanation-box-${qIndex}`;
    explanationBox.style.display = 'none';
    explanationBox.innerHTML = `<strong>Explanation:</strong> ${qItem.explanation}`;
    qCard.appendChild(explanationBox);

    elements.quizQuestionsList.appendChild(qCard);
  });
}

function handleQuizOptionSelect(qIndex, optIndex) {
  state.quizAnswers[qIndex] = optIndex;

  // Visual selection styling
  for (let i = 0; i < 4; i++) {
    const lbl = document.getElementById(`opt-label-${qIndex}-${i}`);
    if (lbl) {
      lbl.classList.toggle('selected', i === optIndex);
    }
  }

  // Update answered counter
  const totalAnswered = Object.keys(state.quizAnswers).length;
  elements.answeredCount.textContent = totalAnswered;

  // Hide error prompt once interacted
  elements.quizErrorPrompt.style.display = 'none';
}

function submitQuiz() {
  if (state.isQuizSubmitted) return;

  const totalQuestions = state.topicData.quiz.length;
  const answeredCount = Object.keys(state.quizAnswers).length;

  // Validation: Check if all questions are answered
  if (answeredCount < totalQuestions) {
    elements.quizErrorPrompt.textContent = `Please answer all ${totalQuestions} questions before submitting (You answered ${answeredCount}/${totalQuestions}).`;
    elements.quizErrorPrompt.style.display = 'block';
    showToast(`Incomplete quiz! Please answer all ${totalQuestions} questions.`, 'warning');
    return;
  }

  state.isQuizSubmitted = true;
  elements.quizErrorPrompt.style.display = 'none';

  // Grade Quiz
  let correctScore = 0;
  state.topicData.quiz.forEach((qItem, qIndex) => {
    const userSelected = state.quizAnswers[qIndex];
    const isCorrect = userSelected === qItem.answer;

    if (isCorrect) {
      correctScore++;
    }

    // Highlight options & show explanation
    for (let optIdx = 0; optIdx < 4; optIdx++) {
      const label = document.getElementById(`opt-label-${qIndex}-${optIdx}`);
      const radio = label.querySelector('input');
      radio.disabled = true;

      // Mark correct option in emerald
      if (optIdx === qItem.answer) {
        label.classList.add('option-correct');
      }
      // If user selected incorrect option, mark red
      if (!isCorrect && optIdx === userSelected) {
        label.classList.add('option-wrong');
      }
    }

    // Reveal explanation callout
    const expBox = document.getElementById(`explanation-box-${qIndex}`);
    if (expBox) expBox.style.display = 'block';
  });

  // Calculate percentage
  const percentage = Math.round((correctScore / totalQuestions) * 100);

  // Update Score Card
  elements.scoreNumber.textContent = `${correctScore}/${totalQuestions}`;
  elements.scorePercent.textContent = `${percentage}%`;

  if (percentage === 100) {
    elements.scoreTitle.textContent = '🎉 Perfect Score! Excellent Work!';
    elements.scoreMessage.textContent = 'You have thoroughly mastered this topic concept.';
  } else if (percentage >= 60) {
    elements.scoreTitle.textContent = '👍 Good Job!';
    elements.scoreMessage.textContent = 'You demonstrated strong comprehension. Review the notes below to achieve 100%.';
  } else {
    elements.scoreTitle.textContent = '📚 Keep Studying!';
    elements.scoreMessage.textContent = 'Review the detailed explanations below and try again to improve your score.';
  }

  // Show banner & hide submit button
  elements.quizScoreBanner.style.display = 'flex';
  elements.btnSubmitQuiz.style.display = 'none';

  // Smooth scroll to score banner
  elements.quizScoreBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast(`Quiz completed! You scored ${correctScore}/${totalQuestions} (${percentage}%)`, 'success');
}

// Retake Quiz Handler
elements.btnRetakeQuiz.addEventListener('click', () => {
  renderQuizView();
  elements.resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

elements.btnSubmitQuiz.addEventListener('click', submitQuiz);

/* ==========================================================================
   4. Ask AI Assistant Section
   ========================================================================== */
async function handleAskAI(customQuery = null) {
  const query = customQuery || elements.askInput.value.trim();

  if (!query) {
    showToast('Please type a question for the AI assistant!', 'warning');
    elements.askInput.focus();
    return;
  }

  if (customQuery) {
    elements.askInput.value = customQuery;
  }

  // Show loading
  elements.askAnswerBox.style.display = 'none';
  elements.askLoading.style.display = 'flex';

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: query,
        topic: state.currentTopic || ''
      })
    });

    const result = await res.json();
    let title = '';
    let answerText = '';

    if (result.success && result.data) {
      title = result.data.title;
      answerText = result.data.answer;
    } else {
      // Fallback
      const fallback = getMockAIAnswer(query, state.currentTopic);
      title = fallback.title;
      answerText = fallback.answer;
    }

    elements.askLoading.style.display = 'none';
    elements.answerTitle.textContent = title;
    elements.answerContent.innerHTML = formatMarkdownBold(answerText);
    elements.askAnswerBox.style.display = 'block';

    elements.askAnswerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.warn('Ask AI network error, using fallback:', err.message);
    const fallback = getMockAIAnswer(query, state.currentTopic);
    elements.askLoading.style.display = 'none';
    elements.answerTitle.textContent = fallback.title;
    elements.answerContent.innerHTML = formatMarkdownBold(fallback.answer);
    elements.askAnswerBox.style.display = 'block';
  }
}

// Ask AI Button Click
elements.btnAskAI.addEventListener('click', () => handleAskAI());

// Enter key in Ask AI Textarea (Shift+Enter for newline)
elements.askInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleAskAI();
  }
});

// Quick prompt suggestions
elements.askSuggestionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const prompt = btn.getAttribute('data-query');
    handleAskAI(prompt);
  });
});

// Copy Ask AI Answer
elements.btnCopyAnswer.addEventListener('click', () => {
  const text = elements.answerContent.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Answer copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy answer.', 'error');
  });
});

/* ==========================================================================
   Search Input & Action Button Event Bindings
   ========================================================================== */
elements.btnExplain.addEventListener('click', () => handleTopicAction('explain'));
elements.btnNotes.addEventListener('click', () => handleTopicAction('notes'));
elements.btnQuiz.addEventListener('click', () => handleTopicAction('quiz'));

// Quick Topic Chips
elements.topicChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const selectedTopic = chip.getAttribute('data-topic');
    elements.topicInput.value = selectedTopic;
    elements.clearTopicBtn.style.display = 'flex';
    handleTopicAction('explain');
  });
});

// Input clear button visibility
elements.topicInput.addEventListener('input', () => {
  elements.clearTopicBtn.style.display = elements.topicInput.value.length > 0 ? 'flex' : 'none';
});

// Clear topic input
elements.clearTopicBtn.addEventListener('click', () => {
  elements.topicInput.value = '';
  elements.clearTopicBtn.style.display = 'none';
  elements.topicInput.focus();
});

// Enter key triggers Explain Topic by default
elements.topicInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleTopicAction('explain');
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill default topic suggestion
  elements.topicInput.value = 'Operating Systems';
  elements.clearTopicBtn.style.display = 'flex';
  
  // Check backend API connectivity
  checkBackendStatus();
});
