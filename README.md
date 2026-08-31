# 🎮 Gerador & Editor de Reviews da Steam

> **Criado por Rafael Lannes**

Uma aplicação web moderna, rápida e responsiva criada para facilitar a criação, formatação e publicação de análises (reviews) de jogos na **Steam**.

---

## ✨ Funcionalidades Principais

1. **Barra de Ferramentas com BBCode Steam Nativo**:
   - **Formatação de Texto**: Negrito (`[b]`), Itálico (`[i]`), Sublinhado (`[u]`), Tachado (`[s]`).
   - **Títulos e Cabeçalhos**: `[h1]`, `[h2]`, `[h3]`.
   - **Cores Personalizadas**: Seletor de cores da Steam (`[color=#HEX]`) com paleta rápida e seletor customizado.
   - **Links Formatados**: Inserção rápida com modal intuitivo (`[url=https://...]texto[/url]`).
   - **Citações e Spoilers**: `[quote]` e `[spoiler]` (com efeito de revelação ao passar o mouse ou clicar).
   - **Listas & Linhas Divisórias**: `[list]`, `[olist]`, `[hr]`, `[code]`.

2. **Sistema Visual de Avaliação por Estrelas (BBCode)**:
   - Escolha entre escalas de **1 a 5** ou **1 a 10** estrelas.
   - Seleção rápida de critérios (Nota Final, Gráficos, Jogabilidade, História, Trilha Sonora, Otimização, Custo-Benefício, Dificuldade).
   - Formatos configuráveis: `[b]Gráficos:[/b] ★★★★☆ (4/5)`, `[████████░░] 8/10`, etc.
   - Inserção com um clique na posição do cursor.

3. **Contador e Limitador Rígido de Caracteres (8.000)**:
   - Contagem precisa em tempo real de caracteres, palavras e linhas.
   - Barra de progresso com alertas visuais:
     - 🔵 Azul Steam: < 7.500 caracteres
     - 🟡 Âmbar/Amarelo: 7.500 a 7.999 caracteres (Aviso de proximidade)
     - 🔴 Vermelho: 8.000 caracteres (Limite máximo rígido da Steam atingido)
   - Impede digitação e colagem que excedam 8.000 caracteres.

4. **Gerenciador de Templates (Moldes de Review)**:
   - **Moldes Padrão Inclusos**:
     - *Padrão (Estrutura Completa)*
     - *Checklist Gamer Clássico*
     - *Review Express (Rápida & Direta)*
     - *Análise Técnica & Performance*
   - **Moldes Personalizados**:
     - Crie e salve seus próprios moldes com armazenamento no `localStorage`.
     - Exporte e importe seus moldes em formato JSON para backup.

5. **Visualização Steam Live & Exportação**:
   - Pré-visualização em tempo real estilizada exatamente como os cards de análise da Steam.
   - Alternância entre **Visualização Steam** e **Código BBCode Puro**.
   - Botão em destaque **"Copiar Texto Formatado"** para enviar direto para a área de transferência.
   - Botão para download direto em formato `.txt`.

---

## 🚀 Como Executar

Por ser uma aplicação web pura (HTML5, CSS3 e JavaScript Vanilla), não requer nenhuma instalação ou servidor Node.js:

1. Dê um duplo clique no arquivo `index.html` em qualquer navegador web moderno (Chrome, Edge, Firefox, Opera, Brave, etc.).
2. Ou abra pelo terminal / VS Code Live Server.

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
