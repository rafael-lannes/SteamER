/**
 * Steam Review Project & History Manager
 * Manages multiple reviews, per-game persistent scratchpad notes,
 * recommendation status (👍 / 👎), multi-criteria sorting,
 * and complete application JSON backup export & validated import.
 */

class ReviewManager {
  static STORAGE_KEY = 'steam_reviews_history';
  static ACTIVE_REVIEW_KEY = 'steam_active_review_id';
  static APP_NAME = 'SteamER';
  static BACKUP_VERSION = '2.0';

  /**
   * Get all reviews sorted by updatedAt descending (most recent first)
   * Ensures backward compatibility by defaulting missing fields.
   */
  static getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const reviews = JSON.parse(data);
      if (!Array.isArray(reviews)) return [];
      
      // Normalize and sort: Most recently edited first
      return reviews.map(r => ({
        ...r,
        recommended: typeof r.recommended === 'boolean' ? r.recommended : true,
        notes: r.notes || '',
        content: r.content || '',
        title: r.title || 'Análise Sem Título'
      })).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    } catch (e) {
      console.error('Error reading reviews from localStorage:', e);
      return [];
    }
  }

  /**
   * Save all reviews array to localStorage
   */
  static saveAll(reviews) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));
  }

  /**
   * Get review by ID
   */
  static getById(id) {
    const reviews = this.getAll();
    return reviews.find(r => r.id === id) || null;
  }

  /**
   * Create a new review for a game
   */
  static create(gameTitle, initialContent = '', initialNotes = '', recommended = true) {
    const title = (gameTitle || 'Análise Sem Título').trim();
    const now = Date.now();
    const newReview = {
      id: 'rev-' + now + '-' + Math.random().toString(36).substr(2, 4),
      title: title,
      content: initialContent,
      notes: initialNotes,
      recommended: Boolean(recommended),
      createdAt: now,
      updatedAt: now
    };

    const reviews = this.getAll();
    reviews.unshift(newReview); // add to beginning
    this.saveAll(reviews);
    this.setActiveId(newReview.id);
    return newReview;
  }

  /**
   * Update active or specific review content, notes, title, or recommendation
   */
  static update(id, updates = {}) {
    const reviews = this.getAll();
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return null;

    reviews[index] = {
      ...reviews[index],
      ...updates,
      updatedAt: Date.now() // Always refresh updatedAt on modification
    };

    this.saveAll(reviews);
    return reviews[index];
  }

  /**
   * Duplicate an existing review
   */
  static duplicate(id) {
    const source = this.getById(id);
    if (!source) throw new Error('Review de origem não encontrada.');

    const now = Date.now();
    const cloned = {
      id: 'rev-' + now + '-' + Math.random().toString(36).substr(2, 4),
      title: `${source.title} (Cópia)`,
      content: source.content || '',
      notes: source.notes || '',
      recommended: typeof source.recommended === 'boolean' ? source.recommended : true,
      createdAt: now,
      updatedAt: now
    };

    const reviews = this.getAll();
    reviews.unshift(cloned);
    this.saveAll(reviews);
    return cloned;
  }

  /**
   * Delete a review by ID
   */
  static delete(id) {
    let reviews = this.getAll();
    reviews = reviews.filter(r => r.id !== id);
    this.saveAll(reviews);

    // If active review was deleted, activate the first available or null
    if (this.getActiveId() === id) {
      if (reviews.length > 0) {
        this.setActiveId(reviews[0].id);
      } else {
        localStorage.removeItem(this.ACTIVE_REVIEW_KEY);
      }
    }
    return true;
  }

  /**
   * Rename a review's game title
   */
  static rename(id, newTitle) {
    if (!newTitle || !newTitle.trim()) {
      throw new Error('O nome do jogo não pode ser vazio.');
    }
    return this.update(id, { title: newTitle.trim() });
  }

  /**
   * Toggle or set recommendation
   */
  static setRecommended(id, isRecommended) {
    return this.update(id, { recommended: Boolean(isRecommended) });
  }

  /**
   * Get currently active review ID
   */
  static getActiveId() {
    return localStorage.getItem(this.ACTIVE_REVIEW_KEY);
  }

  /**
   * Set currently active review ID
   */
  static setActiveId(id) {
    localStorage.setItem(this.ACTIVE_REVIEW_KEY, id);
  }

  /**
   * Get active review object, or create default if none exists
   */
  static getOrCreateActive(defaultInitialContent = '') {
    const activeId = this.getActiveId();
    let activeReview = activeId ? this.getById(activeId) : null;

    if (!activeReview) {
      const all = this.getAll();
      if (all.length > 0) {
        activeReview = all[0];
        this.setActiveId(activeReview.id);
      } else {
        // Create initial default review
        activeReview = this.create('Minha Primeira Análise', defaultInitialContent, '', true);
      }
    }
    return activeReview;
  }

  /**
   * Export all application data (reviews, notes, custom templates) as formatted JSON
   */
  static exportFullBackupJSON() {
    const allReviews = this.getAll();
    let customTemplates = [];
    try {
      if (window.TemplateManager && typeof TemplateManager.getCustomTemplates === 'function') {
        customTemplates = TemplateManager.getCustomTemplates();
      }
    } catch (e) {
      console.warn('Could not read custom templates for backup:', e);
    }

    const backupData = {
      app: this.APP_NAME,
      version: this.BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      activeReviewId: this.getActiveId(),
      reviewsCount: allReviews.length,
      customTemplatesCount: customTemplates.length,
      reviews: allReviews,
      customTemplates: customTemplates
    };

    return JSON.stringify(backupData, null, 2);
  }

  /**
   * Validate a parsed JSON backup object
   * Returns { valid: boolean, error?: string, reviewCount: number, templateCount: number, sanitizedData?: object }
   */
  static validateBackupData(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'O arquivo JSON não contém um objeto válido.' };
    }

    // Support both full wrapper format and direct array format
    let reviewsRaw = null;
    let templatesRaw = [];

    if (Array.isArray(data)) {
      reviewsRaw = data;
    } else if (Array.isArray(data.reviews)) {
      reviewsRaw = data.reviews;
      if (Array.isArray(data.customTemplates)) {
        templatesRaw = data.customTemplates;
      }
    } else {
      return { valid: false, error: 'Estrutura inválida: nenhuma lista de reviews encontrada no arquivo.' };
    }

    // Validate review items
    const sanitizedReviews = [];
    for (let i = 0; i < reviewsRaw.length; i++) {
      const item = reviewsRaw[i];
      if (!item || typeof item !== 'object') continue;

      sanitizedReviews.push({
        id: typeof item.id === 'string' && item.id.trim() ? item.id : 'rev-' + (Date.now() + i),
        title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : 'Análise Sem Título',
        content: typeof item.content === 'string' ? item.content : '',
        notes: typeof item.notes === 'string' ? item.notes : '',
        recommended: typeof item.recommended === 'boolean' ? item.recommended : true,
        createdAt: Number(item.createdAt) || Date.now(),
        updatedAt: Number(item.updatedAt) || Date.now()
      });
    }

    const sanitizedTemplates = [];
    for (const tpl of templatesRaw) {
      if (tpl && typeof tpl === 'object' && tpl.name && tpl.content) {
        sanitizedTemplates.push({
          id: typeof tpl.id === 'string' ? tpl.id : 'custom-' + Date.now(),
          name: String(tpl.name).trim(),
          badge: 'Personalizado',
          content: String(tpl.content),
          createdAt: tpl.createdAt || new Date().toISOString()
        });
      }
    }

    return {
      valid: true,
      reviewCount: sanitizedReviews.length,
      templateCount: sanitizedTemplates.length,
      sanitizedData: {
        reviews: sanitizedReviews,
        customTemplates: sanitizedTemplates,
        activeReviewId: data.activeReviewId || (sanitizedReviews[0] ? sanitizedReviews[0].id : null)
      }
    };
  }

  /**
   * Import backup JSON string with 'replace' (overwrite all) or 'merge' mode
   */
  static importBackupJSON(jsonStr, mode = 'replace') {
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      throw new Error('Arquivo JSON corrompido ou formato inválido: ' + e.message);
    }

    const validation = this.validateBackupData(parsed);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { reviews: incomingReviews, customTemplates: incomingTemplates, activeReviewId } = validation.sanitizedData;

    if (mode === 'replace') {
      // Complete overwrite
      this.saveAll(incomingReviews);
      if (incomingTemplates.length > 0 && window.TemplateManager) {
        localStorage.setItem(TemplateManager.STORAGE_KEY, JSON.stringify(incomingTemplates));
      }
      if (activeReviewId) {
        this.setActiveId(activeReviewId);
      } else if (incomingReviews.length > 0) {
        this.setActiveId(incomingReviews[0].id);
      }
      return { mode: 'replace', reviewsCount: incomingReviews.length, templatesCount: incomingTemplates.length };
    } else {
      // Merge mode: retain existing and append/update non-duplicate reviews
      const existingReviews = this.getAll();
      const existingIds = new Set(existingReviews.map(r => r.id));
      let mergedCount = 0;

      for (const rev of incomingReviews) {
        if (existingIds.has(rev.id)) {
          // Re-generate ID to avoid colliding and add as new
          rev.id = 'rev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        }
        existingReviews.push(rev);
        mergedCount++;
      }

      this.saveAll(existingReviews);

      // Merge templates
      let mergedTemplatesCount = 0;
      if (incomingTemplates.length > 0 && window.TemplateManager) {
        const existingTpls = TemplateManager.getCustomTemplates();
        const existingNames = new Set(existingTpls.map(t => t.name.toLowerCase()));
        for (const tpl of incomingTemplates) {
          if (!existingNames.has(tpl.name.toLowerCase())) {
            existingTpls.push(tpl);
            mergedTemplatesCount++;
          }
        }
        localStorage.setItem(TemplateManager.STORAGE_KEY, JSON.stringify(existingTpls));
      }

      return { mode: 'merge', reviewsCount: mergedCount, templatesCount: mergedTemplatesCount };
    }
  }

  /**
   * Reset and wipe all application data from LocalStorage
   * Clears all reviews, active review pointer, custom templates, and preferences.
   */
  static resetAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.ACTIVE_REVIEW_KEY);
      if (window.TemplateManager && TemplateManager.STORAGE_KEY) {
        localStorage.removeItem(TemplateManager.STORAGE_KEY);
      } else {
        localStorage.removeItem('steam_custom_templates');
      }
      localStorage.removeItem('steam_editor_layout_preference');
      return true;
    } catch (e) {
      console.error('Error resetting application data:', e);
      return false;
    }
  }

  /**
   * Format timestamp into friendly Brazilian Portuguese date string
   */
  static formatDate(timestamp) {
    if (!timestamp) return 'Data desconhecida';
    const date = new Date(timestamp);
    const now = new Date();
    
    // Check if same day
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (isToday) {
      return `Hoje às ${timeStr}`;
    } else if (isYesterday) {
      return `Ontem às ${timeStr}`;
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year} às ${timeStr}`;
    }
  }
}

// Export for browser
window.ReviewManager = ReviewManager;
