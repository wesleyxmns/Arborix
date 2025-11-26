# Tree.Checkbox

Component for multi-select with checkboxes.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Checkbox nodeId={nodeId}>
  {({ isChecked }) => /* render */}
</Tree.Checkbox>
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node.

### children

- **Type:** `(state: CheckboxState) => ReactNode`
- **Required:** Yes

Render function.

## CheckboxState

```tsx
interface CheckboxState {
  isChecked: boolean;
  isPartiallyChecked: boolean;
  toggle: () => void;
}
```

## Example

```tsx
<Tree.Checkbox nodeId={nodeId}>
  {({ isChecked, isPartiallyChecked, toggle }) => (
    <input
      type="checkbox"
      checked={isChecked}
      ref={el => el && (el.indeterminate = isPartiallyChecked)}
      onChange={toggle}
    />
  )}
</Tree.Checkbox>
```

## See Also

- [Tree.Item](/api/tree-item)
- [Examples](/examples/checkboxes)
