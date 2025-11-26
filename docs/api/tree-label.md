# Tree.Label

Component for displaying and editing node labels.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Label nodeId={nodeId} editable />
```

## Props

### nodeId

- **Type:** `TreeNodeId`
- **Required:** Yes

The ID of the node.

### editable

- **Type:** `boolean`
- **Default:** `false`

Enable inline editing.

### children

- **Type:** `(state: LabelState) => ReactNode`
- **Optional**

Custom render function.

## LabelState

```tsx
interface LabelState {
  value: string;
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  onChange: (value: string) => void;
}
```

## Example

### Basic

```tsx
<Tree.Label nodeId={nodeId} />
```

### Editable

```tsx
<Tree.Label nodeId={nodeId} editable />
```

### Custom

```tsx
<Tree.Label nodeId={nodeId} editable>
  {({ value, isEditing, startEditing, onChange }) => (
    isEditing ? (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus
      />
    ) : (
      <span onDoubleClick={startEditing}>{value}</span>
    )
  )}
</Tree.Label>
```

## See Also

- [Tree.Item](/api/tree-item)
- [Tree.Trigger](/api/tree-trigger)
