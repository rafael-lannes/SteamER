# 🎮 SteamER - "Steam Easy Review"

> **Criado por Rafael Lannes** • [Repositório no GitHub](https://github.com/rafael-lannes/SteamER) • [Portfólio](https://rafael-lannes.github.io/)

Uma aplicação web moderna, rápida e responsiva criada para facilitar a criação, formatação, organização e publicação de análises (reviews) de jogos na **Steam**.

---

## ✨ Funcionalidades Principais

1. **Página Inicial (Home / Landing Page)**:
   - Tela de boas-vindas com design limpo e moderno.
   - Acesso rápido aos fluxos essenciais: **Nova Review**, **Editor de Análise**, **Minhas Reviews** e **Importar / Backup JSON**.
   - Painel de retomada para continuar a edição da análise atual em andamento com um clique.
   - Apresentação completa das ferramentas e créditos do desenvolvedor **Rafael Lannes** com links para GitHub e portfólio.

2. **Ditado por Voz Inteligente (Voice-to-Text / Speech Recognition)**:
   - Recurso nativo via **Web Speech API** para ditar análises e anotações falando no microfone.
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
   - Monitoramento contínuo de limite para não estourar a cota de 8.000 caracteres.

3. **Menu Unificado de Aparência (5 Temas Visuais & 2 Modos de Layout)**:
   - Botão `[ 🎨 Aparência ]` no cabeçalho com dropdown unificado e persistência automática:
     - 🌑 **Tela OLED**: Preto puro (`#000000`), zero emissão de luz de fundo em pixels pretos, azul elétrico de alto contraste e economia de bateria/vida útil em monitores OLED.
     - 🌌 **Steam Padrão (Dark)**: Visual moderno e elegante com tons de cinza azulado do cliente atual da Steam.
     - 🌿 **Steam 2003 (Clássico)**: Nostalgia vintage em verde militar e cinza oliva da era de ouro do Half-Life e CS 1.6.
     - ⚓ **Steam 2011 (Midnight)**: Visual clássico com azul-marinho profundo e realces metálicos.
     - 🫧 **Frutiger Aero**: Estética anos 2000 com transparências, botões estilo glossy e degradês azul piscina.
   - **Modos de Layout**: Alternância instantânea entre modo **Lado a Lado** (2 colunas) e **Empilhado** (1 coluna).

4. **Navegação SPA Fluida (Início / Editor / Minhas Reviews)**:
   - Alternância instantânea entre abas sem recarregar a página.
   - Logotipo clicável no cabeçalho para retorno imediato à página inicial.
   - Contador de reviews salvas no cabeçalho.

5. **Seletor de Veredito & Recomendação**:
   - Botões visuais no editor para classificar o jogo como **👍 Recomendo** ou **👎 Não Recomendo**.
   - Atualização em tempo real do cabeçalho oficial da análise na prévia com badge colorida.

6. **Biblioteca "Minhas Reviews" com Busca e Filtros Avançados**:
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

7. **Sistema de Backup & Restauração Completa (JSON)**:
   - **Exportar Backup**: Gera arquivo `.json` estruturado com todas as reviews, anotações de rascunho de cada jogo e moldes personalizados.
   - **Importar Backup Validado**: Lê arquivos `.json` com validação de esquema e suporte a **Substituir Tudo** ou **Mesclar Dados**.
   - **Limpeza & Reset Seguro**: Permite redefinir os dados locais com proteção contra exclusões acidentais.

8. **Bloco de Notas Exclusivo por Jogo (Scratchpad)**:
   - Anotações persistentes salvas individualmente para cada jogo analisado.
   - Não interferem no limite de caracteres da análise.
   - Suporte a **Desprender Janela (`↗️`)** flutuante independente sincronizada em tempo real (ideal para múltiplos monitores durante o gameplay).
   - Botão para transferir notas ou seleções diretamente para o corpo da análise.

9. **Barra de Ferramentas BBCode Steam Completa**:
   - Formatação rápida: Negrito (`[b]`), Itálico (`[i]`), Sublinhado (`[u]`), Tachado (`[s]`).
   - Títulos e Cabeçalhos (`[h1]`, `[h2]`, `[h3]`).
   - Cores personalizadas (`[color=#HEX]`) com paleta rápida e seletor hexadecimal.
   - Inserção de Links (`[url=https://...]texto[/url]`).
   - Citações (`[quote]`) e Spoilers ocultos com efeito hover (`[spoiler]`).
   - Listas demarcadas (`[list]`), numeradas (`[olist]`), linhas divisórias (`[hr]`) e blocos de código (`[code]`).

10. **Sistema de Avaliação por Notas / Estrelas (BBCode)**:
    - Escalas de **1 a 5** ou **1 a 10** estrelas com múltiplos estilos visuais em texto (`★★★★☆ 4/5`, `[████████░░] 8/10`, etc.).

11. **Contador e Limitador Rígido de Caracteres (8.000)**:
    - Contagem precisa em tempo real de caracteres, palavras e linhas com barra de progresso colorida e aviso sonoro/visual ao aproximar-se do limite.

12. **Gerenciador de Moldes / Templates Customizáveis**:
    - Moldes padrão pré-carregados (Análise Rápida, Análise Detalhada, Prós e Contras).
    - Criação, salvamento e remoção de novos moldes personalizados pelo próprio usuário.

13. **Visualização Steam Live & Exportação Pronta**:
    - Pré-visualização ao vivo idêntica ao layout da loja e comunidade Steam.
    - Botão em destaque **"Copiar Texto Formatado"** pronto para colar no cliente Steam e botão para download em arquivo `.txt`.

---

## 🚀 Como Executar

Por ser uma aplicação web moderna em JavaScript Vanilla, HTML5 e CSS3, você pode executá-la de duas formas:

### 1. Servidor Local (Recomendado para Ditado por Voz)
Para utilizar o **Ditado por Voz** sem restrições de permissão ou rede impostas pelos navegadores para arquivos locais, execute o projeto em um servidor local:

* **Opção A (VS Code / Live Server)**:
  Abra a pasta no VS Code e clique em **"Go Live"** (extensão Live Server) ou clique com o botão direito no `index.html` &rarr; *"Open with Live Server"*.

* **Opção B (Terminal / Node.js)**:
  ```bash
  npx serve
  ```

* **Opção C (Terminal / Python)**:
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
| `Ctrl + B` | Inserir / Envolver seleção em **Negrito** (`[b]`) |
| `Ctrl + I` | Inserir / Envolver seleção em *Itálico* (`[i]`) |
| `Ctrl + U` | Inserir / Envolver seleção em <u>Sublinhado</u> (`[u]`) |
| `Ctrl + K` | Abrir modal de Inserção de Link (`[url]`) |
| `Ctrl + Shift + S` | Inserir / Envolver seleção em Spoiler (`[spoiler]`) |
| `Tab` | Inserir indentação de 2 espaços |
