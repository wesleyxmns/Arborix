# Tree.StyledItem

Tree item component with built-in structure for drag handle, icons, and context menu.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.StyledItem nodeId={nodeId} showIcon showGrip>
  {() => /* content */}
</Tree.StyledItem>
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node to render.

### children

- **Type:** `ReactNode | ((state: ItemState) => ReactNode)`
- **Required:** Yes

Content to render.

### showGrip

- **Type:** `boolean`
- **Default:** `false`

Show drag handle for drag and drop.

### showIcon

- **Type:** `boolean`
- **Default:** `false`

Show folder/file icon based on `hasChildren`.

### showContextMenuButton

- **Type:** `boolean`
- **Default:** `false`

Show context menu button on hover.

### className

- **Type:** `string`
- **Optional**

Additional CSS class names.

### style

- **Type:** `React.CSSProperties`
- **Optional**

Inline styles.

### renderCustomContent

- **Type:** `(state: ItemState) => ReactNode`
- **Optional**

Custom content renderer.

### onContextMenu

- **Type:** `(e: React.MouseEvent, items: ContextMenuItem[]) => void`
- **Optional**

Context menu handler.

## Example

### Basic Usage

```tsx
<Tree.StyledItem nodeId={nodeId} showIcon>
  {() => <Tree.Label nodeId={nodeId} />}
</Tree.StyledItem>
```

### With Drag and Drop

```tsx
<Tree.StyledItem 
  nodeId={nodeId}
  showGrip
  showIcon
>
  {({ isDragging, isOver }) => (
    <div style={{
      opacity: isDragging ? 0.5 : 1,
      background: isOver ? '#e0f2fe' : 'transparent'
    }}>
      <Tree.Trigger nodeId={nodeId}>
        {({ isOpen }) => <span>{isOpen ? '▼' : '▶'}</span>}
      </Tree.Trigger>
      <Tree.Label nodeId={nodeId} editable />
    </div>
  )}
</Tree.StyledItem>
```

### With All Features

```tsx
<Tree.StyledItem
  nodeId={nodeId}
  showGrip
  showIcon
  showContextMenuButton
  className="my-tree-item"
  style={{ padding: '8px' }}
  onContextMenu={(e, items) => {
    console.log('Context menu:', items);
  }}
>
  {({ isSelected, hasChildren }) => (
    <>
      {hasChildren && (
        <Tree.Trigger nodeId={nodeId}>
          {({ isOpen }) => (
            <span className="chevron">
              {isOpen ? '▼' : '▶'}
            </span>
          )}
        </Tree.Trigger>
      )}
      
      <Tree.Checkbox nodeId={nodeId}>
        {({ isChecked, isPartiallyChecked }) => (
          <input
            type="checkbox"
            checked={isChecked}
            ref={el => el && (el.indeterminate = isPartiallyChecked)}
            readOnly
          />
        )}
      </Tree.Checkbox>
      
      <Tree.Label nodeId={nodeId} editable />
    </>
  )}
</Tree.StyledItem>
```

## Built-in Structure

`Tree.StyledItem` provides:

1. **Drag Handle** (when `showGrip={true}`)
   - Appears on hover
   - Enables drag and drop

2. **Icon** (when `showIcon={true}`)
   - Folder icon for nodes with children
   - File icon for leaf nodes
   - Uses `folderIcon` and `fileIcon` from `Tree.Root`

3. **Context Menu Button** (when `showContextMenuButton={true}`)
   - Three-dot menu
   - Appears on hover
   - Triggers context menu

4. **Custom Action Buttons**
   - From `customActionButtons` prop on `Tree.Root`
   - Appear on hover
   - Conditional visibility support

## Styling

```css
.tree-styled-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.tree-styled-item:hover {
  background: #f0f0f0;
}

.tree-styled-item[aria-selected="true"] {
  background: #e0e0ff;
}

.tree-styled-item .grip {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-styled-item:hover .grip {
  opacity: 1;
}
```

## vs Tree.Item

| Feature | Tree.Item | Tree.StyledItem |
|---------|-----------|-----------------|
| Drag Handle | Manual | `showGrip` prop |
| Icons | Manual | `showIcon` prop |
| Context Menu | Manual | `showContextMenuButton` prop |
| Structure | None | Built-in |
| Flexibility | Maximum | Balanced |

## See Also

- [Tree.Item](/api/tree-item)
- [Tree.Trigger](/api/tree-trigger)
- [Tree.Label](/api/tree-label)
