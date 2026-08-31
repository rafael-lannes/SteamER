/**
 * Steam Star Rating System & Generator
 * Generates beautifully formatted Steam BBCode rating scores with stars, score bars, and customizable criteria.
 */

class StarRatingBuilder {
  constructor(options = {}) {
    this.maxScale = options.maxScale || 5; // 5 or 10
    this.currentScore = options.currentScore || 5;
    this.criterion = options.criterion || 'Nota Final';
    this.formatStyle = options.formatStyle || 'stars-score'; // 'stars-score', 'stars-only', 'bar', 'simple'
  }

  setScale(scale) {
    this.maxScale = parseInt(scale, 10);
    if (this.currentScore > this.maxScale) {
      this.currentScore = this.maxScale;
    }
  }

  setScore(score) {
    const val = parseInt(score, 10);
    this.currentScore = Math.max(1, Math.min(this.maxScale, val));
  }

  setCriterion(name) {
    this.criterion = name ? name.trim() : 'Nota';
  }

  setFormatStyle(style) {
    this.formatStyle = style;
  }

  /**
   * Generates star characters (★ and ☆)
   */
  getStarString(score = this.currentScore, max = this.maxScale) {
    const filled = '★'.repeat(score);
    const empty = '☆'.repeat(max - score);
    return filled + empty;
  }

  /**
   * Generates a block progress bar: [████████░░]
   */
  getProgressBarString(score = this.currentScore, max = this.maxScale) {
    const filled = '█'.repeat(score);
    const empty = '░'.repeat(max - score);
    return `[${filled}${empty}]`;
  }

  /**
   * Generates the BBCode output to be inserted into the Steam review
   */
  generateBBCode() {
    const starStr = this.getStarString();
    const criterionPrefix = this.criterion ? `[b]${this.criterion}:[/b] ` : '';

    switch (this.formatStyle) {
      case 'stars-only':
        return `${criterionPrefix}${starStr}`;
      case 'bar':
        return `${criterionPrefix}${this.getProgressBarString()} (${this.currentScore}/${this.maxScale})`;
      case 'simple':
        return `${criterionPrefix}${this.currentScore}/${this.maxScale}`;
      case 'stars-score':
      default:
        return `${criterionPrefix}${starStr} (${this.currentScore}/${this.maxScale})`;
    }
  }

  /**
   * Render interactive star elements in container
   */
  renderInteractiveStars(containerElement, onSelectCallback) {
    if (!containerElement) return;
    containerElement.innerHTML = '';

    for (let i = 1; i <= this.maxScale; i++) {
      const star = document.createElement('span');
      star.className = `star-icon ${i <= this.currentScore ? 'filled' : ''}`;
      star.textContent = '★';
      star.dataset.value = i;
      star.title = `${i} de ${this.maxScale}`;

      // Hover preview
      star.addEventListener('mouseenter', () => {
        const stars = containerElement.querySelectorAll('.star-icon');
        stars.forEach((s, idx) => {
          if (idx + 1 <= i) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
      });

      // Mouse leave restore current score
      containerElement.addEventListener('mouseleave', () => {
        const stars = containerElement.querySelectorAll('.star-icon');
        stars.forEach((s, idx) => {
          if (idx + 1 <= this.currentScore) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
      });

      // Click to select
      star.addEventListener('click', () => {
        this.setScore(i);
        const stars = containerElement.querySelectorAll('.star-icon');
        stars.forEach((s, idx) => {
          if (idx + 1 <= this.currentScore) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });
        if (typeof onSelectCallback === 'function') {
          onSelectCallback(this);
        }
      });

      containerElement.appendChild(star);
    }
  }
}

// Export for browser
window.StarRatingBuilder = StarRatingBuilder;
