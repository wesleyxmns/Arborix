<div align="center">
  <img src="./public/assets/ARBORIX_LOGO.png" alt="Arborix Logo" width="350" />
  <br />
  <br />

  [![npm version](https://img.shields.io/npm/v/arborix?style=flat-square&color=2563eb)](https://www.npmjs.com/package/arborix)
  [![license](https://img.shields.io/npm/l/arborix?style=flat-square&color=2563eb)](https://github.com/wesleyxmns/arborix/blob/main/LICENSE)
  [![downloads](https://img.shields.io/npm/dt/arborix?style=flat-square&color=2563eb)](https://www.npmjs.com/package/arborix)

  <p align="center">
    <b>Modern, Headless Tree Component for React</b>
    <br />
    Full TypeScript support, virtualization, drag & drop, and complete customization.
    <br />
    <br />
    <a href="https://wesleyxmns.github.io/Arborix/">Documentation</a>
    ·
    <a href="https://github.com/wesleyxmns/arborix/issues">Report Bug</a>
    ·
    <a href="https://github.com/wesleyxmns/arborix/issues">Request Feature</a>
  </p>
</div>

<br />

## ✨ Features

- 🎯 **Headless Architecture** - Complete control over styling and rendering
- 🎨 **Fully Customizable** - Bring your own styles and components
- ⌨️ **Keyboard Navigation** - Full keyboard support with shortcuts
- 🖱️ **Drag and Drop** - Built-in drag and drop with `@dnd-kit`
- ✅ **Checkboxes** - Multi-select with indeterminate states
- 🔍 **Search** - Built-in search and filtering
- 📝 **Inline Editing** - Edit node labels inline
- ⚡ **Virtualization** - Handle large trees with `@tanstack/react-virtual`
- 🎭 **Custom Action Buttons** - Add custom buttons to nodes
- 📋 **Context Menus** - Flexible context menu system
- ↩️ **Undo/Redo** - Full history management
- 🔄 **TypeScript** - Complete type safety

## 🆕 What's New in v2.1

Version 2.1 introduces major usability improvements while maintaining 100% backward compatibility:

- **🎯 Tree.Auto Component** - Automatic tree rendering without manual recursion (90% less code!)
- **⚡ SimpleTree Preset** - Zero-configuration tree component for quick setups
- **🔗 ItemContext** - No more repeated `nodeId` props in child components
- **🧰 TreeRecipes** - 18+ utility functions for common tree operations (filter, sort, search, etc.)
- **🎣 useTreeHelpers Hook** - 30+ convenience methods for common tasks
- **📋 Enhanced Tree.List** - Now provides `visibleNodes` for easier rendering

**Migration Guide:** See [MIGRATION_TO_V2.1.md](./MIGRATION_TO_V2.1.md) for detailed upgrade guide (optional, no breaking changes).

**Full Changelog:** See [CHANGELOG_V2.1.md](./CHANGELOG_V2.1.md) for complete list of improvements.

## 📦 Installation

```bash
npm install arborix
# or
pnpm add arborix
# or
yarn add arborix
```

## 🚀 Quick Start

### ⚡ Easiest Way (v2.1+) - Zero Configuration

```tsx
import { SimpleTree } from 'arborix';
import { useState } from 'react';

function App() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'src',
      children: [
        { id: '1-1', label: 'components' },
        { id: '1-2', label: 'hooks' },
      ],
    },
    { id: '2', label: 'package.json' },
  ]);

  return (
    <SimpleTree
      data={data}
      onDataChange={setData}
      showCheckboxes
      editable
      showIcons
    />
  );
}
```

### 🎯 Automatic Rendering (v2.1+) - No Recursion Needed

```tsx
import { Tree } from 'arborix';

function App() {
  const [data, setData] = useState(myTreeData);

  return (
    <Tree.Root data={data} onDataChange={setData}>
      <Tree.Auto showCheckbox editable showIcon />
    </Tree.Root>
  );
}
```

### 🔧 Full Control - Traditional Approach

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function App() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'src',
      children: [
        { id: '1-1', label: 'components' },
        { id: '1-2', label: 'hooks' },
      ],
    },
    { id: '2', label: 'package.json' },
  ]);

  return (
    <Tree.Root data={data} onDataChange={setData}>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map((nodeId) => (
            <Tree.Item key={nodeId} nodeId={nodeId}>
              <Tree.Trigger />  {/* No need to pass nodeId! */}
              <Tree.Label editable />
            </Tree.Item>
          ))
        }
      </Tree.List>
    </Tree.Root>
  );
}
```

## 📚 Core Concepts

### Headless Architecture

Arborix is completely headless - it provides the logic and state management while you control the rendering. This gives you complete freedom over styling and behavior.

### Component Structure

```tsx
<Tree.Root>           {/* Root container with state */}
  <Tree.List>         {/* Virtualized list wrapper */}
    <Tree.Item>       {/* Individual tree node */}
      <Tree.Trigger>  {/* Expand/collapse button */}
      <Tree.Checkbox> {/* Checkbox for selection */}
      <Tree.Label>    {/* Node label with editing */}
      <Tree.Content>  {/* Custom node content */}
    </Tree.Item>
  </Tree.List>
</Tree.Root>
```

## 🎯 API Reference

### SimpleTree (v2.1+)

Zero-configuration preset component for quick setups.

```tsx
interface SimpleTreeProps {
  data: TreeData;
  onDataChange?: (data: TreeData) => void;
  showCheckboxes?: boolean;
  editable?: boolean;
  showIcons?: boolean;
  enableDragDrop?: boolean;
  enableVirtualization?: boolean;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}
```

### Tree.Auto (v2.1+)

Automatic tree rendering component - no manual recursion needed.

```tsx
interface AutoProps {
  showCheckbox?: boolean;
  showTrigger?: boolean;
  editable?: boolean;
  showIcon?: boolean;
  showGrip?: boolean;
  renderItem?: (nodeId: TreeNodeId, state: ItemState) => ReactNode;
  className?: string;
  style?: React.CSSProperties;
  listClassName?: string;
  listStyle?: React.CSSProperties;
}
```

### Tree.Root

Main container component that manages tree state.

```tsx
interface TreeRootProps {
  // Data
  data: TreeData;
  onDataChange?: (data: TreeData) => void;

  // Features
  enableDragDrop?: boolean;
  enableVirtualization?: boolean;

  // Virtualization
  height?: number;
  rowHeight?: number;
  overscan?: number;

  // Persistence
  persistenceKey?: string;

  // Lazy loading
  onLoadData?: (node: TreeNode) => Promise<TreeNode[] | void>;

  // Context menu
  contextMenuOptions?: ContextMenuOptions;
  customContextMenuItems?: (node: TreeNode) => ContextMenuItem[];
  onContextMenu?: (e: React.MouseEvent, items: ContextMenuItem[]) => void;

  // Custom action buttons
  customActionButtons?: CustomActionButton[];

  // Icons
  folderIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;

  // Events
  onAction?: (action: TreeAction) => void;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;

  children: ReactNode;
}
```

### Tree.List

Renders the list of visible nodes with optional virtualization.

```tsx
interface TreeListProps {
  children: (props: { visibleNodes: TreeNodeId[] }) => ReactNode;
}
```

### Tree.Item / Tree.StyledItem

Renders individual tree nodes.

```tsx
interface TreeItemProps {
  nodeId: TreeNodeId;
  children: ReactNode | ((state: ItemState) => ReactNode);
}

interface StyledItemProps extends TreeItemProps {
  showGrip?: boolean;
  showIcon?: boolean;
  showContextMenuButton?: boolean;
  renderCustomContent?: (state: ItemState) => ReactNode;
  onContextMenu?: (e: React.MouseEvent, items: ContextMenuItem[]) => void;
}
```

### Tree.Trigger

Expand/collapse button for parent nodes.

```tsx
interface TriggerProps {
  nodeId?: TreeNodeId; // Optional in v2.1+ (uses ItemContext)
  children: (state: TriggerState) => ReactNode;
}

interface TriggerState {
  isOpen: boolean;
  hasChildren: boolean;
  toggle: () => void;
}
```

### Tree.Checkbox

Checkbox for node selection.

```tsx
interface CheckboxProps {
  nodeId?: TreeNodeId; // Optional in v2.1+ (uses ItemContext)
  children: (state: CheckboxState) => ReactNode;
}

interface CheckboxState {
  isChecked: boolean;
  isPartiallyChecked: boolean;
  toggle: () => void;
}
```

### Tree.Label

Node label with inline editing support.

```tsx
interface LabelProps {
  nodeId?: TreeNodeId; // Optional in v2.1+ (uses ItemContext)
  editable?: boolean;
  children?: (state: LabelState) => ReactNode;
}

interface LabelState {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}
```

## 🎨 Examples

### Basic Tree

```tsx
<Tree.Root data={data} onDataChange={setData}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.Item key={nodeId} nodeId={nodeId}>
          <Tree.Label />  {/* No nodeId needed! */}
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### With Drag and Drop

```tsx
<Tree.Root data={data} onDataChange={setData} enableDragDrop>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId} showGrip showIcon>
          {() => (
            <>
              <Tree.Trigger>
                {({ isOpen }) => <span>{isOpen ? '▼' : '▶'}</span>}
              </Tree.Trigger>
              <Tree.Label editable />
            </>
          )}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### With Checkboxes

```tsx
<Tree.Root data={data} onDataChange={setData}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId}>
          {() => (
            <>
              <Tree.Checkbox>
                {({ isChecked, isPartiallyChecked }) => (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    ref={(el) => el && (el.indeterminate = isPartiallyChecked)}
                    readOnly
                  />
                )}
              </Tree.Checkbox>
              <Tree.Label />
            </>
          )}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### Custom Action Buttons

```tsx
const customActionButtons: CustomActionButton[] = [
  {
    id: 'star',
    icon: <Star size={14} />,
    tooltip: 'Mark as favorite',
    action: (node) => console.log('Starred:', node.label),
  },
  {
    id: 'delete',
    icon: <Trash2 size={14} />,
    tooltip: 'Delete',
    danger: true,
    visible: (node) => !node.children, // Only for leaf nodes
    action: (node) => console.log('Delete:', node.label),
  },
];

<Tree.Root data={data} customActionButtons={customActionButtons}>
  {/* ... */}
</Tree.Root>
```

### Context Menus

```tsx
const { contextMenu, closeContextMenu, handleContextMenu } = useContextMenu();

<Tree.Root
  data={data}
  onDataChange={setData}
  contextMenuOptions={{
    rename: true,
    duplicate: true,
    delete: true,
    cut: true,
    copy: true,
    paste: true,
  }}
  onContextMenu={handleContextMenu}
>
  {/* ... */}
</Tree.Root>

{contextMenu && (
  <ContextMenu
    position={contextMenu.position}
    items={contextMenu.items}
    onClose={closeContextMenu}
  />
)}
```

### Keyboard Navigation

```tsx
import { useTreeKeyboardNavigation } from 'arborix';

function MyTree() {
  useTreeKeyboardNavigation();

  return <Tree.Root>{/* ... */}</Tree.Root>;
}
```

**Keyboard Shortcuts:**
- `↑/↓` - Navigate up/down
- `←/→` - Collapse/expand
- `Enter` - Select node
- `Space` - Toggle checkbox
- `F2` - Start editing
- `Delete` - Delete selected
- `Ctrl+A` - Select all
- `Ctrl+C` - Copy
- `Ctrl+X` - Cut
- `Ctrl+V` - Paste
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## 🔧 Advanced Usage

### Lazy Loading

```tsx
const handleLoadData = async (node: TreeNode) => {
  const children = await fetchChildren(node.id);
  return children;
};

<Tree.Root data={data} onLoadData={handleLoadData}>
  {/* ... */}
</Tree.Root>
```

### Virtualization

```tsx
<Tree.Root
  data={data}
  enableVirtualization
  height={600}
  rowHeight={32}
  overscan={5}
>
  {/* ... */}
</Tree.Root>
```

### State Persistence

```tsx
<Tree.Root data={data} persistenceKey="my-tree-state">
  {/* Tree state will be saved to localStorage */}
</Tree.Root>
```

## 🎭 Hooks

### useTree

Access tree context from any child component.

```tsx
const tree = Tree.useTree();

// Available methods
tree.addNode(parentId, label);
tree.deleteNode(id);
tree.duplicateNode(id);
tree.updateNode(id, updates);
tree.selectNode(id);
tree.toggleOpen(id);
tree.startEditing(id);
tree.undo();
tree.redo();
// ... and more
```

### useTreeKeyboardNavigation

Enable keyboard navigation.

```tsx
useTreeKeyboardNavigation();
```

### useContextMenu

Manage context menus.

```tsx
const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
```

### useTreeHelpers (v2.1+)

Convenience hook with 30+ helper methods for common tree operations.

```tsx
import { useTreeHelpers } from 'arborix';

function Toolbar() {
  const helpers = useTreeHelpers();

  return (
    <>
      <button onClick={() => helpers.addFolder(null, 'New Folder')}>
        Add Folder
      </button>
      <button onClick={() => helpers.addFolderAndEdit(null)}>
        Add & Edit
      </button>
      <button onClick={() => helpers.deleteSelected()}>
        Delete Selected
      </button>
      <button onClick={() => helpers.expandAll()}>
        Expand All
      </button>
      <button onClick={() => helpers.collapseAll()}>
        Collapse All
      </button>
    </>
  );
}
```

Available helpers:
- `addFolder`, `addFile`, `addFolderAndEdit`, `addFileAndEdit`
- `deleteSelected`, `duplicateSelected`
- `expandAll`, `collapseAll`, `expandRecursive`, `collapseRecursive`
- `selectAll`, `deselectAll`, `selectAndExpand`, `selectVisible`
- `sortByLabel`, `sortFoldersFirst`
- `getStats` (returns total nodes, leaf nodes, folder nodes, etc.)
- ...and 18 more helpers! See [IMPROVEMENTS_V2.1.md](./IMPROVEMENTS_V2.1.md) for full list.

### TreeRecipes (v2.1+)

Utility functions for tree operations.

```tsx
import { TreeRecipes } from 'arborix';

// Filter tree by search query
const filtered = TreeRecipes.filterTree(data, 'search term');

// Sort tree alphabetically
const sorted = TreeRecipes.sortByLabel(data);

// Find nodes by criteria
const results = TreeRecipes.findNodes(data, (node) => node.label.includes('test'));

// Get node path from root
const path = TreeRecipes.getNodePath(data, nodeId);

// Count total nodes
const count = TreeRecipes.countNodes(data);

// Get all leaf nodes
const leaves = TreeRecipes.getLeafNodes(data);

// Clone tree deeply
const cloned = TreeRecipes.cloneTree(data);
```

Available utilities:
- `filterTree`, `findNodes`, `findNode`, `findNodeById`
- `sortByLabel`, `sortByCustom`
- `getNodePath`, `getNodeDepth`, `getNodeLevel`
- `countNodes`, `getLeafNodes`, `getFolderNodes`
- `cloneTree`, `mapTree`, `flattenTree`
- ...and 6 more utilities! See [IMPROVEMENTS_V2.1.md](./IMPROVEMENTS_V2.1.md) for full list.

## 📖 TypeScript

Arborix is written in TypeScript and provides full type definitions.

```tsx
import type {
  TreeData,
  TreeNode,
  TreeNodeId,
  TreeAction,
  ContextMenuItem,
  CustomActionButton,
} from 'arborix';
```

## 🔄 Migration from v1.x

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

## 📄 License

MIT © [Wesley Ximenes](https://github.com/wesleyxmns)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/wesleyxmns/Arborix/issues).
