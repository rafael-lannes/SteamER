# 🎮 SteamER - "Steam Easy Review" • v3.0

> **Criado por Rafael Lannes** • [Repositório no GitHub](https://github.com/rafael-lannes/SteamER) • [Portfólio](https://rafael-lannes.github.io/)

Uma aplicação web moderna, rápida e responsiva criada para facilitar a criação, formatação, organização, tradução e publicação de análises (reviews) de jogos na **Steam**.

---

## ✨ Funcionalidades Principais

1. **Página Inicial (Home / Landing Page)**:
   - Tela de boas-vindas com design limpo, moderno e responsivo.
   - **Acesso rápido aos 4 fluxos essenciais**:
     - 🚀 **Nova Review**: Criação imediata com nome do jogo, veredito e moldes.
     - ✍️ **Editor de Análise**: Workspace completo com barra BBCode, limitador e prévia.
     - 📚 **Minhas Reviews**: Biblioteca catalogada com estatísticas e filtros.
     - 💾 **Importar / Backup JSON**: Restauração, mesclagem e exportação total.
   - **Painel de Retomada Ativa**: Card dinâmico para continuar editando a análise em andamento com um clique.
   - **Vitrine Uniforme de 8 Recursos & Ferramentas**:
     1. 🤖 *Assistente de IA Gamer* (Copilot multi-provedor com Gemini, Groq e OpenAI)
     2. 🎙️ *Ditado por Voz Inteligente* (Web Speech API com pontuação em pt-BR)
     3. 🏷️ *Editor BBCode Nativo* (Formatação rica, cores, spoilers e atalhos)
     4. 👁️ *Feed Steam & Prévia ao Vivo* (Visualização em tempo real e modo Blog)
     5. 📝 *Bloco de Notas por Jogo* (Rascunhos persistentes e janela flutuante)
     6. ⭐ *Avaliação por Estrelas & Moldes* (Notas 1-5 / 1-10 e moldes customizados)
     7. ⏱️ *Limitador de 8.000 Caracteres* (Contagem precisa e barra de progresso)
     8. 🎨 *5 Temas Visuais & Backup JSON* (Padrão, OLED, 2003, 2011, Frutiger Aero)
   - Apresentação completa e créditos do desenvolvedor **Rafael Lannes** com links para GitHub e portfólio.

2. **Assistente de Inteligência Artificial Integrado (Estilo Notion AI / Copilot Gamer)**:
   - Disponível tanto no **Editor de Análises** (`Ctrl + J`) quanto no **Bloco de Notas (Scratchpad)**.
   - **Multi-Provedor com Opções Gratuitas (BYOK - Bring Your Own Key)**:
     - 🟢 **Google Gemini** (*gemini-2.0-flash*, *gemini-2.5-flash*, *gemini-1.5-flash-latest*): Auto-descoberta dinâmica de modelos (`ListModels`), suporte às rotas `v1` e `v1beta` e cota gratuita generosa no [Google AI Studio](https://aistudio.google.com/app/apikey).
     - ⚡ **Groq** (*Llama 3.3 70B Versatile*): Gratuito, ultrarrápido (centenas de palavras por segundo) e sem restrições via [console.groq.com](https://console.groq.com/keys).
     - 🔑 **OpenAI** (*gpt-4o-mini*): Para quem já possui saldo e créditos na OpenAI.
   - **Ações Especializadas para Análises da Steam**:
     - ⚡ **Aprimorar & Corrigir**: Melhora clareza, fluidez, vocabulário e correção gramatical preservando o veredito e seu estilo.
     - 🌐 **Tradução com Preservação Rigorosa de BBCode**: Traduza entre Português (🇧🇷), Inglês (🇺🇸) e Espanhol (🇪🇸) mantendo todas as tags (`[b]`, `[h1]`, `[quote]`, `[spoiler]`, `[color]`, `[list]`, etc.) intactas e balanceadas.
     - 🎭 **Modulação de Tom de Voz**: *Gamer Entusiasta* (empolgante e dinâmico), *Crítico Técnico* (analítico e jornalístico), *Casual & Divertido* ou *Conciso & Direto*.
     - 🎮 **Recursos Gamer Steam**:
       - ⚖️ *Gerar Prós & Contras* estruturados em BBCode.
       - 🏆 *Resumo & Veredito Final* com fechamento estilizado em citação.
       - 📝 *Anotações &rarr; Review Completa*: Converte tópicos soltos do bloco de notas em uma análise pronta.
       - 📋 *Organizar Anotações*: Separa notas por categorias (Jogabilidade, História, Gráficos, Dicas).
       - ✂️ *Encurtar / Expandir*: Ajuste fino para caber com folga no limite de 8.000 caracteres.
     - 💬 **Pedido Personalizado**: Campo aberto para instruções livres em linguagem natural.
   - **Saída Limpa e Foco no Resultado**: As respostas são higienizadas para exibir apenas o resultado final pronto, sem repetição de prompts, preâmbulos ou saudações.
   - **Ações de 1 Clique no Resultado**: Botões para **Substituir Texto**, **Inserir Abaixo**, **Copiar** ou **Tentar Novamente**.
   - **Privacidade & Segurança**: Sua chave API é salva exclusivamente no `localStorage` do seu navegador.

3. **Ditado por Voz Inteligente (Voice-to-Text / Speech Recognition)**:
   - Recurso nativo via **Web Speech API** para ditar análises e anotações falando diretamente no microfone.
   - Disponível tanto no **Editor de Análises** quanto no **Bloco de Notas**.
   - **Comandos de Pontuação e Formatação Falada em Português (`pt-BR`)**:
     - *"ponto final"* / *"ponto"* &rarr; `.`
     - *"vírgula"* &rarr; `,`
     - *"ponto de interrogação"* / *"interrogação"* &rarr; `?`
     - *"ponto de exclamação"* / *"exclamação"* &rarr; `!`
     - *"dois pontos"* &rarr; `:`
     - *"ponto e vírgula"* &rarr; `;`
     - *"novo parágrafo"* / *"nova linha"* / *"quebra de linha"* &rarr; `\n\n`
     - *"abrir aspas"* / *"fechar aspas"* &rarr; `"`
     - *"abrir parênteses"* / *"fechar parênteses"* &rarr; `(` / `)`
     - *"travessão"* / *"traço"* / *"hífen"* &rarr; ` — `
   - Inserção inteligente na exata posição do cursor no texto com ajuste automático de espaçamentos.
   - Monitoramento contínuo para não ultrapassar o limite de 8.000 caracteres.

4. **Menu Unificado de Aparência (5 Temas Visuais & 2 Modos de Layout)**:
   - Botão `[ 🎨 Aparência ]` no cabeçalho com dropdown unificado e persistência automática:
     - 🌑 **Tela OLED**: Preto puro (`#000000`), zero emissão de luz de fundo em pixels pretos, azul elétrico de alto contraste e máxima economia de bateria/vida útil em painéis OLED.
     - 🌌 **Steam Padrão (Dark)**: Visual moderno e elegante com tons de cinza azulado do cliente atual da Steam.
     - 🌿 **Steam 2003 (Clássico)**: Nostalgia vintage em verde militar e cinza oliva da era de ouro do Half-Life e CS 1.6.
     - ⚓ **Steam 2011 (Midnight)**: Visual clássico com azul-marinho profundo e realces metálicos.
     - 🫧 **Frutiger Aero**: Estética anos 2000 com transparências, botões estilo glossy e degradês azul piscina.
   - **Modos de Layout**: Alternância instantânea entre modo **Lado a Lado** (2 colunas) e **Empilhado** (1 coluna).

5. **Navegação SPA Fluida (Início / Editor / Minhas Reviews)**:
   - Alternância instantânea entre abas sem recarregar a página.
   - Logotipo clicável no cabeçalho para retorno imediato à página inicial.
   - Contador dinâmico de reviews salvas no cabeçalho.

6. **Seletor de Veredito & Recomendação**:
   - Botões visuais no editor para classificar o jogo como **👍 Recomendo** ou **👎 Não Recomendo**.
   - Atualização em tempo real do cabeçalho oficial da análise na prévia com badge colorida.

7. **Biblioteca "Minhas Reviews" com Busca e Filtros Avançados**:
   - Catálogo completo de todas as suas análises salvas com visualização em **Cards** ou **Feed / Blog Steam**.
   - **Estatísticas rápidas**: Total de análises, recomendadas 👍, não recomendadas 👎 e total de palavras escritas.
   - **Busca em tempo real**: Filtre por título do jogo ou trechos contidos no texto da análise e anotações.
   - **Filtros rápidos**: *Todos*, *👍 Recomendados*, *👎 Não Recomendados* e *📝 Com Anotações*.
   - **Ordenação múltipla**:
     - 🕒 Mais recentes (última edição) / Mais antigas
     - 🔤 Nome do jogo (A - Z) / (Z - A)
     - 📝 Mais longas / Mais curtas (quantidade de caracteres)
     - 👍 Recomendados primeiro / 👎 Não Recomendados primeiro
   - **Ações rápidas**: Abrir no Editor, Copiar BBCode, Baixar .txt, Duplicar e Excluir.

8. **Sistema de Backup & Restauração Completa (JSON)**:
   - **Exportar Backup**: Gera arquivo `.json` estruturado com todas as reviews, anotações de rascunho de cada jogo e moldes personalizados.
   - **Importar Backup Validado**: Lê arquivos `.json` com validação de esquema e suporte a **Substituir Tudo** ou **Mesclar Dados**.
   - **Limpeza & Reset Seguro**: Permite redefinir os dados locais com proteção contra exclusões acidentais.

9. **Bloco de Notas Exclusivo por Jogo (Scratchpad)**:
   - Anotações persistentes salvas individualmente para cada jogo analisado com suporte a **Assistente de IA**.
   - Não interferem no limite de caracteres da análise.
   - Suporte a **Desprender Janela (`↗️`)** flutuante independente sincronizada em tempo real (ideal para múltiplos monitores durante o gameplay).
   - Botões de IA para transformar anotações em review com um clique.

10. **Barra de Ferramentas BBCode Steam Completa**:
    - Formatação rápida: Negrito (`[b]`), Itálico (`[i]`), Sublinhado (`[u]`), Tachado (`[s]`).
    - Títulos e Cabeçalhos (`[h1]`, `[h2]`, `[h3]`).
    - Cores personalizadas (`[color=#HEX]`) com paleta rápida e seletor hexadecimal.
    - Inserção de Links (`[url=https://...]texto[/url]`).
    - Citações (`[quote]`) e Spoilers ocultos com efeito hover (`[spoiler]`).
    - Listas demarcadas (`[list]`), numeradas (`[olist]`), linhas divisórias (`[hr]`) e blocos de código (`[code]`).

11. **Sistema de Avaliação por Notas / Estrelas (BBCode)**:
    - Escalas de **1 a 5** ou **1 a 10** estrelas com múltiplos estilos visuais em texto (`★★★★☆ 4/5`, `[████████░░] 8/10`, etc.).

12. **Contador e Limitador Rígido de Caracteres (8.000)**:
    - Contagem precisa em tempo real de caracteres, palavras e linhas com barra de progresso colorida e aviso sonoro/visual ao aproximar-se do limite.

13. **Gerenciador de Moldes / Templates Customizáveis**:
    - Moldes padrão pré-carregados (Análise Rápida, Análise Detalhada, Prós e Contras).
    - Criação, salvamento e remoção de novos moldes personalizados pelo próprio usuário.

14. **Visualização Steam Live & Exportação Pronta**:
    - Pré-visualização ao vivo idêntica ao layout da loja e comunidade Steam.
    - Botão em destaque **"Copiar Texto Formatado"** pronto para colar no cliente Steam e botão para download em arquivo `.txt`.

---

## 🚀 Como Executar

Por ser uma aplicação web moderna em JavaScript Vanilla, HTML5 e CSS3, você pode executá-la de duas formas:

### 1. Servidor Local (Recomendado para Ditado por Voz e IA)
Para utilizar o **Ditado por Voz** e a **IA** com todas as permissões liberadas pelo navegador em `http://localhost`:

* **Opção A (Arquivo `.bat` de 1 Clique - Sem Instalações)**:
  Dê um duplo clique no arquivo [`iniciar_servidor.bat`](file:///d:/Gamedev/Projetos/SteamReviewEditor/iniciar_servidor.bat) na pasta raiz do projeto. Ele iniciará o servidor local nativo em PowerShell e abrirá o navegador automaticamente em `http://localhost:8080`.

* **Opção B (VS Code / Live Server)**:
  Abra a pasta no VS Code e clique em **"Go Live"** (extensão Live Server) ou clique com o botão direito no `index.html` &rarr; *"Open with Live Server"*.

* **Opção C (Terminal / Node.js)**:
  ```bash
  npx serve
  ```

* **Opção D (Terminal / Python)**:
  ```bash
  python -m http.server 8080
  ```
  Acesse no navegador: `http://localhost:8080`

### 2. Abertura Direta do Arquivo
Você também pode abrir o `index.html` diretamente com um duplo clique no explorador de arquivos para usar o editor, templates, prévias, backup e toda a formatação BBCode.

---

## ⌨️ Atalhos de Teclado Suportados

| Atalho | Ação |
| :--- | :--- |
| `Ctrl + J` | Abrir **Assistente de IA** (Editor ou Bloco de Notas) |
| `Ctrl + B` | Inserir / Envolver seleção em **Negrito** (`[b]`) |
| `Ctrl + I` | Inserir / Envolver seleção em *Itálico* (`[i]`) |
| `Ctrl + U` | Inserir / Envolver seleção em <u>Sublinhado</u> (`[u]`) |
| `Ctrl + K` | Abrir modal de Inserção de Link (`[url]`) |
| `Ctrl + Shift + S` | Inserir / Envolver seleção em Spoiler (`[spoiler]`) |
| `Tab` | Inserir indentação de 2 espaços |
