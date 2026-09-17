/**
 * SteamER - Voice Dictation Module (Web Speech API)
 * Provides speech-to-text functionality for review editor and notes with spoken punctuation support.
 */

const VoiceDictation = (() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  
  let recognition = null;
  let isListening = false;
  let currentTarget = null;
  let currentOptions = {};

  // Spoken punctuation and formatting replacements for Portuguese
  const punctuationRules = [
    { regex: /\b(?:ponto final|ponto e final)\b/gi, replacement: '.' },
    { regex: /\b(?:ponto de interrogação|ponto de interrogacao|interrogação|interrogacao)\b/gi, replacement: '?' },
    { regex: /\b(?:ponto de exclamação|ponto de exclamacao|exclamação|exclamacao)\b/gi, replacement: '!' },
    { regex: /\b(?:dois pontos)\b/gi, replacement: ':' },
    { regex: /\b(?:ponto e vírgula|ponto e virgula)\b/gi, replacement: ';' },
    { regex: /\b(?:vírgula|virgula)\b/gi, replacement: ',' },
    { regex: /\b(?:novo parágrafo|novo paragrafo|nova linha|quebra de linha)\b/gi, replacement: '\n\n' },
    { regex: /\b(?:abrir aspas|abre aspas)\b/gi, replacement: '"' },
    { regex: /\b(?:fechar aspas|fecha aspas)\b/gi, replacement: '"' },
    { regex: /\b(?:abrir parênteses|abre parenteses)\b/gi, replacement: '(' },
    { regex: /\b(?:fechar parênteses|fecha parenteses)\b/gi, replacement: ')' },
    { regex: /\b(?:travessão|travessao|traço|traco|hífen|hifen)\b/gi, replacement: ' — ' }
  ];

  /**
   * Cleans up spaces around punctuation marks
   */
  function cleanPunctuationSpacing(text) {
    if (!text) return '';
    return text
      .replace(/\s+([.,;:!?])/g, '$1')        // remove space before punctuation
      .replace(/([.,;:!?])(?=[a-zA-Z0-9À-ÿ])/g, '$1 ') // ensure space after punctuation if followed by text
      .replace(/\s{2,}/g, ' ')                 // collapse multiple spaces into one
      .trim();
  }

  /**
   * Applies spoken punctuation rules to recognized speech string
   */
  function processSpokenText(transcript) {
    if (!transcript) return '';
    let processed = transcript;

    // Apply specific spoken punctuation replacements
    for (const rule of punctuationRules) {
      processed = processed.replace(rule.regex, rule.replacement);
    }

    return cleanPunctuationSpacing(processed);
  }

  /**
   * Checks if browser supports native Web Speech API
   */
  function isSupported() {
    return SpeechRecognition !== null;
  }

  /**
   * Inserts text at the current cursor position of target textarea
   */
  function insertTextIntoTarget(textToInsert) {
    if (!currentTarget) return;

    const textarea = currentTarget;
    const startPos = textarea.selectionStart ?? textarea.value.length;
    const endPos = textarea.selectionEnd ?? textarea.value.length;
    const currentValue = textarea.value;

    // Check if we need leading space
    let prefix = '';
    if (startPos > 0 && !/\s$/.test(currentValue.substring(0, startPos)) && !/^[.,;:!?\n]/.test(textToInsert)) {
      prefix = ' ';
    }

    const insertion = prefix + textToInsert;

    // Enforce maxChars limit if specified
    const maxChars = currentOptions.maxChars || 0;
    if (maxChars > 0 && (currentValue.length - (endPos - startPos) + insertion.length) > maxChars) {
      const allowedLength = maxChars - (currentValue.length - (endPos - startPos));
      if (allowedLength <= 0) {
        if (typeof currentOptions.onLimitReached === 'function') {
          currentOptions.onLimitReached(maxChars);
        }
        stop();
        return;
      }
    }

    // Insert text
    const newValue = currentValue.substring(0, startPos) + insertion + currentValue.substring(endPos);
    textarea.value = newValue;

    // Reposition cursor right after inserted text
    const newCursorPos = startPos + insertion.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    // Trigger input event for live counters and autosave
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // Auto scroll to keep inserted text in view
    textarea.scrollTop = textarea.scrollHeight;
  }

  /**
   * Starts voice dictation for a given textarea
   */
  function start(options = {}) {
    if (!isSupported()) {
      if (typeof options.onError === 'function') {
        options.onError('not-supported', 'Reconhecimento de voz não suportado pelo navegador atual.');
      }
      return false;
    }

    // Stop and clean up any existing instance
    if (recognition) {
      try {
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
      } catch (e) {
        // ignore cleanup errors
      }
      recognition = null;
    }

    currentOptions = options;
    currentTarget = options.targetTextarea || null;
    isListening = false;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListening = true;
        if (typeof currentOptions.onStart === 'function') {
          currentOptions.onStart();
        }
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        if (finalTranscript) {
          const processedText = processSpokenText(finalTranscript);
          if (processedText && currentTarget) {
            insertTextIntoTarget(processedText);
          }
        }

        if (typeof currentOptions.onResult === 'function') {
          currentOptions.onResult({
            final: processSpokenText(finalTranscript),
            interim: interimTranscript,
            rawFinal: finalTranscript
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn('VoiceDictation error:', event.error);
        const errType = event.error;
        isListening = false;

        // 'no-speech' happens naturally on pauses; do not show error dialogs
        if (errType === 'no-speech') {
          return;
        }

        // 'aborted' is fired when manually stopped
        if (errType === 'aborted') {
          return;
        }

        let userMessage = 'Ocorreu um erro no reconhecimento de voz.';
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          userMessage = 'Permissão de microfone negada. Permita o microfone no navegador ou certifique-se de executar via http://localhost.';
        } else if (errType === 'audio-capture') {
          userMessage = 'Microfone não encontrado ou indisponível.';
        } else if (errType === 'network') {
          userMessage = 'Erro de conexão com o serviço de voz. A Web Speech API requer conexão com a internet ou acesso via servidor local (ex: http://localhost / Live Server). No Brave, ative os serviços de voz em Configurações.';
        }

        if (typeof currentOptions.onError === 'function') {
          currentOptions.onError(errType, userMessage);
        }
      };

      recognition.onend = () => {
        isListening = false;
        if (typeof currentOptions.onEnd === 'function') {
          currentOptions.onEnd();
        }
      };

      recognition.start();
      return true;
    } catch (err) {
      console.warn('VoiceDictation start error:', err);
      isListening = false;
      if (typeof options.onError === 'function') {
        options.onError('exception', 'Não foi possível iniciar o microfone.');
      }
      return false;
    }
  }

  /**
   * Stops active voice dictation
   */
  function stop() {
    isListening = false;
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        try {
          recognition.abort();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  /**
   * Toggles voice dictation on or off
   */
  function toggle(options = {}) {
    if (isListening && currentTarget === (options.targetTextarea || currentTarget)) {
      stop();
      return false;
    } else {
      return start(options);
    }
  }

  return {
    isSupported,
    start,
    stop,
    toggle,
    isListening: () => isListening,
    getCurrentTarget: () => currentTarget
  };
})();

// Export globally for browser environment
if (typeof window !== 'undefined') {
  window.VoiceDictation = VoiceDictation;
}
