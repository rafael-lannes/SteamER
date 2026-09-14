/**
 * SteamER - Steam Easy Review
 * Main Application Controller
 * Features:
 * - Dynamic Single-Page-App Views (Editor Workspace & Dedicated "Minhas Reviews" Dashboard)
 * - Complete JSON Backup System (Export all reviews & notes, Validated Import with replace/merge)
 * - Recommendation Selector (👍 Recomendo / 👎 Não Recomendo) with Live Steam Preview sync
 * - Multi-Review Projects with LocalStorage Persistence, Multi-Criteria Sorting & Live Search
 * - Detachable Popout Window for Notes with Real-time 2-Way Sync
 * - Steam BBCode Formatting & Real-time Live Preview
 * - Character Counter (8,000 max limit) & One-click Clipboard Export
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // DOM Elements - Navigation & Views
  // ==========================================
  const appContainer = document.querySelector('.app-container');
  const brandLogoBtn = document.getElementById('brandLogoBtn');
  const navBtnHome = document.getElementById('navBtnHome');
  const navBtnEditor = document.getElementById('navBtnEditor');
  const navBtnReviews = document.getElementById('navBtnReviews');
  const reviewsNavBadge = document.getElementById('reviewsNavBadge');
  const viewHome = document.getElementById('viewHome');
  const viewEditorWorkspace = document.getElementById('viewEditorWorkspace');
  const viewReviewsDashboard = document.getElementById('viewReviewsDashboard');

  // Home View DOM Elements
  const btnHomeNewReview = document.getElementById('btnHomeNewReview');
  const btnHomeImportBackup = document.getElementById('btnHomeImportBackup');
  const btnHomeGoEditor = document.getElementById('btnHomeGoEditor');
  const btnHomeGoReviews = document.getElementById('btnHomeGoReviews');
  const homeReviewsCountBadge = document.getElementById('homeReviewsCountBadge');
  const homeResumeSection = document.getElementById('homeResumeSection');
  const homeActiveVerdictBadge = document.getElementById('homeActiveVerdictBadge');
  const homeActiveVerdictText = document.getElementById('homeActiveVerdictText');
  const homeActiveGameTitle = document.getElementById('homeActiveGameTitle');
  const homeActiveGameSnippet = document.getElementById('homeActiveGameSnippet');
  const homeActiveGameMeta = document.getElementById('homeActiveGameMeta');
  const btnHomeResumeActive = document.getElementById('btnHomeResumeActive');

  // Header Actions
  const btnOpenNewReviewModal = document.getElementById('btnOpenNewReviewModal');
  const btnOpenBackupModal = document.getElementById('btnOpenBackupModal');
  const btnManageTemplates = document.getElementById('btnManageTemplates');
  const appearanceSelectorWrap = document.getElementById('appearanceSelectorWrap') || document.querySelector('.appearance-selector-wrap');
  const btnAppearanceMenu = document.getElementById('btnAppearanceMenu') || document.getElementById('btnThemeSelector');
  const layoutOptionItems = document.querySelectorAll('.layout-option-item');
  const themeOptionItems = document.querySelectorAll('.theme-option-item');

  // Editor DOM Elements
  const activeGameTitleText = document.getElementById('activeGameTitleText');
  const btnRenameActiveGame = document.getElementById('btnRenameActiveGame');
  const saveStatusIndicator = document.getElementById('saveStatusIndicator');
  const saveStatusText = document.getElementById('saveStatusText');
  const templateSelect = document.getElementById('templateSelect');
  const editor = document.getElementById('reviewEditor');
  const charCounter = document.getElementById('charCounter');
  const progressBar = document.getElementById('progressBar');
  const wordCounter = document.getElementById('wordCounter');
  const lineCounter = document.getElementById('lineCounter');

  // Recommendation Selector
  const btnRecommendPositive = document.getElementById('btnRecommendPositive');
  const btnRecommendNegative = document.getElementById('btnRecommendNegative');

  // Live Preview DOM Elements
  const tabPreview = document.getElementById('tabPreview');
  const tabNotes = document.getElementById('tabNotes');
  const viewPreview = document.getElementById('viewPreview');
  const viewNotes = document.getElementById('viewNotes');
  const steamThumbIcon = document.getElementById('steamThumbIcon');
  const steamThumbSvg = document.getElementById('steamThumbSvg');
  const steamVerdictText = document.getElementById('steamVerdictText');
  const previewContent = document.getElementById('previewContent');

  // Scratchpad / Notepad DOM Elements
  const gameNotesArea = document.getElementById('gameNotesArea');
  const notesCharCounter = document.getElementById('notesCharCounter');
  const notesMainControls = document.getElementById('notesMainControls');
  const notesDetachedNotice = document.getElementById('notesDetachedNotice');
  const btnPopoutNotes = document.getElementById('btnPopoutNotes');
  const btnReattachNotes = document.getElementById('btnReattachNotes');
  const btnInsertNoteToReview = document.getElementById('btnInsertNoteToReview');
  const btnCopyNotes = document.getElementById('btnCopyNotes');
  const btnClearNotes = document.getElementById('btnClearNotes');

  // Dashboard "Minhas Reviews" DOM Elements
  const btnDashboardNewReview = document.getElementById('btnDashboardNewReview');
  const btnDashboardBackup = document.getElementById('btnDashboardBackup');
  const dashStatTotal = document.getElementById('dashStatTotal');
  const dashStatPos = document.getElementById('dashStatPos');
  const dashStatNeg = document.getElementById('dashStatNeg');
  const dashStatWords = document.getElementById('dashStatWords');
  const dashboardSearchInput = document.getElementById('dashboardSearchInput');
  const btnDashboardClearSearch = document.getElementById('btnDashboardClearSearch');
  const filterChips = document.querySelectorAll('.filter-chip');
  const dashboardSortSelect = document.getElementById('dashboardSortSelect');
  const btnDashViewGrid = document.getElementById('btnDashViewGrid');
  const btnDashViewBlog = document.getElementById('btnDashViewBlog');
  const dashboardReviewsGrid = document.getElementById('dashboardReviewsGrid');
  const dashboardReviewsBlog = document.getElementById('dashboardReviewsBlog');
  const dashboardEmptyState = document.getElementById('dashboardEmptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateDesc = document.getElementById('emptyStateDesc');
  const btnEmptyStateNewReview = document.getElementById('btnEmptyStateNewReview');
  const btnOpenAboutModal = document.getElementById('btnOpenAboutModal');
  const aboutModal = document.getElementById('aboutModal');

  // Modals DOM Elements
  const newReviewModal = document.getElementById('newReviewModal');
  const newGameTitleInput = document.getElementById('newGameTitleInput');
  const btnNewReviewPos = document.getElementById('btnNewReviewPos');
  const btnNewReviewNeg = document.getElementById('btnNewReviewNeg');
  const newReviewTemplateSelect = document.getElementById('newReviewTemplateSelect');
  const btnConfirmCreateReview = document.getElementById('btnConfirmCreateReview');
  let newReviewRecommendState = true;

  const renameReviewModal = document.getElementById('renameReviewModal');
  const renameGameTitleInput = document.getElementById('renameGameTitleInput');
  const btnConfirmRenameGame = document.getElementById('btnConfirmRenameGame');
  let pendingRenameId = null;

  // Backup Modal DOM Elements
  const backupModal = document.getElementById('backupModal');
  const btnExportFullBackup = document.getElementById('btnExportFullBackup');
  const btnSelectBackupFile = document.getElementById('btnSelectBackupFile');
  const backupFileInput = document.getElementById('backupFileInput');
  const importPreviewBox = document.getElementById('importPreviewBox');
  const importFileStatusDot = document.getElementById('importFileStatusDot');
  const importFileName = document.getElementById('importFileName');
  const importSummaryText = document.getElementById('importSummaryText');
  const btnImportReplaceAll = document.getElementById('btnImportReplaceAll');
  const btnImportMerge = document.getElementById('btnImportMerge');
  const btnResetAllData = document.getElementById('btnResetAllData');
  let pendingImportContent = null;

  // Formatting Modals & Builders
  const linkModal = document.getElementById('linkModal');
  const linkUrlInput = document.getElementById('linkUrlInput');
  const linkTextInput = document.getElementById('linkTextInput');
  const btnApplyLink = document.getElementById('btnApplyLink');

  const colorModal = document.getElementById('colorModal');
  const customColorInput = document.getElementById('customColorInput');
  const colorHexDisplay = document.getElementById('colorHexDisplay');
  const btnApplyColor = document.getElementById('btnApplyColor');
  let selectedColor = '#66c0f4';

  const ratingModal = document.getElementById('ratingModal');
  const starsContainer = document.getElementById('starsInteractiveRow');
  const ratingPreviewBadge = document.getElementById('ratingPreviewBadge');
  const ratingCriterionInput = document.getElementById('ratingCriterionInput');
  const formatStyleSelect = document.getElementById('formatStyleSelect');
  const btnInsertRating = document.getElementById('btnInsertRating');
  const scale5Btn = document.getElementById('scale5Btn');
  const scale10Btn = document.getElementById('scale10Btn');

  const saveTemplateModal = document.getElementById('saveTemplateModal');
  const templateNameInput = document.getElementById('templateNameInput');
  const btnConfirmSaveTemplate = document.getElementById('btnConfirmSaveTemplate');

  const manageTemplatesModal = document.getElementById('manageTemplatesModal');
  const customTemplatesList = document.getElementById('customTemplatesList');
  const btnExportTemplates = document.getElementById('btnExportTemplates');
  const btnImportTemplates = document.getElementById('btnImportTemplates');
  const importFileInput = document.getElementById('importFileInput');

  // Primary Actions
  const btnCopyFormatted = document.getElementById('btnCopyFormatted');
  const btnDownloadTxt = document.getElementById('btnDownloadTxt');
  const btnClearEditor = document.getElementById('btnClearEditor');
  const btnSaveTemplate = document.getElementById('btnSaveTemplate');
  const toastContainer = document.getElementById('toastContainer');

  // Application State
  let currentActiveReview = null;
  let autoSaveTimeout = null;
  let popoutNotesWindow = null;
  let currentDashboardFilter = 'all';
  let currentDashboardViewMode = 'grid'; // 'grid' | 'blog'
  let currentMainView = 'home'; // 'home' | 'editor' | 'reviews'

  const ratingBuilder = new StarRatingBuilder({
    maxScale: 5,
    currentScore: 5,
    criterion: 'Nota Final',
    formatStyle: 'stars-score'
  });

  const MAX_STEAM_CHARS = 8000;
  const WARN_STEAM_CHARS = 7500;

  const SVG_THUMB_UP = `<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>`;
  const SVG_THUMB_DOWN = `<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>`;

  // ==========================================
  // Toast Notifications
  // ==========================================
  function showToast(message, type = 'success', duration = 3200) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--steam-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--status-danger)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ==========================================
  // SPA View Switcher (Home vs Editor vs Minhas Reviews)
  // ==========================================
  function switchMainView(viewName) {
    currentMainView = viewName;

    // Toggle Nav Button States
    if (navBtnHome) navBtnHome.classList.toggle('active', viewName === 'home');
    if (navBtnEditor) navBtnEditor.classList.toggle('active', viewName === 'editor');
    if (navBtnReviews) navBtnReviews.classList.toggle('active', viewName === 'reviews');

    // Toggle Workspace Views
    if (viewHome) viewHome.classList.toggle('active', viewName === 'home');
    if (viewEditorWorkspace) viewEditorWorkspace.classList.toggle('active', viewName === 'editor');
    if (viewReviewsDashboard) viewReviewsDashboard.classList.toggle('active', viewName === 'reviews');

    if (viewName === 'home') {
      renderHome();
    } else if (viewName === 'reviews') {
      renderDashboard();
    }
  }

  if (navBtnHome) navBtnHome.addEventListener('click', () => switchMainView('home'));
  if (navBtnEditor) navBtnEditor.addEventListener('click', () => switchMainView('editor'));
  if (navBtnReviews) navBtnReviews.addEventListener('click', () => switchMainView('reviews'));
  if (brandLogoBtn) brandLogoBtn.addEventListener('click', () => switchMainView('home'));

  // ==========================================
  // Home View Controller
  // ==========================================
  function renderHome() {
    const allReviews = ReviewManager.getAll();
    if (homeReviewsCountBadge) {
      homeReviewsCountBadge.textContent = allReviews.length;
    }

    if (currentActiveReview && homeResumeSection) {
      homeResumeSection.style.display = 'flex';
      if (homeActiveGameTitle) {
        homeActiveGameTitle.textContent = currentActiveReview.title || 'Análise Sem Título';
      }

      const isPos = currentActiveReview.recommended !== false;
      if (homeActiveVerdictBadge && homeActiveVerdictText) {
        homeActiveVerdictBadge.className = `dash-card-recommend-badge ${isPos ? 'pos' : 'neg'}`;
        const svgElem = homeActiveVerdictBadge.querySelector('svg');
        if (svgElem) svgElem.innerHTML = isPos ? SVG_THUMB_UP : SVG_THUMB_DOWN;
        homeActiveVerdictText.textContent = isPos ? 'Recomendado' : 'Não Recomendado';
      }

      if (homeActiveGameSnippet) {
        const cleanSnippet = (currentActiveReview.content || '')
          .replace(/\[\/?.*?\]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        homeActiveGameSnippet.textContent = cleanSnippet || '(Análise sem texto ainda...)';
      }

      if (homeActiveGameMeta) {
        const formattedDate = ReviewManager.formatDate(currentActiveReview.updatedAt || currentActiveReview.createdAt);
        const charsCount = (currentActiveReview.content || '').length;
        const wordsCount = (currentActiveReview.content || '').trim() ? (currentActiveReview.content || '').trim().split(/\s+/).length : 0;
        homeActiveGameMeta.innerHTML = `<span>Última edição: ${formattedDate}</span> • <span>${charsCount.toLocaleString('pt-BR')} caracteres</span> • <span>${wordsCount.toLocaleString('pt-BR')} palavras</span>`;
      }
    } else if (homeResumeSection) {
      homeResumeSection.style.display = 'none';
    }
  }

  // Home Quick Action Handlers
  if (btnHomeNewReview) {
    btnHomeNewReview.addEventListener('click', () => openNewReviewPrompt());
  }

  if (btnHomeImportBackup) {
    btnHomeImportBackup.addEventListener('click', () => {
      importPreviewBox.style.display = 'none';
      pendingImportContent = null;
      openModal(backupModal);
    });
  }

  if (btnHomeGoEditor) {
    btnHomeGoEditor.addEventListener('click', () => switchMainView('editor'));
  }

  if (btnHomeGoReviews) {
    btnHomeGoReviews.addEventListener('click', () => switchMainView('reviews'));
  }

  if (btnHomeResumeActive) {
    btnHomeResumeActive.addEventListener('click', () => switchMainView('editor'));
  }

  // ==========================================
  // Layout Management (Side-by-Side vs Stacked)
  // ==========================================
  function setLayout(mode, showNotification = false) {
    const isStacked = mode === 'stacked';
    if (isStacked) {
      appContainer.classList.add('layout-stacked');
    } else {
      appContainer.classList.remove('layout-stacked');
    }

    if (layoutOptionItems && layoutOptionItems.length > 0) {
      layoutOptionItems.forEach(item => {
        item.classList.toggle('active', item.dataset.layout === (isStacked ? 'stacked' : 'side-by-side'));
      });
    }

    localStorage.setItem('steam_editor_layout_preference', isStacked ? 'stacked' : 'side-by-side');

    if (showNotification) {
      showToast(`Layout alterado para: ${isStacked ? 'Empilhado (1 Coluna)' : 'Lado a Lado (2 Colunas)'}`);
    }
  }

  // ==========================================
  // Color Themes Management
  // ==========================================
  const THEME_NAMES = {
    'theme-default': 'Tema Padrão',
    'theme-steam2003': 'Steam 2003',
    'theme-steam2011': 'Steam 2011',
    'theme-frutiger-aero': 'Frutiger Aero',
    'theme-oled': 'Tela OLED'
  };

  function setTheme(themeId, showNotification = false) {
    const targetTheme = THEME_NAMES[themeId] ? themeId : 'theme-default';

    document.documentElement.setAttribute('data-theme', targetTheme);
    document.body.setAttribute('data-theme', targetTheme);

    if (themeOptionItems && themeOptionItems.length > 0) {
      themeOptionItems.forEach(item => {
        item.classList.toggle('active', item.dataset.theme === targetTheme);
      });
    }

    localStorage.setItem('steamer_theme_preference', targetTheme);

    if (showNotification) {
      showToast(`Tema alterado para: ${THEME_NAMES[targetTheme]}`);
    }
  }

  // ==========================================
  // Unified Appearance Dropdown Controller
  // ==========================================
  if (btnAppearanceMenu && appearanceSelectorWrap) {
    btnAppearanceMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = appearanceSelectorWrap.classList.toggle('open');
      btnAppearanceMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('click', (e) => {
    if (appearanceSelectorWrap && !appearanceSelectorWrap.contains(e.target)) {
      appearanceSelectorWrap.classList.remove('open');
      if (btnAppearanceMenu) {
        btnAppearanceMenu.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (layoutOptionItems && layoutOptionItems.length > 0) {
    layoutOptionItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const layoutMode = item.dataset.layout;
        if (layoutMode) {
          setLayout(layoutMode, true);
        }
      });
    });
  }

  if (themeOptionItems && themeOptionItems.length > 0) {
    themeOptionItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = item.dataset.theme;
        if (themeId) {
          setTheme(themeId, true);
        }
      });
    });
  }

  // ==========================================
  // Modal Management
  // ==========================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('show');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
  }

  document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target);
    }
  });

  // ==========================================
  // Review Project Management & Auto-Save
  // ==========================================
  function triggerAutoSave() {
    if (!currentActiveReview) return;

    const dot = saveStatusIndicator ? saveStatusIndicator.querySelector('.save-status-dot') : null;
    if (dot) dot.classList.add('saving');
    if (saveStatusText) saveStatusText.textContent = 'Salvando...';

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      ReviewManager.update(currentActiveReview.id, {
        content: editor.value,
        notes: gameNotesArea.value,
        recommended: currentActiveReview.recommended
      });

      if (dot) dot.classList.remove('saving');
      if (saveStatusText) saveStatusText.textContent = 'Salvo automaticamente';
      updateNavBadge();
      if (currentMainView === 'reviews') {
        renderDashboard();
      } else if (currentMainView === 'home') {
        renderHome();
      }
    }, 350);
  }

  function loadReviewIntoUI(review) {
    if (!review) return;
    currentActiveReview = review;
    ReviewManager.setActiveId(review.id);

    // Active title bar
    if (activeGameTitleText) {
      activeGameTitleText.textContent = review.title || 'Análise Sem Título';
    }

    // Recommendation State
    setRecommendationUI(typeof review.recommended === 'boolean' ? review.recommended : true, false);

    // Load content & notes
    editor.value = review.content || '';
    gameNotesArea.value = review.notes || '';

    // If popout window is open, sync it
    if (popoutNotesWindow && !popoutNotesWindow.closed) {
      updatePopoutWindowContent();
    }

    // Refresh UI states
    updateNotesStats();
    updateEditorStats();
    updateNavBadge();
    if (currentMainView === 'home') {
      renderHome();
    }
  }

  function updateNavBadge() {
    const total = ReviewManager.getAll().length;
    if (reviewsNavBadge) {
      reviewsNavBadge.textContent = total;
    }
    if (homeReviewsCountBadge) {
      homeReviewsCountBadge.textContent = total;
    }
  }

  function updateNotesBadge() {
    const hasNotes = gameNotesArea.value.trim().length > 0;
    if (tabNotes) {
      tabNotes.classList.toggle('has-notes', hasNotes);
    }
  }

  function updateNotesStats() {
    const len = gameNotesArea.value.length;
    if (notesCharCounter) {
      notesCharCounter.textContent = len.toLocaleString('pt-BR');
    }
    updateNotesBadge();
  }

  // ==========================================
  // Recommendation Selector & Live Steam Preview
  // ==========================================
  function setRecommendationUI(isRecommended, triggerSave = true) {
    if (currentActiveReview) {
      currentActiveReview.recommended = isRecommended;
    }

    // Toggle Buttons in Editor
    if (btnRecommendPositive && btnRecommendNegative) {
      btnRecommendPositive.classList.toggle('active', isRecommended);
      btnRecommendNegative.classList.toggle('active', !isRecommended);
    }

    // Update Live Steam Preview Card
    if (steamThumbIcon && steamThumbSvg && steamVerdictText) {
      if (isRecommended) {
        steamThumbIcon.className = 'steam-thumb-icon positive';
        steamThumbIcon.title = 'Recomendado';
        steamThumbSvg.innerHTML = SVG_THUMB_UP;
        steamVerdictText.className = 'steam-verdict';
        steamVerdictText.textContent = 'RECOMENDADO';
      } else {
        steamThumbIcon.className = 'steam-thumb-icon negative';
        steamThumbIcon.title = 'Não Recomendado';
        steamThumbSvg.innerHTML = SVG_THUMB_DOWN;
        steamVerdictText.className = 'steam-verdict negative';
        steamVerdictText.textContent = 'NÃO RECOMENDADO';
      }
    }

    if (triggerSave) {
      triggerAutoSave();
    }
  }

  btnRecommendPositive.addEventListener('click', () => {
    setRecommendationUI(true, true);
    showToast('Classificação definida como: Recomendo');
  });

  btnRecommendNegative.addEventListener('click', () => {
    setRecommendationUI(false, true);
    showToast('Classificação definida como: Não Recomendo', 'warning');
  });

  // ==========================================
  // Editor Character Counter & Live Render
  // ==========================================
  function updateEditorStats() {
    let content = editor.value;
    
    // Strict limit enforcement
    if (content.length > MAX_STEAM_CHARS) {
      content = content.substring(0, MAX_STEAM_CHARS);
      editor.value = content;
      showToast(`Limite máximo de ${MAX_STEAM_CHARS} caracteres atingido!`, 'warning');
    }

    const currentLen = content.length;
    charCounter.textContent = `${currentLen.toLocaleString('pt-BR')} / ${MAX_STEAM_CHARS.toLocaleString('pt-BR')}`;
    
    const percentage = Math.min(100, (currentLen / MAX_STEAM_CHARS) * 100);
    progressBar.style.width = `${percentage}%`;

    // Visual warning classes
    if (currentLen >= MAX_STEAM_CHARS) {
      charCounter.className = 'counter-text danger';
      progressBar.className = 'progress-bar-fill danger';
    } else if (currentLen >= WARN_STEAM_CHARS) {
      charCounter.className = 'counter-text warning';
      progressBar.className = 'progress-bar-fill warning';
    } else {
      charCounter.className = 'counter-text';
      progressBar.className = 'progress-bar-fill';
    }

    // Word & Line stats
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content ? content.split('\n').length : 0;
    if (wordCounter) wordCounter.textContent = words.toLocaleString('pt-BR');
    if (lineCounter) lineCounter.textContent = lines.toLocaleString('pt-BR');

    // Live Render
    renderLivePreview();
  }

  function renderLivePreview() {
    const raw = editor.value;
    const renderedHtml = SteamBBCode.render(raw);
    
    if (raw.trim() === '') {
      previewContent.innerHTML = '<p style="color: #626c75; font-style: italic;">O conteúdo formatado da sua análise na Steam aparecerá aqui em tempo real...</p>';
    } else {
      previewContent.innerHTML = renderedHtml;
    }
  }

  // Textarea input events
  editor.addEventListener('input', () => {
    updateEditorStats();
    triggerAutoSave();
  });
  editor.addEventListener('paste', () => {
    setTimeout(() => {
      updateEditorStats();
      triggerAutoSave();
    }, 10);
  });

  gameNotesArea.addEventListener('input', () => {
    updateNotesStats();
    triggerAutoSave();
    if (popoutNotesWindow && !popoutNotesWindow.closed) {
      const popoutTextarea = popoutNotesWindow.document.getElementById('popoutNotesTextarea');
      if (popoutTextarea && popoutTextarea.value !== gameNotesArea.value) {
        popoutTextarea.value = gameNotesArea.value;
      }
    }
  });

  // Handle Tab key inside textareas
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      updateEditorStats();
      triggerAutoSave();
    }
  });

  gameNotesArea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = gameNotesArea.selectionStart;
      const end = gameNotesArea.selectionEnd;
      gameNotesArea.value = gameNotesArea.value.substring(0, start) + '  ' + gameNotesArea.value.substring(end);
      gameNotesArea.selectionStart = gameNotesArea.selectionEnd = start + 2;
      updateNotesStats();
      triggerAutoSave();
    }
  });

  // ==========================================
  // Right Panel Tabs (Live Preview vs Notes)
  // ==========================================
  function switchRightPanelTab(tabName) {
    tabPreview.classList.toggle('active', tabName === 'preview');
    tabNotes.classList.toggle('active', tabName === 'notes');

    viewPreview.style.display = (tabName === 'preview') ? 'block' : 'none';
    viewNotes.classList.toggle('active', tabName === 'notes');

    if (tabName === 'notes' && (!popoutNotesWindow || popoutNotesWindow.closed)) {
      gameNotesArea.focus();
    }
  }

  tabPreview.addEventListener('click', () => switchRightPanelTab('preview'));
  tabNotes.addEventListener('click', () => switchRightPanelTab('notes'));

  // ==========================================
  // Scratchpad Actions (Insert, Copy, Clear)
  // ==========================================
  btnInsertNoteToReview.addEventListener('click', () => {
    const selStart = gameNotesArea.selectionStart;
    const selEnd = gameNotesArea.selectionEnd;
    let textToInsert = '';

    if (selStart !== selEnd) {
      textToInsert = gameNotesArea.value.substring(selStart, selEnd);
    } else {
      textToInsert = gameNotesArea.value;
    }

    if (!textToInsert.trim()) {
      showToast('O bloco de notas está vazio.', 'warning');
      return;
    }

    insertAtCursor('\n' + textToInsert.trim() + '\n');
    showToast('Anotação inserida no editor da review!');
  });

  btnCopyNotes.addEventListener('click', () => {
    const text = gameNotesArea.value;
    if (!text.trim()) {
      showToast('O bloco de notas está vazio.', 'warning');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Anotações copiadas para a área de transferência!');
      });
    }
  });

  btnClearNotes.addEventListener('click', () => {
    if (!gameNotesArea.value.trim()) return;
    if (confirm('Tem certeza que deseja limpar as anotações deste jogo?')) {
      gameNotesArea.value = '';
      updateNotesStats();
      triggerAutoSave();
      if (popoutNotesWindow && !popoutNotesWindow.closed) {
        const popoutTextarea = popoutNotesWindow.document.getElementById('popoutNotesTextarea');
        if (popoutTextarea) popoutTextarea.value = '';
      }
      showToast('Bloco de notas limpo.');
    }
  });

  // ==========================================
  // Detached Popout Window for Notes
  // ==========================================
  function openNotesPopout() {
    if (popoutNotesWindow && !popoutNotesWindow.closed) {
      popoutNotesWindow.focus();
      return;
    }

    const title = currentActiveReview ? currentActiveReview.title : 'Análise';
    popoutNotesWindow = window.open('', 'steam_notes_popout_' + (currentActiveReview ? currentActiveReview.id : 'temp'), 'width=580,height=680,resizable=yes,scrollbars=yes');

    if (!popoutNotesWindow) {
      showToast('O bloqueador de popups impediu a abertura da janela. Permita popups para este site.', 'danger');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>📝 Bloco de Notas: ${SteamBBCode.escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0e141b;
      color: #e1e7ee;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .popout-header {
      background: linear-gradient(180deg, #171a21 0%, #1b2838 100%);
      border-bottom: 1px solid #2a374a;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .popout-title {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .popout-sync-badge {
      font-size: 0.7rem;
      color: #a4d007;
      background: rgba(164, 208, 7, 0.15);
      padding: 2px 8px;
      border-radius: 10px;
      border: 1px solid rgba(164, 208, 7, 0.3);
    }
    .popout-toolbar {
      background-color: #1a222e;
      border-bottom: 1px solid #2a374a;
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .btn {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid #2a374a;
      background-color: #1e2633;
      color: #e1e7ee;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn:hover { background-color: #2a475e; color: #fff; border-color: #66c0f4; }
    .btn-primary {
      background: linear-gradient(135deg, #1999e3 0%, #115082 100%);
      color: #fff;
      border-color: rgba(102, 192, 244, 0.4);
    }
    .btn-primary:hover { background: linear-gradient(135deg, #2cb0fd 0%, #1562a0 100%); }
    .notes-area {
      flex: 1;
      width: 100%;
      background-color: #12171f;
      color: #fef08a;
      border: none;
      padding: 16px;
      font-size: 0.95rem;
      line-height: 1.6;
      font-family: inherit;
      resize: none;
      outline: none;
    }
    .popout-footer {
      background-color: #141b24;
      border-top: 1px solid #2a374a;
      padding: 8px 16px;
      font-size: 0.75rem;
      color: #8f98a0;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="popout-header">
    <div class="popout-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;color:var(--star-gold, #fcd34d);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span id="popoutGameTitle">${SteamBBCode.escapeHtml(title)}</span>
    </div>
    <span class="popout-sync-badge">● Sincronizado</span>
  </div>
  <div class="popout-toolbar">
    <div style="display: flex; gap: 6px;">
      <button id="btnPopoutInsertToReview" class="btn btn-primary" title="Enviar texto selecionado para a análise na janela principal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Inserir na Review
      </button>
      <button id="btnPopoutCopy" class="btn" title="Copiar anotações">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copiar
      </button>
    </div>
    <div>
      <button id="btnPopoutClear" class="btn" title="Limpar anotações">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        Limpar
      </button>
    </div>
  </div>
  <textarea id="popoutNotesTextarea" class="notes-area" placeholder="Digite suas anotações aqui... Elas sincronizam em tempo real com a janela principal!">${SteamBBCode.escapeHtml(gameNotesArea.value)}</textarea>
  <div class="popout-footer">
    <span>Salvo automaticamente com a review</span>
    <span id="popoutCharCount">${gameNotesArea.value.length.toLocaleString('pt-BR')} caracteres</span>
  </div>
</body>
</html>`;

    popoutNotesWindow.document.open();
    popoutNotesWindow.document.write(htmlContent);
    popoutNotesWindow.document.close();

    // Show detached notice in main window
    notesDetachedNotice.classList.add('show');
    notesMainControls.style.display = 'none';

    // Hook events inside popout window
    popoutNotesWindow.addEventListener('load', () => {
      const popoutTextarea = popoutNotesWindow.document.getElementById('popoutNotesTextarea');
      const popoutCharCount = popoutNotesWindow.document.getElementById('popoutCharCount');
      const btnInsert = popoutNotesWindow.document.getElementById('btnPopoutInsertToReview');
      const btnCopy = popoutNotesWindow.document.getElementById('btnPopoutCopy');
      const btnClear = popoutNotesWindow.document.getElementById('btnPopoutClear');

      if (popoutTextarea) {
        popoutTextarea.focus();
        popoutTextarea.addEventListener('input', () => {
          gameNotesArea.value = popoutTextarea.value;
          updateNotesStats();
          triggerAutoSave();
          if (popoutCharCount) {
            popoutCharCount.textContent = `${popoutTextarea.value.length.toLocaleString('pt-BR')} caracteres`;
          }
        });
      }

      if (btnInsert) {
        btnInsert.addEventListener('click', () => {
          const selStart = popoutTextarea.selectionStart;
          const selEnd = popoutTextarea.selectionEnd;
          let text = '';
          if (selStart !== selEnd) {
            text = popoutTextarea.value.substring(selStart, selEnd);
          } else {
            text = popoutTextarea.value;
          }
          if (text.trim()) {
            insertAtCursor('\n' + text.trim() + '\n');
            showToast('Anotação inserida no editor da review!');
          }
        });
      }

      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          if (popoutTextarea.value.trim()) {
            navigator.clipboard.writeText(popoutTextarea.value).then(() => {
              showToast('Anotações copiadas!');
            });
          }
        });
      }

      if (btnClear) {
        btnClear.addEventListener('click', () => {
          if (popoutTextarea.value.trim() && popoutNotesWindow.confirm('Limpar todas as anotações?')) {
            popoutTextarea.value = '';
            gameNotesArea.value = '';
            updateNotesStats();
            triggerAutoSave();
            if (popoutCharCount) popoutCharCount.textContent = '0 caracteres';
          }
        });
      }
    });

    popoutNotesWindow.addEventListener('beforeunload', () => {
      popoutNotesWindow = null;
      notesDetachedNotice.classList.remove('show');
      notesMainControls.style.display = 'flex';
      updateNotesStats();
    });

    showToast('Bloco de notas desprendido em janela flutuante!');
  }

  function updatePopoutWindowContent() {
    if (!popoutNotesWindow || popoutNotesWindow.closed) return;
    try {
      const popoutTitle = popoutNotesWindow.document.getElementById('popoutGameTitle');
      const popoutTextarea = popoutNotesWindow.document.getElementById('popoutNotesTextarea');
      const popoutCharCount = popoutNotesWindow.document.getElementById('popoutCharCount');

      if (popoutTitle && currentActiveReview) {
        popoutTitle.textContent = currentActiveReview.title;
        popoutNotesWindow.document.title = `Bloco de Notas: ${currentActiveReview.title}`;
      }
      if (popoutTextarea && gameNotesArea) {
        popoutTextarea.value = gameNotesArea.value;
      }
      if (popoutCharCount && gameNotesArea) {
        popoutCharCount.textContent = `${gameNotesArea.value.length.toLocaleString('pt-BR')} caracteres`;
      }
    } catch (e) {
      console.warn('Error updating popout window:', e);
    }
  }

  btnPopoutNotes.addEventListener('click', openNotesPopout);

  btnReattachNotes.addEventListener('click', () => {
    if (popoutNotesWindow && !popoutNotesWindow.closed) {
      popoutNotesWindow.close();
    }
    popoutNotesWindow = null;
    notesDetachedNotice.classList.remove('show');
    notesMainControls.style.display = 'flex';
    gameNotesArea.focus();
    showToast('Bloco de notas reacoplado!');
  });

  // ==========================================
  // Dedicated "Minhas Reviews" Dashboard Controller
  // ==========================================
  function renderDashboard() {
    const allReviews = ReviewManager.getAll();

    // 1. Calculate and update stats cards
    let positiveCount = 0;
    let negativeCount = 0;
    let totalWordsCount = 0;

    allReviews.forEach(r => {
      if (r.recommended !== false) positiveCount++;
      else negativeCount++;

      const words = (r.content || '').trim() ? (r.content || '').trim().split(/\s+/).length : 0;
      totalWordsCount += words;
    });

    if (dashStatTotal) dashStatTotal.textContent = allReviews.length;
    if (dashStatPos) dashStatPos.textContent = positiveCount;
    if (dashStatNeg) dashStatNeg.textContent = negativeCount;
    if (dashStatWords) dashStatWords.textContent = totalWordsCount.toLocaleString('pt-BR');

    // 2. Filter reviews
    const searchQuery = (dashboardSearchInput ? dashboardSearchInput.value.trim().toLowerCase() : '');
    if (btnDashboardClearSearch) {
      btnDashboardClearSearch.style.display = searchQuery ? 'block' : 'none';
    }

    let filtered = allReviews.filter(rev => {
      // Search text filter
      if (searchQuery) {
        const titleMatch = (rev.title || '').toLowerCase().includes(searchQuery);
        const contentMatch = (rev.content || '').toLowerCase().includes(searchQuery);
        const notesMatch = (rev.notes || '').toLowerCase().includes(searchQuery);
        if (!titleMatch && !contentMatch && !notesMatch) return false;
      }

      // Filter chips
      if (currentDashboardFilter === 'pos') {
        return rev.recommended !== false;
      } else if (currentDashboardFilter === 'neg') {
        return rev.recommended === false;
      } else if (currentDashboardFilter === 'notes') {
        return (rev.notes || '').trim().length > 0;
      }
      return true;
    });

    // 3. Sort reviews
    const sortMode = dashboardSortSelect ? dashboardSortSelect.value : 'date-desc';
    filtered.sort((a, b) => {
      if (sortMode === 'date-desc') return (b.updatedAt || 0) - (a.updatedAt || 0);
      if (sortMode === 'date-asc') return (a.updatedAt || 0) - (b.updatedAt || 0);
      if (sortMode === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortMode === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      if (sortMode === 'size-desc') return (b.content || '').length - (a.content || '').length;
      if (sortMode === 'size-asc') return (a.content || '').length - (b.content || '').length;
      if (sortMode === 'recommend-pos') return (b.recommended === false ? 0 : 1) - (a.recommended === false ? 0 : 1);
      if (sortMode === 'recommend-neg') return (a.recommended === false ? 0 : 1) - (b.recommended === false ? 0 : 1);
      return 0;
    });

    // 4. Render Grid Cards, Blog Feed or Empty State
    dashboardReviewsGrid.innerHTML = '';
    dashboardReviewsBlog.innerHTML = '';

    if (filtered.length === 0) {
      dashboardReviewsGrid.style.display = 'none';
      dashboardReviewsBlog.style.display = 'none';
      dashboardEmptyState.style.display = 'flex';
      if (allReviews.length === 0) {
        emptyStateTitle.textContent = 'Nenhuma análise salva ainda';
        emptyStateDesc.textContent = 'Clique no botão abaixo para criar a sua primeira análise de jogo com o SteamER!';
        btnEmptyStateNewReview.style.display = 'inline-flex';
      } else {
        emptyStateTitle.textContent = 'Nenhum resultado encontrado';
        emptyStateDesc.textContent = 'Nenhuma análise corresponde aos filtros ou termo de busca pesquisado.';
        btnEmptyStateNewReview.style.display = 'none';
      }
      return;
    }

    dashboardEmptyState.style.display = 'none';

    // ----------------------------------------------------
    // MODE A: GRID / CARDS VIEW
    // ----------------------------------------------------
    if (currentDashboardViewMode === 'grid') {
      dashboardReviewsGrid.style.display = 'grid';
      dashboardReviewsBlog.style.display = 'none';

      filtered.forEach(rev => {
        const isCurrentActive = currentActiveReview && currentActiveReview.id === rev.id;
        const isPos = rev.recommended !== false;
        const card = document.createElement('div');
        card.className = `dash-review-card ${isCurrentActive ? 'active-in-editor' : ''}`;

        const formattedDate = ReviewManager.formatDate(rev.updatedAt || rev.createdAt);
        const charsCount = (rev.content || '').length;
        const wordsCount = (rev.content || '').trim() ? (rev.content || '').trim().split(/\s+/).length : 0;
        const hasNotes = (rev.notes || '').trim().length > 0;

        const cleanSnippet = (rev.content || '')
          .replace(/\[\/?.*?\]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        card.innerHTML = `
          <div class="dash-card-header">
            <div class="dash-card-title-group">
              <div class="dash-card-title">
                <span>${SteamBBCode.escapeHtml(rev.title || 'Análise Sem Título')}</span>
              </div>
              <div class="dash-card-recommend-badge ${isPos ? 'pos' : 'neg'}">
                <svg viewBox="0 0 24 24" fill="currentColor">${isPos ? SVG_THUMB_UP : SVG_THUMB_DOWN}</svg>
                <span>${isPos ? 'Recomendado' : 'Não Recomendado'}</span>
              </div>
            </div>
            ${isCurrentActive ? '<span class="history-active-badge">Aberta no Editor</span>' : ''}
          </div>

          <div class="dash-card-snippet">
            ${cleanSnippet || '<span style="color:#626c75; font-style:italic;">(Análise vazia)</span>'}
          </div>

          <div class="dash-card-meta-row">
            <span>${formattedDate}</span>
            <span>${charsCount.toLocaleString('pt-BR')} chars • ${wordsCount.toLocaleString('pt-BR')} pal.</span>
            ${hasNotes ? '<span style="color:var(--star-gold); display:inline-flex; align-items:center; gap:3px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:11px;height:11px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Notas</span>' : ''}
          </div>

          <div class="dash-card-actions">
            <div class="dash-card-actions-left">
              <button class="btn btn-primary btn-sm btn-card-open" title="Abrir esta review no editor" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Abrir no Editor
              </button>
              <button class="btn btn-secondary btn-sm btn-card-copy" title="Copiar código formatado BBCode" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copiar
              </button>
            </div>
            <div class="dash-card-actions-right">
              <button class="btn btn-secondary btn-sm btn-card-dup" title="Duplicar esta review" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="btn btn-secondary btn-sm btn-card-rename" title="Renomear jogo" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-danger btn-sm btn-card-del" title="Excluir review" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        `;

        // Event Handlers for Grid Card Actions
        card.querySelector('.btn-card-open').addEventListener('click', () => {
          loadReviewIntoUI(rev);
          switchMainView('editor');
          showToast(`Review "${rev.title}" aberta no editor!`);
        });

        card.querySelector('.btn-card-copy').addEventListener('click', () => {
          const text = rev.content || '';
          if (!text.trim()) {
            showToast('Esta review está vazia.', 'warning');
            return;
          }
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              showToast(`BBCode de "${rev.title}" copiado com sucesso!`);
            });
          }
        });

        card.querySelector('.btn-card-dup').addEventListener('click', () => {
          try {
            const cloned = ReviewManager.duplicate(rev.id);
            renderDashboard();
            updateNavBadge();
            showToast(`Cópia de "${rev.title}" criada!`);
          } catch (e) {
            showToast(e.message, 'danger');
          }
        });

        card.querySelector('.btn-card-rename').addEventListener('click', () => {
          openRenameModal(rev.id, rev.title);
        });

        card.querySelector('.btn-card-del').addEventListener('click', () => {
          if (confirm(`Tem certeza que deseja excluir a análise de "${rev.title}"?`)) {
            ReviewManager.delete(rev.id);
            if (currentActiveReview && currentActiveReview.id === rev.id) {
              const nextActive = ReviewManager.getOrCreateActive();
              loadReviewIntoUI(nextActive);
            }
            renderDashboard();
            updateNavBadge();
            showToast(`Análise de "${rev.title}" excluída.`);
          }
        });

        dashboardReviewsGrid.appendChild(card);
      });
    }

    // ----------------------------------------------------
    // MODE B: STEAM BLOG FEED VIEW
    // ----------------------------------------------------
    if (currentDashboardViewMode === 'blog') {
      dashboardReviewsGrid.style.display = 'none';
      dashboardReviewsBlog.style.display = 'flex';

      filtered.forEach(rev => {
        const isCurrentActive = currentActiveReview && currentActiveReview.id === rev.id;
        const isPos = rev.recommended !== false;
        const blogCard = document.createElement('article');
        blogCard.className = `steam-blog-card ${isCurrentActive ? 'active-in-editor' : ''}`;

        const formattedDate = ReviewManager.formatDate(rev.updatedAt || rev.createdAt);
        const charsCount = (rev.content || '').length;
        const wordsCount = (rev.content || '').trim() ? (rev.content || '').trim().split(/\s+/).length : 0;
        const hasNotes = (rev.notes || '').trim().length > 0;
        const renderedHtml = SteamBBCode.render(rev.content || '');

        blogCard.innerHTML = `
          <header class="steam-blog-header">
            <div class="steam-blog-header-left">
              <div class="steam-thumb-icon ${isPos ? 'positive' : 'negative'}" title="${isPos ? 'Recomendado' : 'Não Recomendado'}">
                <svg viewBox="0 0 24 24" fill="currentColor">${isPos ? SVG_THUMB_UP : SVG_THUMB_DOWN}</svg>
              </div>
              <div class="steam-blog-game-badge">
                <div class="steam-blog-game-title">
                  <span>${SteamBBCode.escapeHtml(rev.title || 'Análise Sem Título')}</span>
                </div>
                <div class="steam-blog-verdict-row">
                  <span class="steam-blog-verdict-text ${isPos ? 'pos' : 'neg'}">${isPos ? 'RECOMENDADO' : 'NÃO RECOMENDADO'}</span>
                  <span style="color:var(--text-muted); font-size:0.75rem;">• Postado: ${formattedDate}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${isCurrentActive ? '<span class="history-active-badge">Aberta no Editor</span>' : ''}
            </div>
          </header>

          <div class="steam-blog-body steam-content">
            ${renderedHtml || '<p style="color: #626c75; font-style: italic;">(Análise vazia)</p>'}
          </div>

          ${hasNotes ? `
            <div class="steam-blog-notes-box">
              <div class="steam-blog-notes-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>Bloco de Notas Pessoal deste jogo:</span>
              </div>
              <div class="steam-blog-notes-content">${SteamBBCode.escapeHtml(rev.notes)}</div>
            </div>
          ` : ''}

          <footer class="steam-blog-footer">
            <div class="steam-blog-stats">
              <span>Última edição: ${formattedDate}</span>
              <span style="margin: 0 6px;">•</span>
              <span>${charsCount.toLocaleString('pt-BR')} caracteres</span>
              <span style="margin: 0 6px;">•</span>
              <span>${wordsCount.toLocaleString('pt-BR')} palavras</span>
            </div>
            <div class="steam-blog-actions">
              <button class="btn btn-primary btn-sm btn-blog-open" title="Abrir esta review no editor" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Editar Análise
              </button>
              <button class="btn btn-secondary btn-sm btn-blog-copy" title="Copiar código formatado BBCode" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copiar BBCode
              </button>
              <button class="btn btn-secondary btn-sm btn-blog-download" title="Baixar análise em arquivo .txt" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Baixar .txt
              </button>
              <button class="btn btn-secondary btn-sm btn-blog-dup" title="Duplicar esta review" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="btn btn-danger btn-sm btn-blog-del" title="Excluir review" data-id="${rev.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </footer>
        `;

        // Event Handlers for Blog Actions
        blogCard.querySelector('.btn-blog-open').addEventListener('click', () => {
          loadReviewIntoUI(rev);
          switchMainView('editor');
          showToast(`Review "${rev.title}" aberta no editor!`);
        });

        blogCard.querySelector('.btn-blog-copy').addEventListener('click', () => {
          const text = rev.content || '';
          if (!text.trim()) {
            showToast('Esta review está vazia.', 'warning');
            return;
          }
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              showToast(`BBCode de "${rev.title}" copiado com sucesso!`);
            });
          }
        });

        blogCard.querySelector('.btn-blog-download').addEventListener('click', () => {
          const text = rev.content || '';
          if (!text.trim()) {
            showToast('Esta review está vazia para download.', 'warning');
            return;
          }
          const safeTitle = (rev.title || 'steam_review').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${safeTitle}_${new Date().toISOString().split('T')[0]}.txt`;
          a.click();
          URL.revokeObjectURL(url);
          showToast(`Download de "${rev.title}" iniciado!`);
        });

        blogCard.querySelector('.btn-blog-dup').addEventListener('click', () => {
          try {
            ReviewManager.duplicate(rev.id);
            renderDashboard();
            updateNavBadge();
            showToast(`Cópia de "${rev.title}" criada!`);
          } catch (e) {
            showToast(e.message, 'danger');
          }
        });

        blogCard.querySelector('.btn-blog-del').addEventListener('click', () => {
          if (confirm(`Tem certeza que deseja excluir a análise de "${rev.title}"?`)) {
            ReviewManager.delete(rev.id);
            if (currentActiveReview && currentActiveReview.id === rev.id) {
              const nextActive = ReviewManager.getOrCreateActive();
              loadReviewIntoUI(nextActive);
            }
            renderDashboard();
            updateNavBadge();
            showToast(`Análise de "${rev.title}" excluída.`);
          }
        });

        dashboardReviewsBlog.appendChild(blogCard);
      });
    }
  }

  // View Mode Switcher Listeners (Cards vs Blog)
  if (btnDashViewGrid && btnDashViewBlog) {
    btnDashViewGrid.addEventListener('click', () => {
      currentDashboardViewMode = 'grid';
      btnDashViewGrid.classList.add('active');
      btnDashViewBlog.classList.remove('active');
      renderDashboard();
    });

    btnDashViewBlog.addEventListener('click', () => {
      currentDashboardViewMode = 'blog';
      btnDashViewBlog.classList.add('active');
      btnDashViewGrid.classList.remove('active');
      renderDashboard();
    });
  }

  // Dashboard Filters & Search Listeners
  if (dashboardSearchInput) {
    dashboardSearchInput.addEventListener('input', () => renderDashboard());
  }

  if (btnDashboardClearSearch) {
    btnDashboardClearSearch.addEventListener('click', () => {
      dashboardSearchInput.value = '';
      renderDashboard();
      dashboardSearchInput.focus();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentDashboardFilter = chip.dataset.filter;
      renderDashboard();
    });
  });

  if (dashboardSortSelect) {
    dashboardSortSelect.addEventListener('change', () => renderDashboard());
  }

  if (btnDashboardNewReview) {
    btnDashboardNewReview.addEventListener('click', () => openNewReviewPrompt());
  }

  if (btnEmptyStateNewReview) {
    btnEmptyStateNewReview.addEventListener('click', () => openNewReviewPrompt());
  }

  if (btnDashboardBackup) {
    btnDashboardBackup.addEventListener('click', () => openModal(backupModal));
  }

  // About Modal Listener
  if (btnOpenAboutModal && aboutModal) {
    btnOpenAboutModal.addEventListener('click', () => openModal(aboutModal));
  }

  // ==========================================
  // Backup System Controller (Export & Validated Import)
  // ==========================================
  if (btnOpenBackupModal) {
    btnOpenBackupModal.addEventListener('click', () => {
      importPreviewBox.style.display = 'none';
      pendingImportContent = null;
      openModal(backupModal);
    });
  }

  // 1. Export JSON Backup
  if (btnExportFullBackup) {
    btnExportFullBackup.addEventListener('click', () => {
      const jsonStr = ReviewManager.exportFullBackupJSON();
      const dateStr = new Date().toISOString().split('T')[0];
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `steamer_backup_${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup completo baixado com sucesso!');
    });
  }

  // 2. Select Import File
  if (btnSelectBackupFile && backupFileInput) {
    btnSelectBackupFile.addEventListener('click', () => {
      backupFileInput.value = '';
      backupFileInput.click();
    });

    backupFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const parsed = JSON.parse(content);
          const validation = ReviewManager.validateBackupData(parsed);

          if (!validation.valid) {
            importPreviewBox.style.display = 'flex';
            importFileStatusDot.style.backgroundColor = 'var(--status-danger)';
            importFileName.textContent = file.name;
            importSummaryText.innerHTML = `<span style="color:#ef4444;"><strong>Arquivo Inválido:</strong> ${validation.error}</span>`;
            btnImportReplaceAll.style.display = 'none';
            btnImportMerge.style.display = 'none';
            pendingImportContent = null;
            return;
          }

          // Valid backup
          pendingImportContent = content;
          importPreviewBox.style.display = 'flex';
          importFileStatusDot.style.backgroundColor = 'var(--steam-green)';
          importFileName.textContent = file.name;
          importSummaryText.innerHTML = `
            <div><strong style="color:var(--steam-green);">Arquivo de Backup Válido</strong></div>
            <div style="margin-top:4px;">• <strong>${validation.reviewCount}</strong> review(s) encontradas</div>
            <div>• <strong>${validation.templateCount}</strong> molde(s) personalizados encontrados</div>
            <div style="margin-top:6px; font-size:0.78rem; color:var(--text-secondary);">Escolha abaixo se deseja <strong>Substituir Tudo</strong> ou <strong>Mesclar</strong> com suas reviews atuais.</div>
          `;
          btnImportReplaceAll.style.display = 'inline-flex';
          btnImportMerge.style.display = 'inline-flex';
        } catch (err) {
          importPreviewBox.style.display = 'flex';
          importFileStatusDot.style.backgroundColor = 'var(--status-danger)';
          importFileName.textContent = file.name;
          importSummaryText.innerHTML = `<span style="color:#ef4444;"><strong>Erro ao ler JSON:</strong> ${err.message}</span>`;
          btnImportReplaceAll.style.display = 'none';
          btnImportMerge.style.display = 'none';
          pendingImportContent = null;
        }
      };
      reader.readAsText(file);
    });
  }

  // 3. Confirm Import (Replace vs Merge)
  if (btnImportReplaceAll) {
    btnImportReplaceAll.addEventListener('click', () => {
      if (!pendingImportContent) return;
      if (confirm('Atenção: A opção "Substituir Tudo" apagará as análises locais atuais e restaurará o estado do arquivo de backup. Deseja continuar?')) {
        try {
          const res = ReviewManager.importBackupJSON(pendingImportContent, 'replace');
          populateTemplateSelect();
          const active = ReviewManager.getOrCreateActive();
          loadReviewIntoUI(active);
          renderDashboard();
          updateNavBadge();
          closeModal(backupModal);
          showToast(`Restauração concluída! ${res.reviewsCount} review(s) restauradas.`);
        } catch (err) {
          showToast(err.message, 'danger');
        }
      }
    });
  }

  if (btnImportMerge) {
    btnImportMerge.addEventListener('click', () => {
      if (!pendingImportContent) return;
      try {
        const res = ReviewManager.importBackupJSON(pendingImportContent, 'merge');
        populateTemplateSelect();
        const active = ReviewManager.getOrCreateActive();
        loadReviewIntoUI(active);
        renderDashboard();
        updateNavBadge();
        closeModal(backupModal);
        showToast(`Mesclagem concluída! ${res.reviewsCount} nova(s) review(s) adicionadas.`);
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });
  }

  // 4. Clean Start & Factory Reset (Apagar Tudo)
  if (btnResetAllData) {
    btnResetAllData.addEventListener('click', () => {
      const confirmFirst = confirm(
        'AVISO DE SEGURANÇA:\n\n' +
        'Esta ação apagará permanentemente TODAS as suas análises salvas, todas as anotações do bloco de notas e todos os seus moldes personalizados.\n\n' +
        'Você já realizou o download de um arquivo de backup antes de continuar?\n\n' +
        'Clique em "OK" para prosseguir com o RESET COMPLETO, ou "Cancelar" para voltar e fazer o download do seu backup.'
      );

      if (!confirmFirst) return;

      const confirmSecond = confirm(
        'CONFIRMAÇÃO FINAL:\n\n' +
        'Tem certeza de que deseja redefinir o SteamER para as configurações originais de fábrica?\n\n' +
        'Todos os dados locais serão apagados agora.'
      );

      if (!confirmSecond) return;

      try {
        ReviewManager.resetAllData();
        
        // Reset layout & theme preferences to defaults
        setLayout('side-by-side', false);
        setTheme('theme-default', false);
        
        // Refresh template select dropdown
        populateTemplateSelect();

        // Create fresh clean initial review
        const defaultTpl = TemplateManager.getTemplateById('builtin-prompt-standard');
        const initialContent = defaultTpl ? defaultTpl.content : '';
        const cleanActive = ReviewManager.getOrCreateActive(initialContent);
        loadReviewIntoUI(cleanActive);

        // Update dashboard & navigation badges
        updateNavBadge();
        renderDashboard();
        renderHome();

        // Close backup modal and redirect to Home
        closeModal(backupModal);
        switchMainView('home');

        showToast('Aplicação redefinida com sucesso! Todos os dados foram limpos.');
      } catch (err) {
        showToast('Erro ao redefinir a aplicação: ' + err.message, 'danger');
      }
    });
  }

  // ==========================================
  // Create New Review Flow
  // ==========================================
  function openNewReviewPrompt() {
    newGameTitleInput.value = '';
    newReviewRecommendState = true;
    btnNewReviewPos.classList.add('active');
    btnNewReviewNeg.classList.remove('active');
    newReviewTemplateSelect.value = 'builtin-prompt-standard';
    openModal(newReviewModal);
    setTimeout(() => newGameTitleInput.focus(), 100);
  }

  btnOpenNewReviewModal.addEventListener('click', openNewReviewPrompt);

  btnNewReviewPos.addEventListener('click', () => {
    newReviewRecommendState = true;
    btnNewReviewPos.classList.add('active');
    btnNewReviewNeg.classList.remove('active');
  });

  btnNewReviewNeg.addEventListener('click', () => {
    newReviewRecommendState = false;
    btnNewReviewNeg.classList.add('active');
    btnNewReviewPos.classList.remove('active');
  });

  btnConfirmCreateReview.addEventListener('click', () => {
    const title = newGameTitleInput.value.trim() || 'Nova Análise de Jogo';
    const templateChoice = newReviewTemplateSelect.value;
    let initialContent = '';

    if (templateChoice !== 'blank') {
      const tpl = TemplateManager.getTemplateById(templateChoice);
      if (tpl) initialContent = tpl.content;
    }

    const created = ReviewManager.create(title, initialContent, '', newReviewRecommendState);
    loadReviewIntoUI(created);
    closeModal(newReviewModal);
    switchMainView('editor');
    showToast(`Review para "${title}" criada com sucesso!`);
  });

  // ==========================================
  // Rename Review Flow
  // ==========================================
  function openRenameModal(reviewId, currentTitle) {
    pendingRenameId = reviewId;
    renameGameTitleInput.value = currentTitle || '';
    openModal(renameReviewModal);
    setTimeout(() => renameGameTitleInput.focus(), 100);
  }

  btnRenameActiveGame.addEventListener('click', () => {
    if (currentActiveReview) {
      openRenameModal(currentActiveReview.id, currentActiveReview.title);
    }
  });

  btnConfirmRenameGame.addEventListener('click', () => {
    const newTitle = renameGameTitleInput.value.trim();
    if (!newTitle) {
      showToast('O nome do jogo não pode ser vazio.', 'warning');
      renameGameTitleInput.focus();
      return;
    }

    if (pendingRenameId) {
      ReviewManager.rename(pendingRenameId, newTitle);
      if (currentActiveReview && currentActiveReview.id === pendingRenameId) {
        currentActiveReview.title = newTitle;
        if (activeGameTitleText) activeGameTitleText.textContent = newTitle;
        if (popoutNotesWindow && !popoutNotesWindow.closed) {
          updatePopoutWindowContent();
        }
      }
      closeModal(renameReviewModal);
      renderDashboard();
      showToast('Nome do jogo atualizado!');
    }
  });

  // ==========================================
  // BBCode Insertion & Selection Helpers
  // ==========================================
  function wrapSelection(openTag, closeTag, placeholder = '') {
    editor.focus();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const originalText = editor.value;
    const selectedText = originalText.substring(start, end);

    let replacement = '';
    let newCursorPos = 0;

    if (selectedText.length > 0) {
      replacement = openTag + selectedText + closeTag;
      newCursorPos = start + replacement.length;
    } else {
      replacement = openTag + placeholder + closeTag;
      newCursorPos = start + openTag.length + (placeholder ? placeholder.length : 0);
    }

    if (originalText.length - (end - start) + replacement.length > MAX_STEAM_CHARS) {
      showToast('Inserir esta tag ultrapassaria o limite de 8.000 caracteres.', 'warning');
      return;
    }

    editor.value = originalText.substring(0, start) + replacement + originalText.substring(end);
    
    if (selectedText.length === 0 && placeholder) {
      editor.setSelectionRange(start + openTag.length, start + openTag.length + placeholder.length);
    } else {
      editor.setSelectionRange(newCursorPos, newCursorPos);
    }

    updateEditorStats();
    triggerAutoSave();
  }

  function insertAtCursor(text) {
    editor.focus();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const originalText = editor.value;

    if (originalText.length - (end - start) + text.length > MAX_STEAM_CHARS) {
      showToast('Inserção ultrapassaria o limite de 8.000 caracteres.', 'warning');
      return;
    }

    editor.value = originalText.substring(0, start) + text + originalText.substring(end);
    editor.setSelectionRange(start + text.length, start + text.length);
    updateEditorStats();
    triggerAutoSave();
  }

  // ==========================================
  // Toolbar Buttons
  // ==========================================
  const formatActions = {
    bold: () => wrapSelection('[b]', '[/b]', 'texto em negrito'),
    italic: () => wrapSelection('[i]', '[/i]', 'texto em itálico'),
    underline: () => wrapSelection('[u]', '[/u]', 'texto sublinhado'),
    strike: () => wrapSelection('[s]', '[/s]', 'texto tachado'),
    h1: () => wrapSelection('[h1]', '[/h1]', 'Título Principal'),
    h2: () => wrapSelection('[h2]', '[/h2]', 'Subtítulo'),
    h3: () => wrapSelection('[h3]', '[/h3]', 'Seção'),
    quote: () => wrapSelection('[quote]', '[/quote]', 'Citação ou trecho'),
    spoiler: () => wrapSelection('[spoiler]', '[/spoiler]', 'spoiler do jogo aqui'),
    code: () => wrapSelection('[code]', '[/code]', 'código ou log'),
    hr: () => insertAtCursor('\n[hr]\n'),
    list: () => wrapSelection('[list]\n[*] ', '\n[*] Outro item\n[/list]', 'Primeiro item'),
    olist: () => wrapSelection('[olist]\n[*] ', '\n[*] Passo 2\n[/olist]', 'Passo 1')
  };

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (formatActions[action]) {
        formatActions[action]();
      }
    });
  });

  // ==========================================
  // Link Modal
  // ==========================================
  const btnOpenLinkModal = document.getElementById('btnOpenLinkModal');
  if (btnOpenLinkModal) {
    btnOpenLinkModal.addEventListener('click', () => {
      const selText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
      linkTextInput.value = selText || '';
      linkUrlInput.value = '';
      openModal(linkModal);
      setTimeout(() => {
        if (selText) {
          linkUrlInput.focus();
        } else {
          linkTextInput.focus();
        }
      }, 100);
    });
  }

  btnApplyLink.addEventListener('click', () => {
    const url = linkUrlInput.value.trim();
    const text = linkTextInput.value.trim() || url || 'link';

    if (!url) {
      showToast('Por favor, informe uma URL válida.', 'warning');
      linkUrlInput.focus();
      return;
    }

    const formattedUrl = (url.startsWith('http://') || url.startsWith('https://')) ? url : `https://${url}`;
    const bbcodeLink = `[url=${formattedUrl}]${text}[/url]`;
    insertAtCursor(bbcodeLink);
    closeModal(linkModal);
    showToast('Link inserido com sucesso!');
  });

  // ==========================================
  // Color Modal
  // ==========================================
  const btnOpenColorModal = document.getElementById('btnOpenColorModal');
  if (btnOpenColorModal) {
    btnOpenColorModal.addEventListener('click', () => {
      openModal(colorModal);
    });
  }

  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
      customColorInput.value = selectedColor;
      colorHexDisplay.textContent = selectedColor;
    });
  });

  customColorInput.addEventListener('input', (e) => {
    selectedColor = e.target.value;
    colorHexDisplay.textContent = selectedColor;
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === selectedColor.toLowerCase());
    });
  });

  btnApplyColor.addEventListener('click', () => {
    wrapSelection(`[color=${selectedColor}]`, '[/color]', 'texto colorido');
    closeModal(colorModal);
  });

  // ==========================================
  // Star Rating Builder & Modal
  // ==========================================
  const btnOpenRatingModal = document.getElementById('btnOpenRatingModal');
  
  function updateRatingModalUI() {
    ratingBuilder.renderInteractiveStars(starsContainer, (builder) => {
      ratingPreviewBadge.textContent = builder.generateBBCode();
    });
    ratingPreviewBadge.textContent = ratingBuilder.generateBBCode();
  }

  if (btnOpenRatingModal) {
    btnOpenRatingModal.addEventListener('click', () => {
      updateRatingModalUI();
      openModal(ratingModal);
    });
  }

  scale5Btn.addEventListener('click', () => {
    scale5Btn.classList.add('active');
    scale10Btn.classList.remove('active');
    ratingBuilder.setScale(5);
    updateRatingModalUI();
  });

  scale10Btn.addEventListener('click', () => {
    scale10Btn.classList.add('active');
    scale5Btn.classList.remove('active');
    ratingBuilder.setScale(10);
    updateRatingModalUI();
  });

  ratingCriterionInput.addEventListener('input', (e) => {
    ratingBuilder.setCriterion(e.target.value);
    ratingPreviewBadge.textContent = ratingBuilder.generateBBCode();
  });

  formatStyleSelect.addEventListener('change', (e) => {
    ratingBuilder.setFormatStyle(e.target.value);
    ratingPreviewBadge.textContent = ratingBuilder.generateBBCode();
  });

  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.preset;
      ratingCriterionInput.value = val;
      ratingBuilder.setCriterion(val);
      ratingPreviewBadge.textContent = ratingBuilder.generateBBCode();
    });
  });

  btnInsertRating.addEventListener('click', () => {
    const bbcode = ratingBuilder.generateBBCode();
    insertAtCursor(bbcode + '\n');
    closeModal(ratingModal);
    showToast('Avaliação inserida!');
  });

  // ==========================================
  // Templates Management
  // ==========================================
  function populateTemplateSelect() {
    const allTemplates = TemplateManager.getAllTemplates();
    templateSelect.innerHTML = '<option value="" disabled selected>Aplicar um molde...</option>';

    const builtinGroup = document.createElement('optgroup');
    builtinGroup.label = 'Moldes Padrão';

    const customGroup = document.createElement('optgroup');
    customGroup.label = 'Meus Moldes Personalizados';

    allTemplates.forEach(tpl => {
      const option = document.createElement('option');
      option.value = tpl.id;
      option.textContent = `${tpl.name} [${tpl.badge}]`;

      if (tpl.id.startsWith('builtin-')) {
        builtinGroup.appendChild(option);
      } else {
        customGroup.appendChild(option);
      }
    });

    templateSelect.appendChild(builtinGroup);
    if (customGroup.children.length > 0) {
      templateSelect.appendChild(customGroup);
    }
  }

  templateSelect.addEventListener('change', () => {
    const selectedId = templateSelect.value;
    if (!selectedId) return;

    const tpl = TemplateManager.getTemplateById(selectedId);
    if (!tpl) return;

    if (editor.value.trim().length > 0) {
      const confirmReplace = confirm('Deseja substituir o conteúdo atual da análise pelo molde selecionado?');
      if (!confirmReplace) {
        templateSelect.value = '';
        return;
      }
    }

    editor.value = tpl.content;
    updateEditorStats();
    triggerAutoSave();
    showToast(`Molde "${tpl.name}" carregado!`);
    templateSelect.value = '';
  });

  // Save Custom Template
  btnSaveTemplate.addEventListener('click', () => {
    if (!editor.value.trim()) {
      showToast('O editor está vazio. Escreva algo para salvar como molde.', 'warning');
      return;
    }
    templateNameInput.value = '';
    openModal(saveTemplateModal);
    setTimeout(() => templateNameInput.focus(), 100);
  });

  btnConfirmSaveTemplate.addEventListener('click', () => {
    const name = templateNameInput.value.trim();
    if (!name) {
      showToast('Digite um nome para o molde.', 'warning');
      templateNameInput.focus();
      return;
    }

    try {
      TemplateManager.saveCustomTemplate(name, editor.value);
      populateTemplateSelect();
      closeModal(saveTemplateModal);
      showToast(`Molde "${name}" salvo com sucesso!`);
    } catch (e) {
      showToast(e.message, 'danger');
    }
  });

  // Manage Custom Templates
  btnManageTemplates.addEventListener('click', () => {
    renderCustomTemplatesList();
    openModal(manageTemplatesModal);
  });

  function renderCustomTemplatesList() {
    const custom = TemplateManager.getCustomTemplates();
    customTemplatesList.innerHTML = '';

    if (custom.length === 0) {
      customTemplatesList.innerHTML = '<p style="color: #626c75; font-size: 0.85rem; font-style: italic;">Nenhum molde personalizado salvo ainda.</p>';
      return;
    }

    custom.forEach(tpl => {
      const item = document.createElement('div');
      item.className = 'template-item';
      item.innerHTML = `
        <div class="template-item-info">
          <strong style="color: #fff; font-size: 0.9rem;">${tpl.name}</strong>
          <span class="template-badge badge-custom">Personalizado</span>
        </div>
        <button class="btn btn-danger btn-sm" data-delete-id="${tpl.id}" title="Excluir molde">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Excluir
        </button>
      `;

      item.querySelector('[data-delete-id]').addEventListener('click', () => {
        if (confirm(`Excluir o molde "${tpl.name}"?`)) {
          TemplateManager.deleteCustomTemplate(tpl.id);
          renderCustomTemplatesList();
          populateTemplateSelect();
          showToast(`Molde "${tpl.name}" excluído.`);
        }
      });

      customTemplatesList.appendChild(item);
    });
  }

  // Export / Import Templates
  btnExportTemplates.addEventListener('click', () => {
    const jsonStr = TemplateManager.exportTemplatesAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steam_review_moldes_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Moldes exportados para arquivo JSON!');
  });

  btnImportTemplates.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const count = TemplateManager.importTemplatesFromJSON(event.target.result);
        populateTemplateSelect();
        renderCustomTemplatesList();
        showToast(`${count} molde(s) importado(s) com sucesso!`);
      } catch (err) {
        showToast(err.message, 'danger');
      }
      importFileInput.value = '';
    };
    reader.readAsText(file);
  });

  // ==========================================
  // Primary Export Actions
  // ==========================================
  btnCopyFormatted.addEventListener('click', () => {
    const textToCopy = editor.value;

    if (!textToCopy.trim()) {
      showToast('O editor está vazio. Digite sua análise antes de copiar.', 'warning');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Texto copiado com sucesso! Pronto para colar na Steam.');
      }).catch(() => {
        fallbackCopyText(textToCopy);
      });
    } else {
      fallbackCopyText(textToCopy);
    }
  });

  function fallbackCopyText(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-999999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();

    try {
      document.execCommand('copy');
      showToast('Texto copiado com sucesso! Pronto para colar na Steam.');
    } catch (err) {
      showToast('Não foi possível copiar automaticamente. Por favor, use Ctrl+C.', 'danger');
    }
    document.body.removeChild(tempTextArea);
  }

  btnDownloadTxt.addEventListener('click', () => {
    const content = editor.value;
    if (!content.trim()) {
      showToast('O editor está vazio para download.', 'warning');
      return;
    }

    const safeTitle = (currentActiveReview ? currentActiveReview.title : 'steam_review')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download do arquivo .txt iniciado!');
  });

  btnClearEditor.addEventListener('click', () => {
    if (!editor.value.trim()) return;
    if (confirm('Tem certeza que deseja limpar todo o texto da análise?')) {
      editor.value = '';
      updateEditorStats();
      triggerAutoSave();
      showToast('Editor limpo.');
    }
  });

  // ==========================================
  // Global Keyboard Shortcuts
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        formatActions.bold();
      } else if (key === 'i') {
        e.preventDefault();
        formatActions.italic();
      } else if (key === 'u') {
        e.preventDefault();
        formatActions.underline();
      } else if (key === 's' && e.shiftKey) {
        e.preventDefault();
        formatActions.spoiler();
      } else if (key === 'k') {
        e.preventDefault();
        if (btnOpenLinkModal) btnOpenLinkModal.click();
      }
    }
  });

  // ==========================================
  // Initialization
  // ==========================================
  const savedLayout = localStorage.getItem('steam_editor_layout_preference') || 'side-by-side';
  setLayout(savedLayout, false);

  const savedTheme = localStorage.getItem('steamer_theme_preference') || 'theme-default';
  setTheme(savedTheme, false);
  populateTemplateSelect();

  // Load default template content if completely brand new
  const defaultTpl = TemplateManager.getTemplateById('builtin-prompt-standard');
  const initialContent = defaultTpl ? defaultTpl.content : '';

  // Get active review or create initial one
  const activeReview = ReviewManager.getOrCreateActive(initialContent);
  loadReviewIntoUI(activeReview);
  updateNavBadge();
  switchMainView('home');
});
