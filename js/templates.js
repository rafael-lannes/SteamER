/**
 * Steam Review Templates Manager
 * Built-in template collection and LocalStorage persistence for user custom templates.
 */

const BUILTIN_TEMPLATES = [
  {
    id: 'builtin-prompt-standard',
    name: 'Padrão (Estrutura Completa)',
    badge: 'Padrão',
    content: `[h1]Análise do Jogo[/h1]

[b]--- PREFÁCIO ---[/b]
[b]Introdução:[/b] [escreva aqui a introdução sobre o jogo, desenvolvedora e contexto inicial...]

[b]--- AVALIAÇÃO TÉCNICA E ARTÍSTICA ---[/b]
[b]Gráficos:[/b] ★★★★★ (5/5)
[b]Jogabilidade:[/b] ★★★★★ (5/5)
[b]História & Narrativa:[/b] ★★★★★ (5/5)
[b]Trilha Sonora & Efeitos:[/b] ★★★★★ (5/5)
[b]Otimização / Desempenho:[/b] ★★★★★ (5/5)

[b]--- DESTAQUES ---[/b]
[b]Pontos Positivos:[/b]
[list]
[*] [escreva um ponto forte aqui]
[*] [escreva outro ponto forte aqui]
[/list]

[b]Pontos Negativos:[/b]
[list]
[*] [escreva um ponto fraco ou detalhe a melhorar aqui]
[/list]

[hr]
[b]--- CONCLUSÃO ---[/b]
[b]Conclusão:[/b] [escreva aqui seu veredito final e recomendação...]

[b]Nota Final:[/b] ★★★★★ (5/5)
[b]Recomendado:[/b] Sim!`
  },
  {
    id: 'builtin-checklist',
    name: 'Checklist Gamer Clássico',
    badge: 'Checklist',
    content: `[h1]--- CHECKLIST DE AVALIAÇÃO ---[/h1]

[b]Público-alvo:[/b]
[list]
[*] [ ] Crianças
[*] [ ] Todos os públicos
[*] [x] Gamers Casuais
[*] [x] Gamers Hardcore
[/list]

[b]Gráficos:[/b]
[list]
[*] [ ] Batata frita
[*] [ ] Muito ruins
[*] [ ] Ruins
[*] [ ] Razoáveis
[*] [x] Bons
[*] [ ] Lindos
[*] [ ] Obra de arte visual
[/list]

[b]História & Enredo:[/b]
[list]
[*] [ ] Não possui
[*] [ ] Pior que filme B
[*] [ ] Aceitável
[*] [x] Boa
[*] [ ] Extraordinária
[/list]

[b]Jogabilidade / Mecânicas:[/b]
[list]
[*] [ ] Quebrada / Injogável
[*] [ ] Frustrante
[*] [ ] Simples
[*] [x] Divertida e Fluida
[*] [ ] Perfeita
[/list]

[b]Preço / Custo-Benefício:[/b]
[list]
[*] [ ] De graça ainda sai caro
[*] [ ] Compre apenas com 90% de desconto
[*] [x] Vale a pena na promoção
[*] [ ] Vale cada centavo do preço cheio
[/list]

[b]Dificuldade:[/b]
[list]
[*] [ ] Aperte apenas 'W'
[*] [ ] Fácil
[*] [x] Médio (Fácil de aprender, difícil de dominar)
[*] [ ] Difícil / Soulslike
[*] [ ] Impossível
[/list]

[b]Bugs e Otimização:[/b]
[list]
[*] [ ] Injogável de tantos bugs
[*] [ ] Vários bugs irritantes
[*] [x] Pequenos bugs que não atrapalham
[*] [ ] Liso como manteiga / Zero bugs
[/list]

[hr]
[b]Nota Final:[/b] ★★★★☆ (4/5)`
  },
  {
    id: 'builtin-express',
    name: 'Review Express (Rápida & Direta)',
    badge: 'Rápida',
    content: `[h2]⚡ Resumo em Poucas Palavras[/h2]
[b]Tempo de jogo até agora:[/b] [X] horas
[b]Veredito Curto:[/b] [Uma frase resumindo a experiência com o jogo]

[hr]
[b]👍 Prós:[/b]
[list]
[*] [Ponto positivo principal]
[*] [Outro destaque]
[*] [Boa otimização / trilha sonora]
[/list]

[b]👎 Contras:[/b]
[list]
[*] [Principal ponto fraco]
[*] [Pequeno bug ou preço elevado]
[/list]

[hr]
[b]Nota:[/b] ★★★★☆ (4/5)
[b]Compre se você gosta de:[/b] [Gênero / jogos similares]`
  },
  {
    id: 'builtin-technical',
    name: 'Análise Técnica & Performance',
    badge: 'Hardware',
    content: `[h1]🔬 Relatório Técnico & Análise de Desempenho[/h1]

[b]Configuração de Teste (PC Specs):[/b]
[quote]
CPU: [Modelo da CPU]
GPU: [Modelo da Placa de Vídeo]
RAM: [Quantidade de Memória]
Armazenamento: [SSD NVMe / SATA / HDD]
Resolução testada: [1080p / 1440p / 4K]
[/quote]

[b]Desempenho & Estabilidade:[/b]
[list]
[*] [b]Média de FPS:[/b] [Ex: 60 - 90 FPS]
[*] [b]Frametime / Stuttering:[/b] [Muito estável / Poucos engasgos / Frequentes quedas]
[*] [b]Uso de VRAM / RAM:[/b] [Normal / Alto consumo]
[*] [b]Suporte a Upscalers (DLSS / FSR / XeSS):[/b] [Sim / Não / Bem implementado]
[/list]

[b]Suporte a Controles & Ultrawide:[/b]
[list]
[*] [b]Controles:[/b] Perfeito reconhecimento de DualSense / Xbox Controller
[*] [b]Ultrawide (21:9 / 32:9):[/b] [Suportado nativamente / Com barras pretas]
[/list]

[hr]
[b]Nota Técnica:[/b] ★★★★☆ (4/5)
[b]Recomendação de Hardware:[/b] [Jogo leve / Moderado / Exigente]`
  }
];

class TemplateManager {
  static STORAGE_KEY = 'steam_review_custom_templates';

  /**
   * Get all built-in templates
   */
  static getBuiltinTemplates() {
    return BUILTIN_TEMPLATES;
  }

  /**
   * Get custom templates from LocalStorage
   */
  static getCustomTemplates() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading custom templates from localStorage:', e);
      return [];
    }
  }

  /**
   * Get list of all templates (builtin + custom)
   */
  static getAllTemplates() {
    const custom = this.getCustomTemplates();
    return [...this.getBuiltinTemplates(), ...custom];
  }

  /**
   * Find template by ID
   */
  static getTemplateById(id) {
    const all = this.getAllTemplates();
    return all.find(t => t.id === id) || null;
  }

  /**
   * Save a new custom template
   */
  static saveCustomTemplate(name, content) {
    if (!name || !name.trim()) {
      throw new Error('O nome do template é obrigatório.');
    }
    if (!content || !content.trim()) {
      throw new Error('O conteúdo do template não pode estar vazio.');
    }

    const customTemplates = this.getCustomTemplates();
    const newTemplate = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      badge: 'Personalizado',
      content: content,
      createdAt: new Date().toISOString()
    };

    customTemplates.push(newTemplate);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
    return newTemplate;
  }

  /**
   * Delete a custom template by ID
   */
  static deleteCustomTemplate(id) {
    if (id.startsWith('builtin-')) {
      throw new Error('Não é possível excluir templates padrão da aplicação.');
    }
    const customTemplates = this.getCustomTemplates().filter(t => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customTemplates));
    return true;
  }

  /**
   * Export all custom templates as JSON string
   */
  static exportTemplatesAsJSON() {
    const custom = this.getCustomTemplates();
    return JSON.stringify(custom, null, 2);
  }

  /**
   * Import custom templates from JSON string
   */
  static importTemplatesFromJSON(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      if (!Array.isArray(imported)) {
        throw new Error('Formato JSON inválido. Esperava-se uma lista de templates.');
      }

      const current = this.getCustomTemplates();
      let importedCount = 0;

      imported.forEach(item => {
        if (item.name && item.content) {
          current.push({
            id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            name: item.name,
            badge: 'Personalizado',
            content: item.content,
            createdAt: new Date().toISOString()
          });
          importedCount++;
        }
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
      return importedCount;
    } catch (e) {
      throw new Error('Erro ao importar templates: ' + e.message);
    }
  }
}

// Export for browser
window.TemplateManager = TemplateManager;
window.BUILTIN_TEMPLATES = BUILTIN_TEMPLATES;
