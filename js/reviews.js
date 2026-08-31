/**
 * Steam Review Project & History Manager
 * Manages multiple reviews, per-game persistent scratchpad notes,
 * and sorts history by most recently edited.
 */

class ReviewManager {
  static STORAGE_KEY = 'steam_reviews_history';
  static ACTIVE_REVIEW_KEY = 'steam_active_review_id';

  /**
   * Get all reviews sorted by updatedAt descending (most recent first)
   */
  static getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const reviews = JSON.parse(data);
      if (!Array.isArray(reviews)) return [];
      
      // Sort: Most recently edited first
      return reviews.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
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
  static create(gameTitle, initialContent = '', initialNotes = '') {
    const title = (gameTitle || 'Análise Sem Título').trim();
    const now = Date.now();
    const newReview = {
      id: 'rev-' + now + '-' + Math.random().toString(36).substr(2, 4),
      title: title,
      content: initialContent,
      notes: initialNotes,
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
   * Update active or specific review content, notes, or title
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
        activeReview = this.create('Minha Primeira Análise', defaultInitialContent, '');
      }
    }
    return activeReview;
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
