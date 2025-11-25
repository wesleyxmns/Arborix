# Migration Guide: Arborix v1.x → v2.0

This guide will help you migrate from Arborix v1.x to v2.0 (headless architecture).

## Overview of Changes

Arborix v2.0 is a complete rewrite with a **headless architecture**. This means:

- ✅ **More flexibility** - Complete control over styling and rendering
- ✅ **Better TypeScript** - Full type safety throughout
- ✅ **New features** - Custom action buttons, enhanced context menus, undo/redo
- ⚠️ **Breaking changes** - Different API and component structure

## Breaking Changes

### 1. Headless Architecture

**v1.x:** Components came with built-in styling
```tsx
import { Tree } from 'arborix';

<Tree data={data} />
```

**v2.0:** You control the rendering
```tsx
import { Tree } from 'arborix';

<Tree.Root data={data}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.Item key={nodeId} nodeId={nodeId}>
          <Tree.Label nodeId={nodeId} />
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### 2. Component Structure

**v1.x:**
```tsx
<Tree
  data={data}
  onDataChange={setData}
  renderNode={(node) => <div>{node.label}</div>}
/>
```

**v2.0:**
```tsx
<Tree.Root data={data} onDataChange={setData}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId}>
          {() => <Tree.Label nodeId={nodeId} />}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### 3. Props Renamed

| v1.x | v2.0 |
|------|------|
| `nodes` | `data` |
| `onNodesChange` | `onDataChange` |
| `expandedIds` | Managed internally (use `persistenceKey`) |
| `selectedIds` | Managed internally (access via `useTree()`) |

### 4. Event Handlers

**v1.x:**
```tsx
<Tree
  onNodeClick={(node) => console.log(node)}
  onNodeExpand={(node) => console.log(node)}
/>
```

**v2.0:**
```tsx
const tree = Tree.useTree();

// Access state directly
console.log(tree.state.selectedIds);
console.log(tree.state.openIds);

// Or use onAction callback
<Tree.Root
  onAction={(action) => {
    if (action.type === 'select') {
      console.log('Selected:', action.nodeId);
    }
  }}
>
```

### 5. Styling

**v1.x:** Built-in styles
```tsx
<Tree className="my-tree" />
```

**v2.0:** Bring your own styles
```tsx
<Tree.Root className="my-tree">
  <Tree.StyledItem
    nodeId={nodeId}
    className="my-node"
    style={{ padding: '8px' }}
  >
    {/* Custom rendering */}
  </Tree.StyledItem>
</Tree.Root>
```

## Migration Steps

### Step 1: Update Imports

```tsx
// v1.x
import { Tree, TreeNode } from 'arborix';

// v2.0
import { Tree, type TreeNode, type TreeData } from 'arborix';
```

### Step 2: Restructure Components

**Before (v1.x):**
```tsx
function MyTree() {
  const [data, setData] = useState(initialData);

  return (
    <Tree
      nodes={data}
      onNodesChange={setData}
      renderNode={(node) => <div>{node.label}</div>}
    />
  );
}
```

**After (v2.0):**
```tsx
function MyTree() {
  const [data, setData] = useState(initialData);

  return (
    <Tree.Root data={data} onDataChange={setData}>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map((nodeId) => (
            <Tree.Item key={nodeId} nodeId={nodeId}>
              <Tree.Label nodeId={nodeId} />
            </Tree.Item>
          ))
        }
      </Tree.List>
    </Tree.Root>
  );
}
```

### Step 3: Add Styling

v2.0 doesn't include built-in styles. You need to add your own:

```css
/* Example styles */
.tree-root {
  font-family: system-ui;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
}

.tree-item:hover {
  background: #f0f0f0;
}

.tree-item[aria-selected="true"] {
  background: #e0e0ff;
}
```

### Step 4: Update Event Handlers

**Before (v1.x):**
```tsx
<Tree
  onNodeClick={(node) => handleClick(node)}
  onNodeExpand={(node) => handleExpand(node)}
/>
```

**After (v2.0):**
```tsx
function MyTree() {
  const handleAction = (action: TreeAction) => {
    switch (action.type) {
      case 'select':
        handleClick(action.nodeId);
        break;
      case 'toggle':
        handleExpand(action.nodeId);
        break;
    }
  };

  return (
    <Tree.Root data={data} onAction={handleAction}>
      {/* ... */}
    </Tree.Root>
  );
}
```

## New Features in v2.0

### Custom Action Buttons

```tsx
const customActionButtons: CustomActionButton[] = [
  {
    id: 'star',
    icon: <Star size={14} />,
    tooltip: 'Favorite',
    action: (node) => console.log('Starred:', node.label),
  },
];

<Tree.Root customActionButtons={customActionButtons}>
  {/* ... */}
</Tree.Root>
```

### Enhanced Context Menus

```tsx
const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

<Tree.Root
  contextMenuOptions={{
    rename: true,
    duplicate: true,
    delete: true,
  }}
  onContextMenu={handleContextMenu}
>
  {/* ... */}
</Tree.Root>
```

### Undo/Redo

```tsx
const tree = Tree.useTree();

<button onClick={() => tree.undo()} disabled={!tree.canUndo}>
  Undo
</button>
<button onClick={() => tree.redo()} disabled={!tree.canRedo}>
  Redo
</button>
```

### Keyboard Navigation

```tsx
import { useTreeKeyboardNavigation } from 'arborix';

function MyTree() {
  useTreeKeyboardNavigation();
  return <Tree.Root>{/* ... */}</Tree.Root>;
}
```

## Common Patterns

### With Drag and Drop

**v1.x:**
```tsx
<Tree enableDragDrop />
```

**v2.0:**
```tsx
<Tree.Root enableDragDrop>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId} showGrip>
          {() => <Tree.Label nodeId={nodeId} />}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### With Checkboxes

**v1.x:**
```tsx
<Tree showCheckboxes />
```

**v2.0:**
```tsx
<Tree.Root>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map((nodeId) => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId}>
          {() => (
            <>
              <Tree.Checkbox nodeId={nodeId}>
                {({ isChecked, isPartiallyChecked }) => (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    ref={(el) => el && (el.indeterminate = isPartiallyChecked)}
                    readOnly
                  />
                )}
              </Tree.Checkbox>
              <Tree.Label nodeId={nodeId} />
            </>
          )}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### With Inline Editing

**v1.x:**
```tsx
<Tree editable />
```

**v2.0:**
```tsx
<Tree.Label nodeId={nodeId} editable>
  {({ isEditing, value, onChange, onSave, onCancel }) =>
    isEditing ? (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave();
          if (e.key === 'Escape') onCancel();
        }}
        autoFocus
      />
    ) : (
      <span>{value}</span>
    )
  }
</Tree.Label>
```

## Removed Features

The following features from v1.x are not available in v2.0:

- ❌ Built-in styling (use your own styles)
- ❌ Theme prop (use CSS variables or your styling solution)
- ❌ Icon prop (use `folderIcon` and `fileIcon` props)

## Need Help?

- 📖 [Full Documentation](https://wesleyxmns.github.io/Arborix/)
- 🐛 [Report Issues](https://github.com/wesleyxmns/Arborix/issues)
- 💬 [Discussions](https://github.com/wesleyxmns/Arborix/discussions)

## Gradual Migration

You can use both versions side by side during migration:

```tsx
// Install both versions
npm install arborix@1.x arborix@2.x

// Use different imports
import { Tree as TreeV1 } from 'arborix-v1';
import { Tree as TreeV2 } from 'arborix';
```

Then migrate components one at a time.
