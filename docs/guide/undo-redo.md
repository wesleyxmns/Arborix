# Undo/Redo

Arborix includes a built-in history stack for undo/redo functionality.

## How it Works

Every time the tree data changes (add, remove, move, rename), a snapshot of the state is pushed to the history stack.

## Using History

Access history controls via `useTree`.

```tsx
function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = Tree.useTree();

  return (
    <>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </>
  );
}
```

## Keyboard Shortcuts

-   `Ctrl` + `Z`: Undo
-   `Ctrl` + `Shift` + `Z` (or `Ctrl` + `Y`): Redo

## Limitations

-   The history stack is kept in memory. Reloading the page clears it.
-   It tracks `data` changes. It does **not** track transient state like expansion or selection (unless configured otherwise in future versions).
