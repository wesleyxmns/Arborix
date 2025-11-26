# Tree.List

Renders the list of visible tree nodes with optional virtualization.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.List>
  {({ visibleNodes }) => /* render nodes */}
</Tree.List>
```

## Props

### children

- **Type:** `(props: TreeListProps) => ReactNode`
- **Required:** Yes

Render function that receives visible nodes.

```tsx
<Tree.List>
  {({ visibleNodes }) =>
    visibleNodes.map(nodeId => (
      <Tree.Item key={nodeId} nodeId={nodeId}>
        {/* node content */}
      </Tree.Item>
    ))
  }
</Tree.List>
```

## TreeListProps

```tsx
interface TreeListProps {
  visibleNodes: TreeNodeId[];
}
```

### visibleNodes

Array of node IDs that are currently visible (respects expand/collapse state).

## Example

```tsx
import { Tree } from 'arborix';

function MyTree() {
  return (
    <Tree.Root data={data}>
      <Tree.List>
        {({ visibleNodes }) => (
          <div className="tree-list">
            {visibleNodes.map(nodeId => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                showIcon
              >
                {() => (
                  <>
                    <Tree.Trigger nodeId={nodeId}>
                      {({ isOpen }) => (
                        <span>{isOpen ? '▼' : '▶'}</span>
                      )}
                    </Tree.Trigger>
                    <Tree.Label nodeId={nodeId} />
                  </>
                )}
              </Tree.StyledItem>
            ))}
          </div>
        )}
      </Tree.List>
    </Tree.Root>
  );
}
```

## With Virtualization

When `enableVirtualization` is true on `Tree.Root`, only visible nodes in the viewport are rendered:

```tsx
<Tree.Root 
  data={data} 
  enableVirtualization
  height={600}
  rowHeight={32}
>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.Item key={nodeId} nodeId={nodeId}>
          {/* content */}
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

## Notes

- `Tree.List` must be a child of `Tree.Root`
- Always use `key={nodeId}` when mapping over `visibleNodes`
- The render function is called whenever the tree state changes
- Virtualization is automatic when enabled on `Tree.Root`

## See Also

- [Tree.Root](/api/tree-root)
- [Tree.Item](/api/tree-item)
- [Tree.StyledItem](/api/tree-styled-item)
