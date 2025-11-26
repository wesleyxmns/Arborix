# Drag and Drop Guide

Arborix provides a robust drag and drop system powered by `@dnd-kit`.

## Enabling Drag and Drop

To enable drag and drop, simply add the `enableDragDrop` prop to `Tree.Root`.

```tsx
<Tree.Root 
  data={data} 
  onDataChange={setData} 
  enableDragDrop
>
```

## How it Works

When enabled, Arborix handles:
1.  **Draggable Items:** Making nodes draggable.
2.  **Droppable Zones:** Calculating drop targets (above, below, or inside a node).
3.  **Visual Feedback:** Providing state for `isDragging`, `isOver`, and `canDrop`.
4.  **Data Updates:** Automatically updating the `data` structure on drop.

## Visualizing Drag State

You need to provide visual feedback to the user. `Tree.Item` (and `Tree.StyledItem`) provides the necessary state:

```tsx
<Tree.Item nodeId={nodeId}>
  {({ isDragging, isOver, canDrop }) => (
    <div style={{
      opacity: isDragging ? 0.5 : 1,
      background: isOver ? (canDrop ? 'green' : 'red') : 'transparent'
    }}>
      {/* content */}
    </div>
  )}
</Tree.Item>
```

## Drag Handle

You can make the entire node draggable, or just a specific handle.

-   **Entire Node:** Default behavior if no handle is specified.
-   **Specific Handle:** Use `Tree.StyledItem` with `showGrip`, or implement your own handle using `attributes` and `listeners` (advanced).

## Restrictions

You can control where items can be dropped. (Coming soon: `canDrop` callback prop).

## See Also

- [Drag and Drop Example](/examples/drag-drop)
