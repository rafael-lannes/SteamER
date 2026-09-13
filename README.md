# 🎮 SteamER - "Steam Easy Review"

> **Criado por Rafael Lannes**

Uma aplicação web moderna, rápida e responsiva criada para facilitar a criação, formatação, organização e publicação de análises (reviews) de jogos na **Steam**.

---

## ✨ Funcionalidades Principais

1. **Página Inicial (Home / Landing Page)**:
   - Tela de boas-vindas exibida ao acessar a aplicação.
   - Acesso rápido aos principais fluxos: **Nova Review**, **Importar / Backup JSON**, **Editor de Análise** e **Minhas Reviews**.
   - Painel de retomada da análise atualmente em andamento.
   - Apresentação completa dos recursos e seção de créditos do desenvolvedor **Rafael Lannes** com link para portfólio/GitHub.

2. **Navegação SPA Completa (Início / Editor / Minhas Reviews)**:
   - Alternância fluida e instantânea entre **[ 🏠 Início ]**, **[ ✏️ Editor ]** e **[ 📚 Minhas Reviews ]**.
   - Logo clicável no cabeçalho para retorno instantâneo à página inicial.
   - Contador de reviews salvas no cabeçalho.

3. **Visualização em Blog / Feed Steam**:
   - Modo de exibição na biblioteca para ler todas as suas reviews como se estivesse no feed da comunidade Steam.
   - Renderização completa de BBCode (títulos, citações, spoilers, notas de estrelas, etc.).

4. **Seletor de Veredito & Recomendação**:
   - Botões visuais no editor para definir se você **👍 Recomenda** ou **👎 Não Recomenda** o jogo.
   - Atualização em tempo real do card oficial da Steam com ícone positivo (verde/azul) ou negativo (vermelho).
   - Badges coloridas nos cards da biblioteca de reviews.

5. **Biblioteca "Minhas Reviews" com Busca e Filtros**:
   - Catálogo visual de todas as suas análises salvas (modos Cards e Blog Steam).
   - **Estatísticas rápidas**: Total de análises, recomendadas 👍, não recomendadas 👎 e total de palavras escritas.
   - **Busca em tempo real**: Filtre por nome do jogo ou palavras contidas no texto da análise e nas anotações.
   - **Filtros rápidos**: *Todos*, *👍 Recomendados*, *👎 Não Recomendados* e *📝 Com Anotações*.
   - **Ordenação múltipla**:
     - 🕒 Mais recentes (última edição) / Mais antigas
     - 🔤 Nome do jogo (A - Z) / (Z - A)
     - 📝 Mais longas / Mais curtas (quantidade de caracteres)
     - 👍 Recomendados primeiro / 👎 Não Recomendados primeiro
   - **Ações rápidas**: Abrir no Editor, Copiar BBCode, Baixar .txt, Duplicar e Excluir.

6. **Sistema de Backup & Restauração Completa (JSON)**:
   - **Exportar Backup**: Gera e baixa um arquivo `.json` com todas as reviews, anotações de rascunho de cada jogo e moldes personalizados.
   - **Importar Backup Validado**: Lê arquivos `.json` de backup, realiza validação estrutural e oferece as opções de **Restaurar (Substituir Tudo)** ou **Mesclar Dados**.
   - **Limpar Tudo & Reset de Fábrica**: Permite limpar todos os dados locais com avisos prévios de segurança recomendando o backup antes da redefinição.

7. **Bloco de Notas Exclusivo por Jogo (Scratchpad)**:
   - Anotações persistentes salvas individualmente para cada jogo.
   - Não são publicadas na Steam e não consomem o limite de caracteres.
   - Suporte a **Desprender Janela (`↗️`)** flutuante independente sincronizada em tempo real.

8. **Barra de Ferramentas com BBCode Steam Nativo**:
   - Negrito (`[b]`), Itálico (`[i]`), Sublinhado (`[u]`), Tachado (`[s]`).
   - Títulos e Cabeçalhos (`[h1]`, `[h2]`, `[h3]`).
   - Cores personalizadas (`[color=#HEX]`) com paleta rápida e seletor hexadecimal.
   - Links formatados (`[url=https://...]texto[/url]`).
   - Citações (`[quote]`) e Spoilers ocultos interativos (`[spoiler]`).
   - Listas demarcadas (`[list]`), numeradas (`[olist]`), linhas divisórias (`[hr]`) e blocos de código (`[code]`).

9. **Sistema de Avaliação por Estrelas (BBCode)**:
   - Escalas de **1 a 5** ou **1 a 10** estrelas com múltiplos estilos de formatação (`★★★★☆ 4/5`, `[████████░░] 8/10`, etc.).

8. **Contador e Limitador Rígido de Caracteres (8.000)**:
   - Contagem precisa em tempo real de caracteres, palavras e linhas com barra de progresso e alertas visuais.

9. **Gerenciador de Moldes / Templates**:
   - Moldes padrão pré-carregados e criação/gerenciamento de moldes personalizados.

10. **Visualização Steam Live & Exportação**:
    - Pré-visualização idêntica aos cards de análise da Steam.
    - Botão em destaque **"Copiar Texto Formatado"** e botão para download em `.txt`.

---

## 🚀 Como Executar

Por ser uma aplicação web pura (HTML5, CSS3 e JavaScript Vanilla), não requer nenhuma instalação ou servidor:

1. Dê um duplo clique no arquivo `index.html` em qualquer navegador web moderno (Chrome, Edge, Firefox, Opera, Brave, etc.).
2. Ou abra via Live Server no VS Code.

---

## ⌨️ Atalhos de Teclado Suportados

| Atalho | Ação |
| :--- | :--- |
| `Ctrl + B` | Inserir / Envolver em **Negrito** |
| `Ctrl + I` | Inserir / Envolver em *Itálico* |
| `Ctrl + U` | Inserir / Envolver em <u>Sublinhado</u> |
| `Ctrl + K` | Abrir modal de Link |
| `Ctrl + Shift + S` | Inserir / Envolver em Spoiler |
| `Tab` | Inserir indentação de 2 espaços |
