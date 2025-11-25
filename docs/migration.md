# Migration from v1.x

Complete guide for migrating from Arborix v1.x to v2.0.

## Quick Summary

Arborix v2.0 is a complete rewrite with a **headless architecture**. The main changes are:

- ✅ **Headless** - You control the UI completely
- ✅ **Better TypeScript** - Full type safety
- ✅ **New Features** - Custom buttons, undo/redo, enhanced menus
- ⚠️ **Breaking Changes** - Different API and structure

## Breaking Changes

### 1. Component Structure

**v1.x:**
```tsx
<Tree data={data} />
```

**v2.0:**
```tsx
<Tree.Root data={data}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.Item key={nodeId} nodeId={nodeId}>
          <Tree.Label nodeId={nodeId} />
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### 2. Props Renamed

| v1.x | v2.0 |
|------|------|
| `nodes` | `data` |
| `onNodesChange` | `onDataChange` |
| `expandedIds` | Managed internally |
| `selectedIds` | Managed internally |

### 3. No Built-in Styles

v2.0 is headless - you must provide your own styles.

## Migration Steps

### Step 1: Update Imports

```tsx
// v1.x
import { Tree } from 'arborix';

// v2.0
import { Tree } from 'arborix';
// Types are now exported separately
import type { TreeData, TreeNode } from 'arborix';
```

### Step 2: Restructure Components

**Before:**
```tsx
<Tree
  nodes={data}
  onNodesChange={setData}
  renderNode={(node) => <div>{node.label}</div>}
/>
```

**After:**
```tsx
<Tree.Root data={data} onDataChange={setData}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId}>
          {() => <Tree.Label nodeId={nodeId} />}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

### Step 3: Add Styling

```css
.tree-item {
  padding: 8px;
  cursor: pointer;
}

.tree-item:hover {
  background: #f0f0f0;
}

.tree-item[aria-selected="true"] {
  background: #e0e0ff;
}
```

## Feature Migration

### Drag and Drop

**v1.x:**
```tsx
<Tree enableDragDrop />
```

**v2.0:**
```tsx
<Tree.Root enableDragDrop>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.StyledItem 
          key={nodeId} 
          nodeId={nodeId}
          showGrip
        />
      ))
    }
  </Tree.List>
</Tree.Root>
```

### Checkboxes

**v1.x:**
```tsx
<Tree showCheckboxes />
```

**v2.0:**
```tsx
<Tree.StyledItem nodeId={nodeId}>
  {() => (
    <>
      <Tree.Checkbox nodeId={nodeId}>
        {({ isChecked }) => (
          <input type="checkbox" checked={isChecked} readOnly />
        )}
      </Tree.Checkbox>
      <Tree.Label nodeId={nodeId} />
    </>
  )}
</Tree.StyledItem>
```

### Inline Editing

**v1.x:**
```tsx
<Tree editable />
```

**v2.0:**
```tsx
<Tree.Label nodeId={nodeId} editable />
```

## New Features in v2.0

### Custom Action Buttons

```tsx
const buttons: CustomActionButton[] = [
  {
    id: 'star',
    icon: <Star />,
    tooltip: 'Favorite',
    action: (node) => console.log('Starred:', node)
  }
];

<Tree.Root customActionButtons={buttons} />
```

### Undo/Redo

```tsx
const tree = Tree.useTree();

<button onClick={() => tree.undo()}>Undo</button>
<button onClick={() => tree.redo()}>Redo</button>
```

### Enhanced Keyboard Navigation

All shortcuts built-in:
- Ctrl+Z/Y - Undo/Redo
- Ctrl+C/X/V - Copy/Cut/Paste
- F2 - Edit
- Delete - Delete

## Common Patterns

### File Explorer

**v1.x:**
```tsx
<Tree
  nodes={data}
  renderNode={(node) => (
    <div>
      {node.children ? '📁' : '📄'} {node.label}
    </div>
  )}
/>
```

**v2.0:**
```tsx
<Tree.Root data={data}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.StyledItem key={nodeId} nodeId={nodeId}>
          {() => (
            <>
              <Tree.Trigger nodeId={nodeId}>
                {({ hasChildren }) => (
                  <span>{hasChildren ? '📁' : '📄'}</span>
                )}
              </Tree.Trigger>
              <Tree.Label nodeId={nodeId} />
            </>
          )}
        </Tree.StyledItem>
      ))
    }
  </Tree.List>
</Tree.Root>
```

## Gradual Migration

You can use both versions side by side:

```bash
npm install arborix@1.x arborix@2.x
```

```tsx
import { Tree as TreeV1 } from 'arborix-v1';
import { Tree as TreeV2 } from 'arborix';
```

Then migrate components one at a time.

## Need Help?

- 📖 [Documentation](/)
- 💬 [GitHub Discussions](https://github.com/wesleyxmns/Arborix/discussions)
- 🐛 [Report Issues](https://github.com/wesleyxmns/Arborix/issues)
