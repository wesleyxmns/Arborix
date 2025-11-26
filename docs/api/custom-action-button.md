# CustomActionButton

Type definition for custom action buttons on tree nodes.

## Definition

```tsx
interface CustomActionButton {
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  action: (node: TreeNode) => void;
  visible?: (node: TreeNode) => boolean;
  danger?: boolean;
}
```

## Properties

### id

- **Type:** `string`
- **Required:** Yes

Unique identifier for the button.

### icon

- **Type:** `React.ReactNode`
- **Required:** Yes

Icon to display. Can be any React element.

### tooltip

- **Type:** `string`
- **Optional**

Tooltip text shown on hover.

### action

- **Type:** `(node: TreeNode) => void`
- **Required:** Yes

Function called when button is clicked.

### visible

- **Type:** `(node: TreeNode) => boolean`
- **Optional**

Function to conditionally show/hide button.

### danger

- **Type:** `boolean`
- **Default:** `false`

If true, button is styled with red/danger color.

## Example

```tsx
import { Star, Trash2, Download } from 'lucide-react';
import type { CustomActionButton } from 'arborix';

const buttons: CustomActionButton[] = [
  {
    id: 'favorite',
    icon: <Star size={14} />,
    tooltip: 'Add to favorites',
    action: (node) => {
      console.log('Favorited:', node.label);
    }
  },
  {
    id: 'download',
    icon: <Download size={14} />,
    tooltip: 'Download',
    visible: (node) => !node.children, // Only for files
    action: async (node) => {
      await downloadFile(node.id);
    }
  },
  {
    id: 'delete',
    icon: <Trash2 size={14} />,
    tooltip: 'Delete',
    danger: true,
    action: (node) => {
      if (confirm(`Delete ${node.label}?`)) {
        tree.deleteNode(node.id);
      }
    }
  }
];

<Tree.Root customActionButtons={buttons}>
  {/* ... */}
</Tree.Root>
```

## See Also

- [Tree.Root](/api/tree-root)
- [Custom Buttons Example](/examples/custom-buttons)
