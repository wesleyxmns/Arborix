<div align="center">
  <img src="./public/assets/ARBORIX_LOGO.png" alt="Arborix Logo" width="350" />
  <br />
  <br />

  [![npm version](https://img.shields.io/npm/v/arborix?style=flat-square&color=2563eb)](https://www.npmjs.com/package/arborix)
  [![license](https://img.shields.io/npm/l/arborix?style=flat-square&color=2563eb)](https://github.com/wesleyxmns/arborix/blob/main/LICENSE)
  [![downloads](https://img.shields.io/npm/dt/arborix?style=flat-square&color=2563eb)](https://www.npmjs.com/package/arborix)

  <p align="center">
    <b>The Ultimate React Tree View Component.</b>
    <br />
    High-performance, virtualized, and fully customizable with native Drag & Drop.
    <br />
    <br />
    <a href="https://github.com/wesleyxmns/arborix/issues">Report Bug</a>
    ·
    <a href="https://github.com/wesleyxmns/arborix/issues">Request Feature</a>
  </p>
</div>

<br />

## ⚡ Why Arborix?

Handling large hierarchical datasets in React can be sluggish. **Arborix** solves this with **virtualization**, rendering only what's visible. Whether you have 100 or 1,000,000 nodes, Arborix stays buttery smooth.

Built with modern tools like **@tanstack/react-virtual**, **@dnd-kit**, and **Framer Motion**, it provides a premium, native-like experience out of the box.

---

## ✨ Features

### 🚀 Core Performance
- **Virtualization**: Efficiently renders huge datasets without UI lag.
- **Lazy Loading**: Asynchronously load children nodes on demand.
- **State Persistence**: Automatically saves expansion, selection, and check states to `localStorage`.

### 🖱️ Advanced Interaction
- **Drag & Drop**: 
  - **Precise Reordering**: Drop items **before**, **after**, or **inside** other nodes.
  - **Visual Feedback**: Clear indicators show exactly where the item will land.
  - **Auto-Scroll**: Drags automatically scroll the container when reaching edges.
- **Multi-Selection**: 
  - `Click` to select.
  - `Ctrl/Cmd + Click` to toggle multiple nodes.
  - `Shift + Click` to select a range of nodes.
  - `Ctrl + A` to select all visible nodes.
- **Context Menu**: 
  - Built-in right-click menu with actions like **Rename**, **Duplicate**, **Cut/Copy/Paste**, **Delete**, and **Add Child/Sibling**.
  - Fully customizable via props.

### 🛠️ Powerful Utilities
- **Inline Editing**: Rename nodes directly in the tree (Double-click or `F2`).
- **Search**: 
  - **Fuzzy Search**: Finds nodes even with partial matches.
  - **Highlighting**: Matches are highlighted in the tree.
  - **Navigation**: Jump between search results with `Enter`.
- **Clipboard Operations**: 
  - **Cross-Tree Support**: Copy from one tree and paste into another (if data structure matches).
  - **Batch Operations**: Cut/Copy/Paste multiple nodes at once.
  - **Visual Cues**: Cut items appear dimmed until pasted.
- **Tri-State Checkboxes**: 
  - **Propagation**: Checking a parent checks all children.
  - **Indeterminate State**: Parents show a dash if only some children are checked.

---

## 📦 Installation

```bash
npm install arborix
# or
pnpm add arborix
# or
yarn add arborix
```

> **Note**: Arborix requires `react` and `react-dom` >= 18.

---

## 🚀 Quick Start

Here is a minimal example to get you started:

```tsx
import React, { useState } from 'react';
import { Arborix, TreeData } from 'arborix';
import 'arborix/dist/index.css'; // Don't forget the styles!

const initialData: TreeData = [
  {
    id: "1",
    label: "Project Alpha",
    children: [
      { id: "1-1", label: "Documentation" },
      { id: "1-2", label: "Source Code" },
    ]
  },
  {
    id: "2",
    label: "Project Beta",
    children: []
  }
];

export default function App() {
  const [data, setData] = useState(initialData);

  return (
    <div className="h-[600px] w-full border rounded-lg shadow-sm">
      <Arborix
        data={data}
        onDataChange={setData}
        height={600}
        enableDragDrop
        enableSearch
        showCheckboxes
      />
    </div>
  );
}
```

---

## 📖 API Reference

### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TreeData` | `[]` | **Required**. The tree structure. |
| `onDataChange` | `(data: TreeData) => void` | - | **Required**. Callback when data changes (drag, edit, delete). |
| `height` | `number` | `600` | Height of the container (needed for virtualization). |
| `rowHeight` | `number` | `32` | Height of each node row in pixels. |
| `enableDragDrop` | `boolean` | `true` | Enables drag and drop reordering. |
| `showCheckboxes` | `boolean` | `false` | Shows tri-state checkboxes. |
| `enableSearch` | `boolean` | `true` | Shows the search bar. |
| `enableInlineEdit` | `boolean` | `true` | Allows renaming via double-click. |
| `enableContextMenu`| `boolean` | `true` | Enables the right-click context menu. |
| `persistenceKey` | `string` | - | Unique key to persist state in `localStorage`. |

### Customization

| Prop | Type | Description |
|------|------|-------------|
| `renderNode` | `(node: TreeNode) => ReactNode` | Custom render function for node content. |
| `onLoadData` | `(node: TreeNode) => Promise<TreeNode[]>` | Callback for lazy loading children. |
| `contextMenuOptions` | `object` | Toggle specific menu items (rename, delete, etc.). |
| `customContextMenuItems` | `function` | Add your own actions to the context menu. |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate focus between nodes |
| `→` | Expand node / Move to child |
| `←` | Collapse node / Move to parent |
| `Enter` | Select node |
| `Space` | Toggle checkbox / Select |
| `F2` | Rename focused node |
| `Ctrl` + `A` | Select all |
| `Ctrl` + `C` / `X` / `V` | Copy / Cut / Paste |
| `Delete` | Delete selected nodes |
| `Ctrl` + `Z` / `Y` | Undo / Redo |

---

## 🏗️ Data Helpers

Working with flat data from a database? Use our builder:

```typescript
import { TreeDataBuilder } from 'arborix';

const flat = [
  { id: 1, title: 'Root', parent_id: null },
  { id: 2, title: 'Child', parent_id: 1 }
];

const tree = TreeDataBuilder.fromFlat(flat, {
  label: 'title',
  parentIdKey: 'parent_id'
});
```

---

## 🤝 Contributing

We love contributions!
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <p>Distributed under the MIT License.</p>
  <p>Built with ❤️ by <a href="https://github.com/wesleyxmns">Wesley Ximenes</a></p>
</div>
