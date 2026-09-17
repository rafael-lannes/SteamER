# SteamER - Steam Easy Review (v3.0)

> **Desenvolvido por Rafael Lannes** • [Repositório no GitHub](https://github.com/rafael-lannes/SteamER) • [Portfólio](https://rafael-lannes.github.io/)

Aplicação web para escrever, formatar e organizar análises de jogos para a Steam, com suporte a BBCode nativo, contagem de caracteres e armazenamento local.

---

## Funcionalidades

### 1. Página Inicial
- **Ações Rápidas**: Atalhos diretos para criar nova review, abrir o editor, acessar a biblioteca ou gerenciar backups.
- **Retomar Edição**: Card dinâmico para continuar a última análise aberta.
- **Visão Geral de Recursos**: Resumo das principais ferramentas da aplicação.

### 2. Assistente de IA
Integrado ao editor de análises e ao bloco de notas (`Ctrl + J`), com suporte a chaves próprias (**BYOK**):
- **Provedores Suportados**:
  - **Google Gemini**: modelos `gemini-2.0-flash`, `gemini-2.5-flash` e `gemini-1.5-flash-latest` com auto-descoberta de rotas.
  - **Groq**: modelo `llama-3.3-70b-versatile` (respostas rápidas e sem custo).
  - **OpenAI**: modelo `gpt-4o-mini`.
- **Ações Disponíveis**:
  - Correção gramatical e melhoria de vocabulário.
  - Tradução entre Português, Inglês e Espanhol preservando tags BBCode.
  - Ajuste de tom (Gamer Entusiasta, Crítico Técnico, Casual ou Direto).
  - Geração de seções de Prós & Contras e Veredito.
  - Transformação de tópicos soltos do bloco de notas em análise completa.
  - Encurtar ou expandir texto para ajuste ao limite de tamanho.
  - Instruções personalizadas em texto livre.
- **Segurança**: As chaves de API ficam salvas apenas no `localStorage` do seu navegador.

### 3. Ditado por Voz
Transcrição de fala para texto no editor e no bloco de notas através da Web Speech API.
- **Pontuação falada em português**:
  - *"ponto"* ou *"ponto final"* &rarr; `.`
  - *"vírgula"* &rarr; `,`
  - *"interrogação"* &rarr; `?`
  - *"exclamação"* &rarr; `!`
  - *"dois pontos"* &rarr; `:`
  - *"ponto e vírgula"* &rarr; `;`
  - *"nova linha"* ou *"novo parágrafo"* &rarr; `\n\n`
  - *"abrir aspas"* / *"fechar aspas"* &rarr; `"`
  - *"abrir parênteses"* / *"fechar parênteses"* &rarr; `(` / `)`
  - *"traço"* ou *"hífen"* &rarr; ` — `

### 4. Temas Visuais e Layout
Menu de aparência no cabeçalho com 5 opções de tema:
- **Tela OLED**: Preto puro (`#000000`) para telas OLED e alto contraste.
- **Steam Padrão**: Tema escuro padrão da Steam.
- **Steam 2003**: Tema verde e oliva clássico da era Half-Life / CS 1.6.
- **Steam 2011**: Tema azul-marinho midnight.
- **Frutiger Aero**: Estética translúcida com degradês dos anos 2000.
- **Modos de visualização**: Alternância entre exibição lado a lado (editor e prévia) ou empilhado.

### 5. Editor e Formatação BBCode
- Formatações rápidas: Negrito (`[b]`), Itálico (`[i]`), Sublinhado (`[u]`), Tachado (`[s]`).
- Cabeçalhos (`[h1]`, `[h2]`, `[h3]`).
- Spoilers com efeito hover (`[spoiler]`) e Citações (`[quote]`).
- Cores personalizadas (`[color=#hex]`), links (`[url]`), listas demarcadas e numeradas.
- Construtor de avaliação por estrelas (1 a 5 ou 1 a 10) e barras de nota em texto.
- Seletor de recomendação (👍 Recomendo / 👎 Não Recomendo).

### 6. Bloco de Notas por Jogo (Scratchpad)
- Rascunhos e anotações independentes para cada jogo cadastrado.
- Não consomem o limite de caracteres da análise.
- Suporte a **Janela Flutuante (`↗️`)** sincronizada em tempo real para uso em segundo monitor durante a gameplay.

### 7. Limite de Caracteres da Steam
- Contagem em tempo real de caracteres, palavras e linhas.
- Alerta visual para o limite oficial de **8.000 caracteres** por análise na Steam.

### 8. Biblioteca e Organização
- Catálogo de todas as reviews salvas com alternância entre visualização em Cards ou Feed/Blog da Steam.
- Estatísticas rápidas de total de reviews, positivas, negativas e contagem de palavras.
- Busca por nome do jogo ou termos no texto e nas notas.
- Ordenação por data de edição, nome do jogo, tamanho do texto ou recomendação.

### 9. Backup e Exportação
- **Exportação JSON**: Salva todo o catálogo de reviews, notas e moldes em um arquivo único.
- **Importação com Validação**: Suporte a substituir todos os dados ou mesclar com os registros existentes.
- **Exportação de Texto**: Botão para copiar o BBCode pronto para colar na Steam ou baixar arquivo `.txt`.

---

## Como Executar

A aplicação é construída em HTML, CSS e JavaScript puros (sem dependências de compilação ou instalação).

### 1. Servidor Local (Recomendado)
Para usar recursos como o Ditado por Voz e a IA com permissões normais do navegador em `http://localhost`:

- **Arquivo `.bat` (Windows)**:
  Dê um duplo clique no arquivo [`iniciar_servidor.bat`](file:///d:/Gamedev/Projetos/SteamReviewEditor/iniciar_servidor.bat). Ele inicia o servidor local em PowerShell e abre o navegador em `http://localhost:8080`.
- **VS Code**: Use a extensão Live Server clicando com o botão direito no `index.html` &rarr; *Open with Live Server*.
- **Node.js**: `npx serve`
- **Python**: `python -m http.server 8080`

### 2. Abertura Direta
Você também pode abrir o arquivo `index.html` diretamente no navegador com dois cliques para usar o editor, moldes, pré-visualização e backup.

---

## Atalhos de Teclado

| Atalho | Ação |
| :--- | :--- |
| `Ctrl + J` | Abrir Assistente de IA |
| `Ctrl + B` | Negrito (`[b]`) |
| `Ctrl + I` | Itálico (`[i]`) |
| `Ctrl + U` | Sublinhado (`[u]`) |
| `Ctrl + K` | Inserir Link (`[url]`) |
| `Ctrl + Shift + S` | Spoiler (`[spoiler]`) |
| `Tab` | Indentação (2 espaços) |
