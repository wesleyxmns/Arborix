# Custom Action Buttons

Add interactive buttons to your tree nodes (e.g., Edit, Delete, Download).

## Configuration

Pass an array of `CustomActionButton` objects to the `customActionButtons` prop on `Tree.Root`.

```tsx
const buttons = [
  {
    id: 'edit',
    icon: <EditIcon />,
    tooltip: 'Edit Item',
    action: (node) => console.log('Edit', node),
    visible: (node) => !node.readOnly // Conditional visibility
  },
  {
    id: 'delete',
    icon: <TrashIcon />,
    danger: true, // Styles as destructive
    action: (node) => tree.deleteNode(node.id)
  }
];

<Tree.Root customActionButtons={buttons}>
  {/* ... */}
</Tree.Root>
```

## Rendering

If you use `Tree.StyledItem`, these buttons are rendered automatically on hover.

If you use `Tree.Item` (headless), you need to render them yourself. (Currently, the `customActionButtons` prop is primarily consumed by `Tree.StyledItem`. For headless usage, you can simply render your own buttons directly in your item component).

## Styling

Buttons are styled with the class `.tree-action-button`.
- Default: Gray text, hover background.
- Danger: Red text, red hover background.

## See Also

- [Custom Buttons Example](/examples/custom-buttons)
- [CustomActionButton Type](/api/custom-action-button)
