# State Management

How Arborix handles state and how you can interact with it.

## Internal State

Arborix manages a complex internal state including:
- **Data Structure:** The hierarchical tree data.
- **Expansion:** Which nodes are open/closed.
- **Selection:** Which nodes are selected.
- **Editing:** Which node is currently being edited.
- **Drag & Drop:** Current drag source and drop target.
- **History:** Undo/Redo stack.

This state is managed using `immer` for immutable updates and `useReducer` for predictable state transitions.

## Controlled vs Uncontrolled

### Uncontrolled (Simpler)
You provide `initialData`, and the tree manages everything. Good for simple use cases where you don't need to modify data from outside.

*(Note: Currently `Tree.Root` primarily supports the Controlled pattern via `data` and `onDataChange` for maximum flexibility, but internal expansion/selection state is often uncontrolled unless exposed).*

### Controlled Data (Recommended)
You provide the `data` prop and an `onDataChange` handler. This is essential for:
- Persisting changes to a backend.
- Modifying the tree from outside the component.
- Syncing with other UI elements.

```tsx
const [data, setData] = useState(initialData);

<Tree.Root 
  data={data} 
  onDataChange={setData} 
/>
```

## Accessing State via `useTree`

To interact with the tree state (e.g., from a toolbar or external button), use the `useTree` hook.

**Note:** `useTree` must be used **inside** `Tree.Root`.

```tsx
function TreeToolbar() {
  const { 
    openAll, 
    closeAll, 
    undo, 
    redo,
    addNode 
  } = Tree.useTree();

  return (
    <div>
      <button onClick={openAll}>Expand All</button>
      <button onClick={undo}>Undo</button>
    </div>
  );
}

// Usage
<Tree.Root data={data}>
  <TreeToolbar /> {/* Works because it's inside Root */}
  <Tree.List>...</Tree.List>
</Tree.Root>
```

## Performance

Arborix is optimized for performance:
- **Selectors:** Components only re-render when their specific slice of state changes.
- **Virtualization:** `Tree.List` only renders visible nodes.
- **Stable Callbacks:** Actions returned by `useTree` are stable references.
