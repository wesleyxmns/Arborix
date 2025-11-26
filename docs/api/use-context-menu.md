# useContextMenu

Hook for context menu functionality.

## Import

```tsx
import { Tree } from 'arborix';

const { showContextMenu } = Tree.useContextMenu();
```

## Returns

```tsx
interface ContextMenuHook {
  showContextMenu: (e: React.MouseEvent, nodeId: TreeNodeId) => void;
  hideContextMenu: () => void;
  isVisible: boolean;
}
```

## Example

```tsx
function CustomTreeItem({ nodeId }: { nodeId: TreeNodeId }) {
  const { showContextMenu } = Tree.useContextMenu();
  
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        showContextMenu(e, nodeId);
      }}
    >
      <Tree.Label nodeId={nodeId} />
    </div>
  );
}
```

## See Also

- [useTree](/api/use-tree)
- [Context Menu Example](/examples/context-menus)
