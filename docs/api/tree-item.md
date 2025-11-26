# Tree.Item

Basic tree item component that provides node state without built-in styling.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Item nodeId={nodeId}>
  {/* custom content */}
</Tree.Item>
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node to render.

### children

- **Type:** `ReactNode | ((state: ItemState) => ReactNode)`
- **Required:** Yes

Content to render. Can be a render function that receives node state.

## ItemState

```tsx
interface ItemState {
  node: TreeNode;
  isSelected: boolean;
  isOpen: boolean;
  hasChildren: boolean;
  depth: number;
  isDragging: boolean;
  isOver: boolean;
  canDrop: boolean;
}
```

## Example

### Basic Usage

```tsx
<Tree.Item nodeId={nodeId}>
  <div className="my-node">
    Custom node content
  </div>
</Tree.Item>
```

### With Render Function

```tsx
<Tree.Item nodeId={nodeId}>
  {({ isSelected, depth, hasChildren }) => (
    <div 
      className="node"
      style={{ 
        paddingLeft: `${depth * 20}px`,
        background: isSelected ? '#e0e0ff' : 'transparent'
      }}
    >
      {hasChildren && <span>📁</span>}
      <span>{node.label}</span>
    </div>
  )}
</Tree.Item>
```

### Complete Example

```tsx
function CustomTreeItem({ nodeId }: { nodeId: TreeNodeId }) {
  return (
    <Tree.Item nodeId={nodeId}>
      {({ node, isSelected, depth, hasChildren, isDragging }) => (
        <div
          className="tree-item"
          style={{
            paddingLeft: `${depth * 24}px`,
            opacity: isDragging ? 0.5 : 1,
            background: isSelected ? '#e0e0ff' : 'white'
          }}
        >
          {hasChildren && (
            <Tree.Trigger nodeId={nodeId}>
              {({ isOpen }) => (
                <button className="trigger">
                  {isOpen ? '▼' : '▶'}
                </button>
              )}
            </Tree.Trigger>
          )}
          
          <span className="label">{node.label}</span>
        </div>
      )}
    </Tree.Item>
  );
}
```

## vs Tree.StyledItem

| Feature | Tree.Item | Tree.StyledItem |
|---------|-----------|-----------------|
| Styling | None (headless) | Basic structure included |
| Drag Handle | Manual | `showGrip` prop |
| Icons | Manual | `showIcon` prop |
| Context Menu | Manual | `showContextMenuButton` prop |
| Use Case | Full custom control | Quick start with structure |

## Notes

- `Tree.Item` is completely headless - you control all styling
- Use `Tree.StyledItem` for a component with basic structure
- Must be a child of `Tree.List`
- Always provide a unique `nodeId`

## See Also

- [Tree.StyledItem](/api/tree-styled-item)
- [Tree.List](/api/tree-list)
- [Tree.Root](/api/tree-root)
