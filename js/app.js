/**
 * Steam Review Generator & Editor - Main Application Controller
 * Features:
 * - Dynamic Responsive Side-by-Side / Stacked Layout
 * - Relocated Scratchpad / Notepad in Right Panel Tabs
 * - Detachable Popout Window for Notes with Real-time 2-Way Sync
 * - Multi-Review Projects with LocalStorage Persistence & History
 * - Steam BBCode Formatting & Real-time Live Preview
 * - Character Counter (8,000 max limit) & One-click Clipboard Export
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Editor & Stats
  const appContainer = document.querySelector('.app-container');
  const editor = document.getElementById('reviewEditor');
  const previewContent = document.getElementById('previewContent');
  const rawCodeOutput = document.getElementById('rawCodeOutput');
  const charCounter = document.getElementById('charCounter');
  const progressBar = document.getElementById('progressBar');
  const wordCounter = document.getElementById('wordCounter');
  const lineCounter = document.getElementById('lineCounter');
  const charWarningBanner = document.getElementById('charWarningBanner');
  const templateSelect = document.getElementById('templateSelect');

  // DOM Elements - Active Project & Header
  const btnToggleLayout = document.getElementById('btnToggleLayout');
  const layoutToggleText = document.getElementById('layoutToggleText');
  const activeGameTitleText = document.getElementById('activeGameTitleText');
  const btnRenameActiveGame = document.getElementById('btnRenameActiveGame');
  const saveStatusIndicator = document.getElementById('saveStatusIndicator');
  const saveStatusText = document.getElementById('saveStatusText');
  const historyCountBadge = document.getElementById('historyCountBadge');

  // DOM Elements - Right Panel Tabs & Views
  const tabPreview = document.getElementById('tabPreview');
  const tabNotes = document.getElementById('tabNotes');
  const tabRaw = document.getElementById('tabRaw');
  const viewPreview = document.getElementById('viewPreview');
  const viewNotes = document.getElementById('viewNotes');
  const viewRaw = document.getElementById('viewRaw');

  // DOM Elements - Scratchpad / Notepad
  const gameNotesArea = document.getElementById('gameNotesArea');
  const notesCharCounter = document.getElementById('notesCharCounter');
  const notesMainControls = document.getElementById('notesMainControls');
  const notesDetachedNotice = document.getElementById('notesDetachedNotice');
  const btnPopoutNotes = document.getElementById('btnPopoutNotes');
  const btnReattachNotes = document.getElementById('btnReattachNotes');
  const btnInsertNoteToReview = document.getElementById('btnInsertNoteToReview');
  const btnCopyNotes = document.getElementById('btnCopyNotes');
  const btnClearNotes = document.getElementById('btnClearNotes');

  // DOM Elements - Modals
  const btnOpenNewReviewModal = document.getElementById('btnOpenNewReviewModal');
  const newReviewModal = document.getElementById('newReviewModal');
  const newGameTitleInput = document.getElementById('newGameTitleInput');
  const newReviewTemplateSelect = document.getElementById('newReviewTemplateSelect');
  const btnConfirmCreateReview = document.getElementById('btnConfirmCreateReview');

  const btnOpenHistoryModal = document.getElementById('btnOpenHistoryModal');
  const historyModal = document.getElementById('historyModal');
  const historySearchInput = document.getElementById('historySearchInput');
  const historyReviewsList = document.getElementById('historyReviewsList');
  const btnHistoryNewReview = document.getElementById('btnHistoryNewReview');

  const renameReviewModal = document.getElementById('renameReviewModal');
  const renameGameTitleInput = document.getElementById('renameGameTitleInput');
  const btnConfirmRenameGame = document.getElementById('btnConfirmRenameGame');
  let pendingRenameId = null;

  // Formatting Modals
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
  const btnManageTemplates = document.getElementById('btnManageTemplates');
  const toastContainer = document.getElementById('toastContainer');

  // Application State
  let currentActiveReview = null;
  let autoSaveTimeout = null;
  let popoutNotesWindow = null;

  const ratingBuilder = new StarRatingBuilder({
    maxScale: 5,
    currentScore: 5,
    criterion: 'Nota Final',
    formatStyle: 'stars-score'
  });

  const MAX_STEAM_CHARS = 8000;
  const WARN_STEAM_CHARS = 7500;

  // ==========================================
  // Toast Notifications
  // ==========================================
  function showToast(message, type = 'success', duration = 3200) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#a4d007" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
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
  // Layout Preference & Toggle
  // ==========================================
  function initLayout() {
    const savedLayout = localStorage.getItem('steam_editor_layout_preference') || 'side-by-side';
    if (savedLayout === 'stacked') {
      appContainer.classList.add('layout-stacked');
      if (layoutToggleText) layoutToggleText.textContent = 'Empilhado';
    } else {
      appContainer.classList.remove('layout-stacked');
      if (layoutToggleText) layoutToggleText.textContent = 'Lado a Lado';
    }
  }

  if (btnToggleLayout) {
    btnToggleLayout.addEventListener('click', () => {
      const isStacked = appContainer.classList.toggle('layout-stacked');
      const mode = isStacked ? 'stacked' : 'side-by-side';
      localStorage.setItem('steam_editor_layout_preference', mode);
      if (layoutToggleText) layoutToggleText.textContent = isStacked ? 'Empilhado' : 'Lado a Lado';
      showToast(`Layout alterado para: ${isStacked ? 'Empilhado (1 Coluna)' : 'Lado a Lado (2 Colunas)'}`);
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
        notes: gameNotesArea.value
      });

      if (dot) dot.classList.remove('saving');
      if (saveStatusText) saveStatusText.textContent = 'Salvo automaticamente';
      updateHistoryBadge();
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
    updateHistoryBadge();
  }

  function updateHistoryBadge() {
    const total = ReviewManager.getAll().length;
    if (historyCountBadge) {
      historyCountBadge.textContent = total;
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
      if (charWarningBanner) charWarningBanner.style.display = 'block';
    } else if (currentLen >= WARN_STEAM_CHARS) {
      charCounter.className = 'counter-text warning';
      progressBar.className = 'progress-bar-fill warning';
      if (charWarningBanner) charWarningBanner.style.display = 'none';
    } else {
      charCounter.className = 'counter-text';
      progressBar.className = 'progress-bar-fill';
      if (charWarningBanner) charWarningBanner.style.display = 'none';
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

    if (rawCodeOutput) {
      rawCodeOutput.textContent = raw || '(Vazio)';
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
  // Right Panel Tabs (Live Preview, Notes, Raw BBCode)
  // ==========================================
  function switchRightPanelTab(tabName) {
    tabPreview.classList.toggle('active', tabName === 'preview');
    tabNotes.classList.toggle('active', tabName === 'notes');
    tabRaw.classList.toggle('active', tabName === 'raw');

    viewPreview.style.display = (tabName === 'preview') ? 'block' : 'none';
    viewNotes.classList.toggle('active', tabName === 'notes');
    viewRaw.classList.toggle('active', tabName === 'raw');

    if (tabName === 'notes' && (!popoutNotesWindow || popoutNotesWindow.closed)) {
      gameNotesArea.focus();
    }
  }

  tabPreview.addEventListener('click', () => switchRightPanelTab('preview'));
  tabNotes.addEventListener('click', () => switchRightPanelTab('notes'));
  tabRaw.addEventListener('click', () => switchRightPanelTab('raw'));

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
      <span>📝</span>
      <span id="popoutGameTitle">${SteamBBCode.escapeHtml(title)}</span>
    </div>
    <span class="popout-sync-badge">● Sincronizado</span>
  </div>
  <div class="popout-toolbar">
    <div style="display: flex; gap: 6px;">
      <button id="btnPopoutInsertToReview" class="btn btn-primary" title="Enviar texto selecionado para a análise na janela principal">
        ⬅️ Inserir na Review
      </button>
      <button id="btnPopoutCopy" class="btn" title="Copiar anotações">
        📋 Copiar
      </button>
    </div>
    <div>
      <button id="btnPopoutClear" class="btn" title="Limpar anotações">
        🗑️ Limpar
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
        popoutNotesWindow.document.title = `📝 Bloco de Notas: ${currentActiveReview.title}`;
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
  // Create New Review Flow
  // ==========================================
  function openNewReviewPrompt() {
    newGameTitleInput.value = '';
    newReviewTemplateSelect.value = 'builtin-prompt-standard';
    openModal(newReviewModal);
    setTimeout(() => newGameTitleInput.focus(), 100);
  }

  btnOpenNewReviewModal.addEventListener('click', openNewReviewPrompt);
  if (btnHistoryNewReview) {
    btnHistoryNewReview.addEventListener('click', () => {
      closeModal(historyModal);
      openNewReviewPrompt();
    });
  }

  btnConfirmCreateReview.addEventListener('click', () => {
    const title = newGameTitleInput.value.trim() || 'Nova Análise de Jogo';
    const templateChoice = newReviewTemplateSelect.value;
    let initialContent = '';

    if (templateChoice !== 'blank') {
      const tpl = TemplateManager.getTemplateById(templateChoice);
      if (tpl) initialContent = tpl.content;
    }

    const created = ReviewManager.create(title, initialContent, '');
    loadReviewIntoUI(created);
    closeModal(newReviewModal);
    showToast(`Review para "${title}" criada com sucesso!`);
  });

  // ==========================================
  // Review History Modal & Management
  // ==========================================
  btnOpenHistoryModal.addEventListener('click', () => {
    historySearchInput.value = '';
    renderHistoryList();
    openModal(historyModal);
    setTimeout(() => historySearchInput.focus(), 100);
  });

  historySearchInput.addEventListener('input', () => {
    renderHistoryList(historySearchInput.value.trim().toLowerCase());
  });

  function renderHistoryList(filterQuery = '') {
    const allReviews = ReviewManager.getAll();
    historyReviewsList.innerHTML = '';

    const filtered = filterQuery
      ? allReviews.filter(r => (r.title || '').toLowerCase().includes(filterQuery) || (r.content || '').toLowerCase().includes(filterQuery))
      : allReviews;

    if (filtered.length === 0) {
      historyReviewsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <p style="font-size: 0.9rem;">${filterQuery ? 'Nenhuma review encontrada para esta busca.' : 'Nenhuma review salva no histórico ainda.'}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(rev => {
      const isActive = currentActiveReview && currentActiveReview.id === rev.id;
      const card = document.createElement('div');
      card.className = `history-card ${isActive ? 'active' : ''}`;

      const formattedDate = ReviewManager.formatDate(rev.updatedAt || rev.createdAt);
      const charsCount = (rev.content || '').length;
      const hasNotes = (rev.notes || '').trim().length > 0;
      
      const cleanSnippet = (rev.content || 'Sem texto')
        .replace(/\[\/?.*?\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      card.innerHTML = `
        <div class="history-card-header">
          <div class="history-card-title">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;color:${isActive ? 'var(--steam-blue)' : 'var(--text-muted)'};"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
            <span>${rev.title || 'Análise Sem Título'}</span>
          </div>
          ${isActive ? '<span class="history-active-badge">Aberta Agora</span>' : ''}
        </div>
        <div class="history-snippet">${cleanSnippet || '(Análise vazia)'}</div>
        <div class="history-card-footer">
          <div class="history-meta-tags">
            <span class="history-date">🕒 ${formattedDate}</span>
            <span>• ${charsCount.toLocaleString('pt-BR')} chars</span>
            ${hasNotes ? '<span style="color:#fcd34d;">• 📝 Notas</span>' : ''}
          </div>
          <div class="history-actions">
            <button class="btn btn-secondary btn-sm btn-action-rename" title="Renomear título" data-id="${rev.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn btn-danger btn-sm btn-action-delete" title="Excluir do histórico" data-id="${rev.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.history-actions')) return;
        loadReviewIntoUI(rev);
        closeModal(historyModal);
        showToast(`Review "${rev.title}" carregada!`);
      });

      card.querySelector('.btn-action-rename').addEventListener('click', (e) => {
        e.stopPropagation();
        openRenameModal(rev.id, rev.title);
      });

      card.querySelector('.btn-action-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Tem certeza que deseja excluir a análise de "${rev.title}" do histórico?`)) {
          ReviewManager.delete(rev.id);
          showToast(`Análise de "${rev.title}" excluída.`);
          if (currentActiveReview && currentActiveReview.id === rev.id) {
            const nextActive = ReviewManager.getOrCreateActive();
            loadReviewIntoUI(nextActive);
          }
          renderHistoryList(historySearchInput.value.trim().toLowerCase());
          updateHistoryBadge();
        }
      });

      historyReviewsList.appendChild(card);
    });
  }

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
      renderHistoryList(historySearchInput.value.trim().toLowerCase());
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
  initLayout();
  populateTemplateSelect();

  // Load default template content if completely brand new
  const defaultTpl = TemplateManager.getTemplateById('builtin-prompt-standard');
  const initialContent = defaultTpl ? defaultTpl.content : '';

  // Get active review or create initial one
  const activeReview = ReviewManager.getOrCreateActive(initialContent);
  loadReviewIntoUI(activeReview);
});
