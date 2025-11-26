# useTreeKeyboardNavigation

Hook for keyboard navigation functionality.

## Import

```tsx
import { Tree } from 'arborix';

const { handleKeyDown } = Tree.useTreeKeyboardNavigation();
```

## Returns

```tsx
interface KeyboardNavigationHook {
  handleKeyDown: (e: React.KeyboardEvent) => void;
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate up/down |
| `←` / `→` | Collapse/expand |
| `Enter` | Select node |
| `Space` | Toggle checkbox |
| `F2` | Start editing |
| `Escape` | Stop editing |
| `Delete` | Delete node |
| `Ctrl+C` | Copy |
| `Ctrl+X` | Cut |
| `Ctrl+V` | Paste |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |

## Example

```tsx
function MyTree() {
  const { handleKeyDown } = Tree.useTreeKeyboardNavigation();
  
  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Tree.Root data={data}>
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map(nodeId => (
              <Tree.Item key={nodeId} nodeId={nodeId}>
                <Tree.Label nodeId={nodeId} editable />
              </Tree.Item>
            ))
          }
        </Tree.List>
      </Tree.Root>
    </div>
  );
}
```

## See Also

- [useTree](/api/use-tree)
- [Keyboard Navigation Guide](/guide/keyboard-navigation)
