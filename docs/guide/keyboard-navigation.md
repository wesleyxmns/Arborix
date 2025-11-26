# Keyboard Navigation

Arborix comes with full WAI-ARIA compliant keyboard navigation out of the box.

## Usage

To enable keyboard navigation, use the `useTreeKeyboardNavigation` hook and attach the handler to your container.

```tsx
function MyTree() {
  const { handleKeyDown } = Tree.useTreeKeyboardNavigation();

  return (
    <div 
      onKeyDown={handleKeyDown} 
      tabIndex={0} // Make div focusable
      className="tree-container"
    >
      <Tree.Root>...</Tree.Root>
    </div>
  );
}
```

## Shortcuts

| Key | Action |
| :--- | :--- |
| `↑` (Up Arrow) | Move focus to previous visible node. |
| `↓` (Down Arrow) | Move focus to next visible node. |
| `→` (Right Arrow) | Expand node. If already expanded, move to first child. |
| `←` (Left Arrow) | Collapse node. If already collapsed, move to parent. |
| `Enter` | Select the focused node. |
| `Space` | Toggle checkbox (if present) or selection. |
| `Home` | Move to first node. |
| `End` | Move to last visible node. |
| `*` (Asterisk) | Expand all siblings of the focused node. |
| `F2` | Start editing the focused node. |
| `Delete` | Delete the selected node(s). |
| `Ctrl` + `A` | Select all nodes. |
| `Ctrl` + `C` | Copy selected nodes. |
| `Ctrl` + `X` | Cut selected nodes. |
| `Ctrl` + `V` | Paste nodes into focused node. |
| `Ctrl` + `Z` | Undo last action. |
| `Ctrl` + `Shift` + `Z` | Redo last action. |

## Accessibility (a11y)

Arborix manages ARIA attributes automatically:
- `role="tree"` on the list.
- `role="treeitem"` on items.
- `aria-expanded` state.
- `aria-selected` state.
- `aria-level` for depth.

Ensure your container has a label using `aria-label` or `aria-labelledby`.
