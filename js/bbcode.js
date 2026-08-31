/**
 * Steam BBCode Parser & Renderer
 * Faithfully converts Steam's native BBCode dialect into safe HTML for live preview.
 */

class SteamBBCode {
  /**
   * Escape HTML special characters for safety before rendering
   */
  static escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Main render function
   * @param {string} rawText - Raw text containing Steam BBCode
   * @returns {string} - Rendered HTML
   */
  static render(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';

    // First escape HTML entities
    let html = this.escapeHtml(rawText);

    // Temporarily extract [noparse] and [code] blocks to prevent parsing inside them
    const preservedBlocks = [];
    html = html.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, (match, p1) => {
      const id = `___CODE_BLOCK_${preservedBlocks.length}___`;
      preservedBlocks.push(`<pre class="bb-code"><code>${p1}</code></pre>`);
      return id;
    });

    html = html.replace(/\[noparse\]([\s\S]*?)\[\/noparse\]/gi, (match, p1) => {
      const id = `___NOPARSE_BLOCK_${preservedBlocks.length}___`;
      preservedBlocks.push(p1);
      return id;
    });

    // Basic Typography
    html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>');
    html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>');
    html = html.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>');
    html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<s>$1</s>');
    html = html.replace(/\[strike\]([\s\S]*?)\[\/strike\]/gi, '<s>$1</s>');

    // Headers
    html = html.replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, '<h1 class="bb-h1">$1</h1>');
    html = html.replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, '<h2 class="bb-h2">$1</h2>');
    html = html.replace(/\[h3\]([\s\S]*?)\[\/h3\]/gi, '<h3 class="bb-h3">$1</h3>');

    // Horizontal Rule
    html = html.replace(/\[hr\]/gi, '<hr />');

    // Colors: [color=#hex] or [color=red]
    html = html.replace(/\[color=(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1;">$2</span>');

    // Links: [url=http...]text[/url] or [url]http...[/url]
    html = html.replace(/\[url=(https?:\/\/[^\s"'<>]+)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="bb-link">$2</a>');
    html = html.replace(/\[url\](https?:\/\/[^\s"'<>]+)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="bb-link">$1</a>');

    // Spoilers: [spoiler]text[/spoiler]
    html = html.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, '<span class="bb-spoiler" onclick="this.classList.toggle(\'revealed\')">$1</span>');

    // Quotes: [quote=Author]text[/quote] or [quote]text[/quote]
    html = html.replace(/\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/gi, '<blockquote class="bb-quote"><div class="bb-quote-author">Originalmente postado por $1:</div>$2</blockquote>');
    html = html.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote class="bb-quote">$1</blockquote>');

    // Tables: [table][tr][th]...[/th][/tr][tr][td]...[/td][/tr][/table]
    html = html.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, '<table class="bb-table">$1</table>');
    html = html.replace(/\[tr\]([\s\S]*?)\[\/tr\]/gi, '<tr>$1</tr>');
    html = html.replace(/\[th\]([\s\S]*?)\[\/th\]/gi, '<th>$1</th>');
    html = html.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, '<td>$1</td>');

    // Lists: [list][*]...[/list] and [olist][*]...[/olist]
    html = html.replace(/\[olist\]([\s\S]*?)\[\/olist\]/gi, (match, content) => {
      const items = content.split(/\[\*\]/gi).filter(item => item.trim().length > 0);
      const listHtml = items.map(item => `<li>${item.trim()}</li>`).join('');
      return `<ol class="bb-olist">${listHtml}</ol>`;
    });

    html = html.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (match, content) => {
      const items = content.split(/\[\*\]/gi).filter(item => item.trim().length > 0);
      const listHtml = items.map(item => `<li>${item.trim()}</li>`).join('');
      return `<ul class="bb-list">${listHtml}</ul>`;
    });

    // Restore preserved blocks
    preservedBlocks.forEach((block, index) => {
      const codeKey = `___CODE_BLOCK_${index}___`;
      const noparseKey = `___NOPARSE_BLOCK_${index}___`;
      html = html.replace(codeKey, block);
      html = html.replace(noparseKey, block);
    });

    // Convert newlines to <br> outside block elements
    // Split by block tags to only add <br> to inline paragraphs
    html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Simple newline conversion
    html = html.replace(/\n/g, '<br />');

    // Clean up excessive <br> inside list tags or tables
    html = html.replace(/<\/li><br \/>/gi, '</li>');
    html = html.replace(/<\/ul><br \/>/gi, '</ul>');
    html = html.replace(/<\/ol><br \/>/gi, '</ol>');
    html = html.replace(/<\/h1><br \/>/gi, '</h1>');
    html = html.replace(/<\/h2><br \/>/gi, '</h2>');
    html = html.replace(/<\/h3><br \/>/gi, '</h3>');
    html = html.replace(/<\/blockquote><br \/>/gi, '</blockquote>');
    html = html.replace(/<\/pre><br \/>/gi, '</pre>');
    html = html.replace(/<\/table><br \/>/gi, '</table>');
    html = html.replace(/<\/tr><br \/>/gi, '</tr>');

    return html;
  }
}

// Export for browser
window.SteamBBCode = SteamBBCode;
