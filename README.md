# 🌳 Arborix: A Biblioteca de Tree View Ultra Otimizada para React

**Arborix** é um componente de Tree View altamente performático e configurável, construído em React e TypeScript. Ele utiliza **virtualização** para lidar com milhões de nós, oferecendo recursos essenciais como Drag & Drop, busca fuzzy, edição inline, e um robusto gerenciamento de estado com histórico (Undo/Redo), tudo pronto para produção.

## ✨ Features

* **🚀 Alta Performance:** Renderização otimizada com  **virtualização de linhas** (via `@tanstack/react-virtual`).
* **📦 Gerenciamento de Estado Simplificado:** Usa **Immer** e **Redux-like** para estado previsível e **histórico de ações (Undo/Redo)**.
* **🖱️ Drag & Drop Intuitivo:** Implementado com `@dnd-kit`, com lógica de prevenção de ciclos e indicadores de posição (`before`, `after`, `inside`).
* **🔍 Busca e Destaque:** Busca **fuzzy** (via `useTreeSearch`) com navegação entre resultados e destaque de texto (`HighlightText.tsx`).
* **✍️ Edição Inline:** Permite a edição direta dos rótulos dos nós.
* **🔌 Sistema de Plugins:** Arquitetura extensível via `PluginManager` para adicionar funcionalidades personalizadas.
* **✅ Checkboxes Tri-State:** Suporte completo para caixas de seleção com estados checado/não checado/indeterminado.

## 📦 Instalação

```bash
# Com npm
npm install @wesleyxmns/arborix

# Com yarn
yarn add @wesleyxmns/arborix

---

### 4. Uso Básico

* **Finalidade:** O exemplo de código mais rápido para começar.
* **Sugestão:**

```markdown
## 🚀 Uso Rápido

O Arborix aceita um array de objetos `TreeNode` como `data`.

### 1. Definição dos Dados (TreeNode)

```typescript
// Exemplo de dados (TreeData)
const initialData = [
  { id: 1, label: 'Docs', children: [
    { id: 1.1, label: 'Introduction' },
    { id: 1.2, label: 'Installation' },
  ]},
  { id: 2, label: 'Source', children: [
    { id: 2.1, label: 'arborix.tsx' },
    { id: 2.2, label: 'types.ts' },
  ]},
];

import React from 'react';
import { Arborix, TreeData } from '@wesleyxmns/arborix';

const MyTreeComponent = () => {
  const [data, setData] = React.useState<TreeData>(initialData);

  // onDataChange é crucial para o histórico/D&D persistir
  const handleDataChange = (newData: TreeData) => {
    setData(newData);
    // Aqui você pode fazer chamadas de API ou salvar o estado.
  };

  return (
    <div style={{ height: 500, width: 300 }}>
      <Arborix 
        data={data}
        onDataChange={handleDataChange} 
        enableDragDrop={true}
        showCheckboxes={true}
      />
    </div>
  );
};

export default MyTreeComponent;

---

### 5. API de Propriedades (Props)

* **Finalidade:** Documentar as opções de configuração do componente `Arborix`.
* **Sugestão:**

```markdown
## ⚙️ Propriedades (Props) do Arborix

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| **`data`** | `TreeData` | `[]` | O array de nós no formato aninhado. **Obrigatório.** |
| **`onDataChange`** | `(data: TreeData) => void` | `undefined` | Callback chamado após qualquer mutação de dados (D&D, edição). |
| `height` | `number` | `600` | Altura do container da Tree View em pixels. Necessário para a virtualização. |
| `rowHeight` | `number` | `32` | Altura de cada linha em pixels. |
| `showCheckboxes` | `boolean` | `false` | Habilita os checkboxes tri-state. |
| `enableDragDrop` | `boolean` | `true` | Habilita a funcionalidade de arrastar e soltar. |
| `enableSearch` | `boolean` | `true` | Mostra a barra de busca (que usa `useTreeSearch`). |
| `enableInlineEdit` | `boolean` | `true` | Permite renomear nós clicando duas vezes ou via menu de contexto. |
| `enableContextMenu` | `boolean` | `true` | Habilita o menu de contexto (clique direito). |
| `persistenceKey` | `string` | `undefined` | Chave para persistir o estado de `openIds` e `selectedIds` no `localStorage`. |
| `plugins` | `TreePlugin[]` | `[]` | Array de plugins customizados. |
| `renderNode` | `(node: TreeNode) => React.ReactNode` | `undefined` | Função opcional para renderizar o conteúdo interno do nó customizado. |

## 🏗️ Utilitários e Builder

Arborix expõe algumas ferramentas úteis para manipulação de dados.

### `TreeDataBuilder.fromFlat`

Se seus dados estiverem em formato **plano** (com `parentId`), você pode convertê-los facilmente:

```typescript
import { TreeDataBuilder } from '@wesleyxmns/arborix';

const flatData = [
  { id: '1', name: 'Root 1', parentId: null },
  { id: '2', name: 'Child of 1', parentId: '1' },
];

const treeData = TreeDataBuilder.fromFlat(flatData, {
  label: 'name', // Mapeia o campo 'name' para 'label' do TreeNode
  parentIdKey: 'parentId'
});
// treeData agora é um array aninhado de TreeNode

import { useTreeState } from '@wesleyxmns/arborix';

const { state, toggleOpen, undo, redo } = useTreeState(initialData);

// ... state.data tem os dados, state.openIds tem os nós abertos.

---

### 7. Licença

* **Finalidade:** Informar o licenciamento do código.
* **Sugestão:**

```markdown
## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais informações.