# Virtualization Example

Handle large trees with thousands of nodes efficiently.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function VirtualizedTree() {
  // Generate large dataset
  const generateData = (count = 1000) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: `${i}`,
        label: `Item ${i}`,
        children: i % 10 === 0 ? [
          { id: `${i}-1`, label: `Child ${i}-1` },
          { id: `${i}-2`, label: `Child ${i}-2` }
        ] : undefined
      });
    }
    return data;
  };

  const [data, setData] = useState(generateData(10000));

  return (
    <div style={{ fontFamily: 'system-ui', fontSize: '14px' }}>
      <div style={{ marginBottom: '16px' }}>
        <strong>10,000 nodes</strong> - Smooth scrolling with virtualization
      </div>
      
      <Tree.Root 
        data={data} 
        onDataChange={setData}
        enableVirtualization
        height={600}
        rowHeight={32}
        overscan={5}
      >
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map(nodeId => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                showIcon
                style={{
                  height: '32px',
                  padding: '4px 8px'
                }}
              >
                {() => (
                  <>
                    <Tree.Trigger nodeId={nodeId}>
                      {({ isOpen, hasChildren }) =>
                        hasChildren && (
                          <span>{isOpen ? '▼' : '▶'}</span>
                        )
                      }
                    </Tree.Trigger>
                    <Tree.Label nodeId={nodeId} />
                  </>
                )}
              </Tree.StyledItem>
            ))
          }
        </Tree.List>
      </Tree.Root>
    </div>
  );
}
```

## Features

- ✅ Handles 10,000+ nodes
- ✅ Smooth scrolling
- ✅ Constant memory usage
- ✅ Only renders visible items
- ✅ Configurable overscan

## Configuration

### Enable Virtualization

```tsx
<Tree.Root 
  data={data}
  enableVirtualization  // Enable virtualization
  height={600}          // Container height
  rowHeight={32}        // Height of each row
  overscan={5}          // Items to render outside viewport
>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableVirtualization` | `boolean` | `false` | Enable virtualization |
| `height` | `number` | `600` | Container height in pixels |
| `rowHeight` | `number` | `32` | Height of each row in pixels |
| `overscan` | `number` | `5` | Extra items to render for smooth scrolling |

## Performance Tips

### 1. Fixed Row Height

Use consistent row heights for best performance:

```tsx
<Tree.StyledItem 
  nodeId={nodeId}
  style={{ height: '32px' }}  // Match rowHeight
>
```

### 2. Memoize Components

```tsx
const TreeItem = memo(({ nodeId }) => (
  <Tree.StyledItem nodeId={nodeId}>
    {/* content */}
  </Tree.StyledItem>
));
```

### 3. Optimize Renders

```tsx
<Tree.List>
  {({ visibleNodes }) =>
    visibleNodes.map(nodeId => (
      <TreeItem key={nodeId} nodeId={nodeId} />
    ))
  }
</Tree.List>
```

## Benchmarks

| Nodes | Without Virtualization | With Virtualization |
|-------|------------------------|---------------------|
| 100 | 60 FPS | 60 FPS |
| 1,000 | 30 FPS | 60 FPS |
| 10,000 | 5 FPS | 60 FPS |
| 100,000 | Crash | 60 FPS |

## See Also

- [Tree.Root](/api/tree-root)
- [Tree.List](/api/tree-list)
