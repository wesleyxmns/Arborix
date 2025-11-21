---
description: Instruções de workflows - Comandos de ativação
---

# Instruções de Workflows

Este documento contém as instruções sobre quando e como executar os workflows automatizados.

## 🚀 Comando: "github"

Quando o usuário digitar **"github"** no chat, executar o workflow completo do GitHub:

1. **Criar uma branch nova** denominada de acordo com as alterações que foram feitas no projeto
   - Formato sugerido: `feature/[descrição-breve]-$(date +%Y%m%d-%H%M%S)`
   - Exemplo: `feature/drag-drop-improvements-20251121-113000`

2. **Committar todas as alterações** nessa branch com comentários bem detalhados de acordo com o commit
   - Usar formato de commit convencional (feat:, fix:, chore:, etc.)
   - Incluir descrição detalhada das mudanças
   - Listar arquivos modificados

3. **Abrir um pull request** para a branch base (main) com comentários bem detalhados sobre as mudanças e o que foi implementado
   - Título descritivo
   - Corpo do PR com:
     - Objetivo
     - Mudanças implementadas
     - Arquivos modificados
     - Link para issues relacionadas (se houver)

4. **Realizar o merge na main** das mudanças feitas na branch criada
   - Usar `gh pr merge` com estratégia apropriada (squash recomendado)
   - Deletar a branch após merge

5. **Criar e atualizar a release do GitHub** de acordo com o que foi implementado
   - Atualizar versão usando `pnpm version patch` (ou minor/major conforme necessário)
   - Criar tag e fazer push
   - Criar release no GitHub com notas detalhadas
   - Marcar como "Latest" release

## 📦 Comando: "npm publish"

Quando o usuário digitar **"npm publish"** no chat, executar o workflow de publicação no NPM:

1. **Atualizar a versão do pacote** usando `pnpm version patch`
   - Isso atualiza o package.json automaticamente
   - Cria um commit com a nova versão

2. **Publicar a nova versão** usando `pnpm publish`
   - O script `prepublishOnly` garante que o build seja executado automaticamente
   - Publica no NPM registry

## 📝 Notas

- Os workflows estão configurados em `.agent/workflows/`
- Use `gh` (GitHub CLI) para operações do GitHub
- Use `pnpm` para gerenciamento de versões e publicação
- Sempre verifique o status antes de executar os workflows
- As mensagens de commit e PR devem ser detalhadas e descritivas

