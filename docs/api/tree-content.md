# Tree.Content

Wrapper component for node content area.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Content nodeId={nodeId}>
  {/* content */}
</Tree.Content>
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node.

### children

- **Type:** `ReactNode`
- **Required:** Yes

Content to render.

## Example

```tsx
<Tree.Content nodeId={nodeId}>
  <div className="node-content">
    <Tree.Label nodeId={nodeId} />
    <span className="badge">New</span>
  </div>
</Tree.Content>
```

## See Also

- [Tree.Item](/api/tree-item)
- [Tree.Label](/api/tree-label)
