---
description: Workflow completo de GitHub - criar branch, commit, PR, release e merge
---

# GitHub Workflow Completo

Este workflow automatiza todo o processo de publicação de mudanças no GitHub.

## Passos

// turbo-all

1. **Verificar status do git**
```bash
git status
```

2. **Criar nova branch com timestamp**
```bash
git checkout -b feature/improvements-$(date +%Y%m%d-%H%M%S)
```

3. **Adicionar todas as mudanças**
```bash
git add .
```

4. **Criar commit detalhado**
```bash
git commit -m "feat: Melhorias no sistema de Drag and Drop do Arborix

- Corrigida lógica de reordenação no mesmo nível (siblings)
- Implementado feedback visual aprimorado para drag and drop
- Adicionados indicadores animados para posições before/after/inside
- Criado arquivo arborix.css com classes Tailwind-like
- Ajustado threshold dinâmico baseado em contexto do nó
- Melhorado DragOverlay com visual premium
- Otimizada detecção de posição de drop

Componentes modificados:
- src/arborix/arborix.tsx
- src/arborix/components/NodeRenderer/NodeRenderer.tsx
- src/arborix/arborix.css (novo)
- src/arborix/root.ts
- vite.config.ts"
```

5. **Push da branch para o repositório remoto**
```bash
git push -u origin HEAD
```

6. **Criar Pull Request usando GitHub CLI**
```bash
gh pr create --title "feat: Melhorias no Sistema de Drag and Drop" --body "## 🎯 Objetivo

Aprimorar o sistema de drag and drop do componente Arborix, corrigindo a lógica de reordenação no mesmo nível e implementando feedback visual rico e animado.

## ✨ Mudanças Implementadas

### 1. Correção da Lógica de Reordenação
- ✅ Corrigida detecção de posição de drop (before/after/inside)
- ✅ Implementada reordenação no mesmo nível sem criar hierarquia indesejada
- ✅ Ajuste dinâmico de thresholds baseado em contexto:
  - Irmãos: 35% before, 35% after, 30% inside
  - Nós com filhos abertos: 35% before, 35% after, 30% inside
  - Nós com filhos fechados: 30% before, 30% after, 40% inside
  - Nós folha: 50% before, 50% after, sem inside

### 2. Feedback Visual Aprimorado
- ✅ Linhas azuis animadas com círculos indicadores para before/after
- ✅ Highlight diferenciado com ring e shadow-inner para inside
- ✅ Barra vertical de profundidade para drop inside
- ✅ Animações suaves (150ms) em todas as transições
- ✅ DragOverlay premium com ícone de grip e sombra pronunciada

### 3. Configuração de Estilos
- ✅ Criado arquivo \`arborix.css\` com classes Tailwind-like
- ✅ Componente não depende mais de Tailwind CSS instalado
- ✅ Todos os estilos necessários incluídos no pacote

## 📁 Arquivos Modificados

- \`src/arborix/arborix.tsx\` - Lógica de detecção de posição e DragOverlay
- \`src/arborix/components/NodeRenderer/NodeRenderer.tsx\` - Indicadores visuais
- \`src/arborix/arborix.css\` - Novo arquivo com estilos
- \`src/arborix/root.ts\` - Importação do CSS
- \`vite.config.ts\` - Configuração para modo demo

## 🧪 Testes Realizados

- ✅ Reordenação de irmãos no mesmo nível
- ✅ Movimentação entre diferentes níveis
- ✅ Movimentação para a raiz
- ✅ Feedback visual em todas as operações
- ✅ Performance com árvores grandes

## 📊 Comparação

**Antes:**
- ❌ Impossível reordenar irmãos sem criar hierarquia
- ❌ Feedback visual mínimo
- ❌ Threshold fixo

**Depois:**
- ✅ Reordenação natural de irmãos
- ✅ Feedback visual rico com animações
- ✅ Threshold inteligente baseado em contexto"
```

7. **Obter número do PR recém-criado**
```bash
PR_NUMBER=$(gh pr list --head $(git branch --show-current) --json number --jq '.[0].number')
echo "PR Number: $PR_NUMBER"
```

8. **Fazer merge do PR na main**
```bash
gh pr merge $PR_NUMBER --squash --delete-branch
```

9. **Voltar para a branch main e atualizar**
```bash
git checkout main
git pull origin main
```

10. **Criar nova versão (patch)**
```bash
pnpm version patch
```
Nota: Isso atualiza o package.json, cria um commit e uma tag local automaticamente.

11. **Obter a nova versão**
```bash
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"
```

12. **Fazer push do commit e da tag**
```bash
git push origin main
git push origin v$NEW_VERSION
```

13. **Criar ou atualizar release no GitHub**
```bash
gh release create "v$NEW_VERSION" --title "v$NEW_VERSION - [Título baseado nas mudanças]" --notes "## 🎯 Objetivo

[Descrição detalhada das mudanças implementadas]

## ✨ Mudanças Implementadas

[Detalhes das mudanças]

## 📁 Arquivos Modificados

[Lista de arquivos modificados]

Veja o [Pull Request #$PR_NUMBER](https://github.com/wesleyxmns/Arborix/pull/$PR_NUMBER) para mais detalhes." --latest
```

14. **Mostrar status final**
```bash
echo "✅ Processo concluído com sucesso!"
echo "📦 Versão: v$NEW_VERSION"
echo "🔗 Release: https://github.com/wesleyxmns/Arborix/releases/tag/v$NEW_VERSION"
git log -1 --oneline
```
