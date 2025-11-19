<div align="center">
  <img src="./public/assets/ARBORIX_LOGO.png" alt="Arborix Logo" width="200" />
  <h1 align="center">Arborix</h1>
  <p align="center">
    Componente React para Exibição de Dados em Árvore (Tree View) de Alto Desempenho.
    <br />
    <a href="https://github.com/wesleyxmns/arborix/issues">Report Bug</a>
    ·
    <a href="https://github.com/wesleyxmns/arborix/issues">Request Feature</a>
  </p>
</div>

## Sobre o Projeto

**Arborix** é um componente de Tree View altamente performático e configurável, construído em React e TypeScript. Ele utiliza **virtualização** para lidar com milhões de nós, oferecendo recursos essenciais como Drag & Drop, busca fuzzy, edição inline, e um robusto gerenciamento de estado com histórico (Undo/Redo), tudo pronto para produção.

## ✨ Funcionalidades

*   **🚀 Alta Performance:** Renderização otimizada com **virtualização de linhas** (via `@tanstack/react-virtual`), garantindo que apenas os nós visíveis sejam montados.
*   **🖱️ Drag & Drop Intuitivo:** Implementado com `@dnd-kit`, permite reordenar nós com indicadores visuais (`before`, `after`, `inside`) e lógica que previne a criação de ciclos (mover um pai para dentro de um filho).
*   **🔍 Busca e Destaque:** Um campo de busca integrado com navegação entre os resultados e destaque de texto (`HighlightText.tsx`).
*   **✍️ Edição Inline:** Renomeie nós diretamente na árvore com um duplo clique ou através do menu de contexto.
*   **✅ Checkboxes com Estado Triplo:** Suporte para checkboxes com estados `checked`, `unchecked`, e `indeterminate`, com propagação de estado para pais e filhos.
*   **🔌 Sistema de Plugins:** Arquitetura extensível que permite adicionar funcionalidades customizadas sem alterar o núcleo da biblioteca.
*   **💾 Persistência de Estado:** Salva o estado dos nós abertos/fechados e selecionados no `localStorage` para manter a UX entre sessões.
*   **🔄 Histórico (Undo/Redo):** Gerenciamento de estado imutável (com Immer) que oferece a capacidade de desfazer e refazer ações.

## 📦 Instalação

```bash
# Com npm
npm install @wesleyxmns/arborix

# Com yarn
yarn add @wesleyxmns/arborix
```

## 🚀 Uso Rápido

Para começar, importe o componente `Arborix` e forneça a ele seus dados.

```jsx
import React from 'react';
import { Arborix, TreeData } from '@wesleyxmns/arborix';

// 1. Defina seus dados
const initialData: TreeData = [
  { id: "1", label: 'Documentos', children: [
    { id: "1.1", label: 'Relatórios' },
    { id: "1.2", label: 'Contratos' },
  ]},
  { id: "2", label: 'Imagens', children: [
    { id: "2.1", label: 'logo.png' },
    { id: "2.2", label: 'avatar.jpg' },
  ]},
];

const App = () => {
  const [data, setData] = React.useState(initialData);

  return (
    <div style={{ height: 500, width: 350, border: '1px solid #ddd' }}>
      <Arborix
        data={data}
        onDataChange={setData} // Essencial para D&D e edição
        height={500}
        rowHeight={32}
        showCheckboxes={true}
        enableDragDrop={true}
        enableSearch={true}
      />
    </div>
  );
};

export default App;
```

## ⚙️ Propriedades (Props)

| Propriedade        | Tipo                                | Padrão      | Descrição                                                                                               |
| ------------------ | ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| **`data`**         | `TreeData`                          | `[]`        | **Obrigatório.** O array de nós no formato aninhado.                                                    |
| **`onDataChange`** | `(data: TreeData) => void`          | `undefined` | **Obrigatório** para persistir mudanças de D&D, edição ou outras mutações.                                |
| `height`           | `number`                            | `600`       | Altura do container da árvore. Essencial para a virtualização.                                          |
| `rowHeight`        | `number`                            | `32`        | Altura de cada linha em pixels.                                                                         |
| `showCheckboxes`   | `boolean`                           | `false`     | Habilita os checkboxes com estado triplo.                                                               |
| `enableDragDrop`   | `boolean`                           | `true`      | Habilita a funcionalidade de arrastar e soltar.                                                         |
| `enableSearch`     | `boolean`                           | `true`      | Mostra a barra de busca.                                                                                |
| `enableInlineEdit` | `boolean`                           | `true`      | Permite renomear nós com duplo clique ou via menu de contexto.                                          |
| `enableContextMenu`| `boolean`                           | `true`      | Habilita o menu de contexto (clique direito) com ações padrão.                                          |
| `persistenceKey`   | `string`                            | `undefined` | Chave para persistir o estado de `openIds` e `selectedIds` no `localStorage`.                           |
| `plugins`          | `TreePlugin[]`                      | `[]`        | Array de plugins customizados para estender a funcionalidade.                                           |
| `renderNode`       | `(node: TreeNode) => React.ReactNode`| `undefined` | Função customizada para renderizar o conteúdo do nó, permitindo total personalização.                    |


## 🏗️ Utilitários e Builder

Seus dados estão em formato plano (`flat`)? Use o `TreeDataBuilder` para convertê-los.

```typescript
import { TreeDataBuilder } from '@wesleyxmns/arborix';

const flatData = [
  { id: '1', name: 'Root 1', parent: null },
  { id: '2', name: 'Child of 1', parent: '1' },
];

const treeData = TreeDataBuilder.fromFlat(flatData, {
  label: 'name', // Mapeia o campo 'name' para 'label'
  parentIdKey: 'parent' // Especifica qual campo é a referência ao pai
});
```

## 📜 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.
