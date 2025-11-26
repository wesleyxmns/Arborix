# Context Menus

Arborix provides a built-in context menu system for right-click interactions.

## Setup

1.  **Define Items:** Create an array of `ContextMenuItem`.
2.  **Pass to Root:** Use `customContextMenuItems` prop.
3.  **Enable in Item:** Use `showContextMenuButton` on `Tree.StyledItem` OR use the `useContextMenu` hook for custom items.

```tsx
const getMenuItems = (node) => [
  {
    id: 'rename',
    label: 'Rename',
    action: () => tree.startEditing(node.id)
  },
  {
    id: 'delete',
    label: 'Delete',
    danger: true,
    separator: true,
    action: () => tree.deleteNode(node.id)
  }
];

<Tree.Root customContextMenuItems={getMenuItems}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.StyledItem 
          key={nodeId} 
          nodeId={nodeId} 
          showContextMenuButton // Shows 3-dot button
          // Right-click also works automatically on the item
        />
      ))
    }
  </Tree.List>
</Tree.Root>
```

## Built-in Actions

You can also enable standard actions without defining them manually:

```tsx
<Tree.Root
  contextMenuOptions={{
    rename: true,
    delete: true,
    duplicate: true,
    cut: true,
    copy: true,
    paste: true
  }}
>
```

## Custom Implementation

If you are building a fully headless item, use the hook:

```tsx
const { showContextMenu } = Tree.useContextMenu();

<div onContextMenu={(e) => showContextMenu(e, nodeId)}>
  {/* ... */}
</div>
```

## See Also

- [Context Menus Example](/examples/context-menus)
- [useContextMenu Hook](/api/use-context-menu)
