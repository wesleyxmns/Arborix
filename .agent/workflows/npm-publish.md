---
description: Publish package to NPM registry
---

# NPM Publish Workflow

Este workflow atualiza a versão e publica o pacote no NPM.

## Passos

// turbo-all

1. **Atualizar versão do pacote**
```bash
pnpm version patch
```
Nota: Use `pnpm version minor` para mudanças menores significativas ou `pnpm version major` para mudanças maiores.

2. **Publicar no NPM**
```bash
pnpm publish
```
Nota: O script `prepublishOnly` no package.json garante que o build seja executado antes da publicação.

3. **Verificar publicação**
Verifique que o pacote foi publicado com sucesso em https://www.npmjs.com/package/arborix
