# Tree.Trigger

Component for expand/collapse functionality.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Trigger nodeId={nodeId}>
  {({ isOpen }) => /* render */}
</Tree.Trigger>
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node.

### children

- **Type:** `(state: TriggerState) => ReactNode`
- **Required:** Yes

Render function.

## TriggerState

```tsx
interface TriggerState {
  isOpen: boolean;
  hasChildren: boolean;
  toggle: () => void;
}
```

## Example

```tsx
<Tree.Trigger nodeId={nodeId}>
  {({ isOpen, hasChildren, toggle }) => (
    hasChildren ? (
      <button onClick={toggle} className="chevron">
        {isOpen ? '▼' : '▶'}
      </button>
    ) : null
  )}
</Tree.Trigger>
```

## See Also

- [Tree.Item](/api/tree-item)
- [Tree.Label](/api/tree-label)
