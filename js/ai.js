/**
 * SteamER - AI Assistant Module
 * Supports Google Gemini (Free), Groq (Llama 3 / Fast Free) and OpenAI (GPT-4o-mini).
 * Specialized in Steam Game Reviews, BBCode preservation, and Scratchpad notes.
 */

const AiAssistant = (() => {
  const STORAGE_KEY = 'steamer_ai_config';

  const DEFAULT_CONFIG = {
    provider: 'gemini', // 'gemini' | 'groq' | 'openai'
    geminiKey: '',
    geminiModel: 'gemini-2.0-flash',
    groqKey: '',
    groqModel: 'llama-3.3-70b-versatile',
    openaiKey: '',
    openaiModel: 'gpt-4o-mini',
    temperature: 0.7
  };

  let cachedGeminiModel = null;

  /**
   * Loads saved AI configuration from localStorage
   */
  function getConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_CONFIG };
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch (e) {
      console.warn('AiAssistant: failed to parse config from localStorage', e);
      return { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Saves AI configuration to localStorage
   */
  function saveConfig(config) {
    try {
      const merged = { ...getConfig(), ...config };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return true;
    } catch (e) {
      console.error('AiAssistant: failed to save config', e);
      return false;
    }
  }

  /**
   * Returns active API key for the selected provider
   */
  function getActiveApiKey(config = getConfig()) {
    if (config.provider === 'gemini') return (config.geminiKey || '').trim().replace(/^["']|["']$/g, '');
    if (config.provider === 'groq') return (config.groqKey || '').trim().replace(/^["']|["']$/g, '');
    if (config.provider === 'openai') return (config.openaiKey || '').trim().replace(/^["']|["']$/g, '');
    return '';
  }

  /**
   * Checks if active provider has an API key configured
   */
  function hasApiKey() {
    return Boolean(getActiveApiKey());
  }

  /**
   * Generates the system prompt tailored to Steam reviews and gaming notes
   */
  function getSystemPrompt(isNotesContext = false) {
    if (isNotesContext) {
      return `Você é o Assistente de Inteligência Artificial integrado ao SteamER (Steam Easy Review Editor).
Sua função é auxiliar jogadores a redigir, aprimorar, organizar e traduzir anotações pessoais de jogos e rascunhos.

DIRETRIZES FUNDAMENTAIS DE SAÍDA:
1. Retorne ESTRITA e EXCLUSIVAMENTE o texto final pronto. NUNCA inclua saudações, introduções (como "Aqui estão suas notas:", "Com certeza!", "Segue o texto:"), preâmbulos, explicações ou repita o comando/prompt do usuário.
2. NUNCA repita o texto do prompt ou o enunciado da instrução na resposta. Comece diretamente pelo conteúdo solicitado.
3. Se o texto contiver BBCode da Steam ([b], [i], [h1], [quote], [list], [spoiler], etc.), PRESERVE as tags rigorosamente bem fechadas e posicionadas.
4. Se for solicitado traduzir, mantenha o vocabulário e gírias gamer naturais e precisas.
5. Mantenha as opiniões e sensações do jogador sobre o jogo intactas.`;
    }

    return `Você é o Assistente de Inteligência Artificial especializado do SteamER (Steam Easy Review Editor).
Sua missão é ajudar jogadores a escrever, aprimorar, traduzir, modular o tom e estruturar análises (reviews) de jogos da Steam com altíssima qualidade.

REGRAS ESTRITAS E INVIOLÁVEIS:
1. FORMATO DE SAÍDA: Retorne ESTRITAMENTE o texto final pronto para colar. NUNCA inclua meta-conversa, saudações ("Com certeza!", "Aqui está a sua review:"), preâmbulos ou blocos de código markdown desnecessários (\`\`\`bbcode) a menos que explicitamente pedido.
2. NUNCA repita o enunciado do pedido, o prompt ou as instruções dadas. Comece imediatamente com a primeira palavra do texto gerado.
3. PRESERVAÇÃO DE BBCODE DA STEAM: As análises utilizam o padrão BBCode da Steam ([b], [i], [u], [s], [h1], [h2], [h3], [quote], [spoiler], [list], [*], [olist], [color=#hex], [url=link]texto[/url], [code], [hr]).
   - Se o texto fornecido pelo usuário contiver BBCode, PRESERVE todas as tags existentes, garantindo que continuem válidas e balanceadas.
   - Quando sugerir seções ou destaques, use BBCode válido da Steam.
4. LIMITE DE 8.000 CARACTERES: A Steam possui um limite rígido de 8.000 caracteres. A sua resposta NUNCA deve ultrapassar 8.000 caracteres.
5. AUTENTICIDADE GAMER: Mantenha o jargão, termos técnicos de jogos (ex: framerate, hitbox, build, cooldown, pacing, loop de gameplay, ambientação, trilha sonora, otimização) e respeite rigorosamente o veredito do usuário (não transforme uma análise negativa em positiva ou vice-versa).`;
  }

  /**
   * Queries Google API to discover available models for this specific API key
   */
  async function listGeminiModels(apiKey) {
    const urls = [
      'https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(apiKey),
      'https://generativelanguage.googleapis.com/v1/models?key=' + encodeURIComponent(apiKey)
    ];

    for (const url of urls) {
      try {
        const resp = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && Array.isArray(data.models)) {
            const found = data.models
              .filter(m => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
              .map(m => (m.name || '').replace(/^models\//, ''))
              .filter(Boolean);
            if (found.length > 0) return found;
          }
        } else if (resp.status === 403) {
          throw new Error('Erro na API Gemini (403): Permissão negada. A chave de API não possui a "Generative Language API" ativada ou foi criada sob uma conta com restrições. No Google AI Studio (aistudio.google.com), crie uma chave selecionando "Create API key in new project".');
        } else if (resp.status === 400) {
          throw new Error('Erro na API Gemini (400): Chave de API inválida.');
        }
      } catch (e) {
        if (e.message && (e.message.includes('403') || e.message.includes('400'))) {
          throw e;
        }
      }
    }
    return [];
  }

  /**
   * Executes a single Gemini generateContent request trying v1beta and v1 endpoints
   */
  async function executeGeminiRequest(userPrompt, systemInstruction, model, apiKey, config) {
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
    const cleanModel = (model || 'gemini-2.0-flash').replace(/^models\//, '');

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: 8192
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const endpoints = [
      'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(cleanModel) + ':generateContent?key=' + encodeURIComponent(cleanKey),
      'https://generativelanguage.googleapis.com/v1/models/' + encodeURIComponent(cleanModel) + ':generateContent?key=' + encodeURIComponent(cleanKey)
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          if (candidate?.content?.parts?.[0]?.text) {
            return cleanGeneratedText(candidate.content.parts[0].text);
          }
          if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
            throw new Error('A geração foi interrompida pelo Gemini. Motivo: ' + candidate.finishReason);
          }
        } else {
          let errDetail = '';
          try {
            const errJson = await response.json();
            errDetail = errJson.error?.message || response.statusText;
          } catch (e) {
            errDetail = response.statusText;
          }
          if (response.status === 403) {
            throw new Error('Erro na API Gemini (403): Permissão negada para esta chave. No Google AI Studio (aistudio.google.com), clique em "Create API key" e escolha a opção "Create API key in new project" (Criar em novo projeto).');
          }
          if (response.status === 400 && errDetail.toLowerCase().includes('api key')) {
            throw new Error('Erro na API Gemini (400): Chave de API inválida. Verifique o código copiado.');
          }
          lastError = new Error('Erro na API Gemini (' + response.status + '): ' + errDetail);
        }
      } catch (err) {
        if (err.message && (err.message.includes('403') || err.message.includes('400'))) {
          throw err;
        }
        lastError = err;
      }
    }

    throw lastError || new Error('Não foi possível obter resposta do modelo ' + cleanModel);
  }

  /**
   * Calls Google Gemini API with smart model discovery and fallback chains
   */
  async function callGemini(userPrompt, systemInstruction, config) {
    const apiKey = (config.geminiKey || '').trim().replace(/^["']|["']$/g, '');
    if (!apiKey) throw new Error('Chave de API do Google Gemini não configurada.');

    // 1. Discover available models for this specific API key
    let availableModels = [];
    try {
      availableModels = await listGeminiModels(apiKey);
    } catch (err) {
      throw err;
    }

    // 2. Build prioritized candidate list
    const preferredOrder = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-2.5-pro',
      'gemini-pro'
    ];

    let candidateModels = [];

    if (availableModels.length > 0) {
      for (const pref of preferredOrder) {
        if (availableModels.includes(pref)) {
          candidateModels.push(pref);
        }
      }
      for (const m of availableModels) {
        if (!candidateModels.includes(m)) {
          candidateModels.push(m);
        }
      }
    } else {
      candidateModels = preferredOrder;
    }

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const result = await executeGeminiRequest(userPrompt, systemInstruction, model, apiKey, config);
        cachedGeminiModel = model;
        if (config.geminiModel !== model) {
          saveConfig({ geminiModel: model });
        }
        return result;
      } catch (err) {
        lastError = err;
        if (err.message && (err.message.includes('404') || err.message.includes('is not found') || err.message.includes('not supported'))) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('Não foi possível encontrar nenhum modelo suportado na sua conta Gemini.');
  }

  /**
   * Calls Groq API (OpenAI-compatible REST) with fallback support
   */
  async function callGroq(userPrompt, systemInstruction, config) {
    const apiKey = (config.groqKey || '').trim().replace(/^["']|["']$/g, '');
    if (!apiKey) throw new Error('Chave de API da Groq não configurada.');

    const candidateModels = [
      config.groqModel || 'llama-3.3-70b-versatile',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768'
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        const payload = {
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ],
          temperature: config.temperature ?? 0.7,
          max_tokens: 4096
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          let errDetail = '';
          try {
            const errJson = await response.json();
            errDetail = errJson.error?.message || response.statusText;
          } catch (e) {
            errDetail = response.statusText;
          }
          throw new Error('Erro na API Groq (' + response.status + '): ' + errDetail);
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content;
        if (!result) throw new Error('Nenhuma resposta retornada pela API da Groq.');

        if (config.groqModel !== model) {
          saveConfig({ groqModel: model });
        }

        return cleanGeneratedText(result);
      } catch (err) {
        lastError = err;
        if (err.message && (err.message.includes('404') || err.message.includes('model_not_found') || err.message.includes('decommissioned'))) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('Falha ao conectar com a API da Groq.');
  }

  /**
   * Calls OpenAI API with fallback support
   */
  async function callOpenAI(userPrompt, systemInstruction, config) {
    const apiKey = (config.openaiKey || '').trim().replace(/^["']|["']$/g, '');
    if (!apiKey) throw new Error('Chave de API da OpenAI não configurada.');

    const candidateModels = [
      config.openaiModel || 'gpt-4o-mini',
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-3.5-turbo'
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const payload = {
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ],
          temperature: config.temperature ?? 0.7,
          max_tokens: 4096
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          let errDetail = '';
          try {
            const errJson = await response.json();
            errDetail = errJson.error?.message || response.statusText;
          } catch (e) {
            errDetail = response.statusText;
          }
          throw new Error('Erro na API OpenAI (' + response.status + '): ' + errDetail);
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content;
        if (!result) throw new Error('Nenhuma resposta retornada pela API da OpenAI.');

        if (config.openaiModel !== model) {
          saveConfig({ openaiModel: model });
        }

        return cleanGeneratedText(result);
      } catch (err) {
        lastError = err;
        if (err.message && (err.message.includes('404') || err.message.includes('model_not_found'))) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('Falha ao conectar com a API da OpenAI.');
  }

  /**
   * Cleans AI generated text: removes markdown code fences, echoed system tags, and conversational filler
   */
  function cleanGeneratedText(text) {
    if (!text) return '';
    let cleaned = text.trim();

    // 1. Strip echoed system tags if model repeated them
    cleaned = cleaned.replace(/^\[INSTRUÇÕES(?: DO SISTEMA)?:[\s\S]*?\]\s*/i, '');

    // 2. Strip leading ```bbcode or ```markdown or ```
    cleaned = cleaned.replace(/^```(?:bbcode|markdown|text)?\r?\n?/i, '');
    // Strip trailing ```
    cleaned = cleaned.replace(/\r?\n?```$/i, '');

    // 3. Strip common conversational LLM prefixes
    const introPatterns = [
      /^(?:Aqui está|Aqui estao|Segue|Segue abaixo|Com certeza!?|Claro!?|Aqui tem|Aqui vai|Resultado gerado|Versão melhorada|Análise aprimorada|Review aprimorada)[^:\n]*:\s*/i,
      /^(?:Here is|Here's|Sure!?|Certainly!?)[^:\n]*:\s*/i
    ];

    for (const pattern of introPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned.trim();
  }

  /**
   * Generic generation dispatcher based on configured provider
   */
  async function generate(userPrompt, options = {}) {
    const config = getConfig();
    const isNotesContext = Boolean(options.isNotesContext);
    const systemPrompt = options.systemPrompt || getSystemPrompt(isNotesContext);

    if (config.provider === 'gemini') {
      return await callGemini(userPrompt, systemPrompt, config);
    } else if (config.provider === 'groq') {
      return await callGroq(userPrompt, systemPrompt, config);
    } else if (config.provider === 'openai') {
      return await callOpenAI(userPrompt, systemPrompt, config);
    } else {
      throw new Error('Provedor desconhecido: ' + config.provider);
    }
  }

  /**
   * Tests connection with active API provider
   */
  async function testConnection(testConfig = getConfig()) {
    const testPrompt = 'Diga apenas a palavra "Conectado!" se recebeu esta mensagem.';
    const systemPrompt = 'Você é um validador de teste de API. Responda apenas "Conectado!".';

    if (testConfig.provider === 'gemini') {
      return await callGemini(testPrompt, systemPrompt, testConfig);
    } else if (testConfig.provider === 'groq') {
      return await callGroq(testPrompt, systemPrompt, testConfig);
    } else if (testConfig.provider === 'openai') {
      return await callOpenAI(testPrompt, systemPrompt, testConfig);
    } else {
      throw new Error('Provedor desconhecido: ' + testConfig.provider);
    }
  }

  /**
   * Prepares prompt for specific predefined actions
   */
  function buildActionPrompt(actionId, inputText, context = {}) {
    const gameTitle = context.gameTitle || 'Jogo';
    const isNotes = Boolean(context.isNotesContext);
    const targetLabel = isNotes ? 'anotações' : 'análise da Steam';

    switch (actionId) {
      case 'improve':
        return 'Melhore a escrita do texto a seguir para esta ' + targetLabel + ' de ' + gameTitle + '. Corrija problemas de concordância, aumente a clareza e a fluidez, mantendo todo o estilo original e preservando integralmente todas as tags BBCode existentes. Não repita esta instrução nem adicione saudações, responda apenas com o texto melhorado:\n\n' + inputText;

      case 'fix_grammar':
        return 'Revise e corrija rigorosamente todos os erros de ortografia, gramática e pontuação do texto a seguir para a ' + targetLabel + ' de ' + gameTitle + '. Não faça alterações de estilo ou conteúdo além das correções ortográficas e preserve todo o BBCode intacto. Não repita esta instrução, responda apenas com o texto corrigido:\n\n' + inputText;

      case 'translate_en':
        return 'Traduza o texto a seguir para o Inglês (English) natural e gamer. PRESERVE EXATAMENTE todas as tags BBCode da Steam no lugar correto. Retorne apenas o texto traduzido:\n\n' + inputText;

      case 'translate_pt':
        return 'Traduza o texto a seguir para o Português do Brasil (pt-BR) natural e fluido. PRESERVE EXATAMENTE todas as tags BBCode da Steam no lugar correto. Retorne apenas o texto traduzido:\n\n' + inputText;

      case 'translate_es':
        return 'Traduza o texto a seguir para o Espanhol (Español). PRESERVE EXATAMENTE todas as tags BBCode da Steam no lugar correto. Retorne apenas o texto traduzido:\n\n' + inputText;

      case 'tone_enthusiastic':
        return 'Reescreva o texto a seguir para a ' + targetLabel + ' de ' + gameTitle + ' adotando um tom Gamer Entusiasta, empolgante, apaixonado e dinâmico, mantendo o veredito e todo o BBCode. Retorne apenas o texto final:\n\n' + inputText;

      case 'tone_critical':
        return 'Reescreva o texto a seguir para a ' + targetLabel + ' de ' + gameTitle + ' adotando um tom Crítico Técnico, analítico, detalhista e jornalístico (focando em mecânicas, desempenho, áudio e game design), mantendo o veredito e o BBCode. Retorne apenas o texto final:\n\n' + inputText;

      case 'tone_casual':
        return 'Reescreva o texto a seguir para a ' + targetLabel + ' de ' + gameTitle + ' adotando um tom Casual, divertido, leve e bem-humorado, mantendo o veredito e o BBCode. Retorne apenas o texto final:\n\n' + inputText;

      case 'tone_concise':
        return 'Reescreva o texto a seguir para a ' + targetLabel + ' de ' + gameTitle + ' de forma extremamente Concisa, Direta e Objetiva, eliminando prolixidade e indo direto ao ponto, mantendo o BBCode. Retorne apenas o texto final:\n\n' + inputText;

      case 'pros_cons':
        return 'Analise o texto a seguir sobre o jogo ' + gameTitle + ' e gere uma seção estruturada em BBCode com os Pontos Positivos (Prós) e Pontos Negativos (Contras):\n\n[h2]👍 Pontos Positivos[/h2]\n[list]\n[*] ...\n[/list]\n\n[h2]👎 Pontos Negativos[/h2]\n[list]\n[*] ...\n[/list]\n\nTexto base:\n' + inputText;

      case 'verdict_tldr':
        return 'Com base no texto a seguir sobre o jogo ' + gameTitle + ', redija um parágrafo conciso de Resumo / TL;DR e Veredito Final estilizado com BBCode ([quote] ou [b]) para fechar a review com chave de ouro:\n\n' + inputText;

      case 'shorten':
        return 'Encurte e resuma o texto a seguir sobre ' + gameTitle + ' mantendo todos os argumentos principais e cortando redundâncias para garantir que caiba com folga no limite de 8.000 caracteres da Steam, preservando o BBCode. Retorne apenas o texto resumido:\n\n' + inputText;

      case 'expand':
        return 'Aprofunde e expanda a argumentação do texto a seguir sobre ' + gameTitle + ', fornecendo detalhes mais descritivos sobre a experiência de gameplay, ambientação e sensações do jogador, mantendo o BBCode. Retorne apenas o texto expandido:\n\n' + inputText;

      case 'notes_to_review':
        return 'Com base nas seguintes anotações brutas e tópicos do jogo ' + gameTitle + ', escreva uma análise completa, coesa e bem estruturada para a Steam, utilizando títulos [h1]/[h2], listas [list], citações [quote] e destaques em [b] onde fizer sentido. Retorne apenas a review pronta:\n\nAnotações do jogador:\n' + inputText;

      case 'format_notes':
        return 'Organize as seguintes anotações do jogo ' + gameTitle + ' em tópicos claros, divididos por categorias (ex: Jogabilidade, História/Enredo, Gráficos/Desempenho, Dicas/Lembretes). Retorne apenas o texto organizado:\n\n' + inputText;

      case 'custom':
        return (context.customInstruction || 'Melhore o texto a seguir') + ':\n\nTexto:\n' + inputText;

      default:
        return inputText;
    }
  }

  return {
    getConfig,
    saveConfig,
    hasApiKey,
    getActiveApiKey,
    generate,
    testConnection,
    buildActionPrompt,
    listGeminiModels
  };
})();

// Export globally for browser
if (typeof window !== 'undefined') {
  window.AiAssistant = AiAssistant;
}
