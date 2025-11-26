# Virtualization Guide

Rendering large lists efficiently.

## The Challenge

Rendering a DOM node for every item in a tree with 10,000 items will crash the browser. Virtualization solves this by only rendering the items currently visible in the viewport (plus a small buffer).

## Enabling Virtualization

Arborix uses `@tanstack/react-virtual` under the hood.

```tsx
<Tree.Root 
  data={largeData}
  enableVirtualization
  height={500}      // Height of the scrollable container (px)
  rowHeight={32}    // Fixed height of each row (px)
  overscan={10}     // Number of items to render outside viewport
>
```

## Requirements

1.  **Fixed Height Container:** You must provide a `height` prop.
2.  **Fixed Row Height:** Currently, Arborix is optimized for fixed row heights via `rowHeight`.
3.  **Tree.List:** You must use the `Tree.List` component, as it handles the scrolling and positioning logic.

## Usage in Render Prop

When virtualization is enabled, `visibleNodes` in `Tree.List` will only contain the subset of nodes that should be rendered.

```tsx
<Tree.List>
  {({ visibleNodes }) => 
    // This array is small (e.g., 20 items), even if data has 10,000
    visibleNodes.map(nodeId => (
      <Tree.Item key={nodeId} nodeId={nodeId}>...</Tree.Item>
    ))
  }
</Tree.List>
```

## See Also

- [Virtualization Example](/examples/virtualization)
