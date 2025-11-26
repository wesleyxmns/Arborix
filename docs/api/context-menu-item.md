# ContextMenuItem

Type definition for context menu items.

## Definition

```tsx
interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (node: TreeNode) => void;
  visible?: (node: TreeNode) => boolean;
  danger?: boolean;
  separator?: boolean;
}
```

## Properties

### id

- **Type:** `string`
- **Required:** Yes

Unique identifier for the menu item.

### label

- **Type:** `string`
- **Required:** Yes

Display text for the menu item.

### icon

- **Type:** `React.ReactNode`
- **Optional**

Icon to display before the label.

### action

- **Type:** `(node: TreeNode) => void`
- **Required:** Yes

Function called when item is clicked.

### visible

- **Type:** `(node: TreeNode) => boolean`
- **Optional**

Function to conditionally show/hide item.

### danger

- **Type:** `boolean`
- **Default:** `false`

If true, item is styled with red/danger color.

### separator

- **Type:** `boolean`
- **Default:** `false`

If true, shows a separator line after this item.

## Example

```tsx
import { Edit, Copy, Trash2, Share } from 'lucide-react';
import type { ContextMenuItem } from 'arborix';

const menuItems: ContextMenuItem[] = [
  {
    id: 'rename',
    label: 'Rename',
    icon: <Edit size={14} />,
    action: (node) => {
      tree.startEditing(node.id);
    }
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy size={14} />,
    action: (node) => {
      tree.duplicateNode(node.id);
    },
    separator: true
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share size={14} />,
    visible: (node) => !node.children,
    action: async (node) => {
      const url = await generateShareLink(node);
      navigator.clipboard.writeText(url);
    }
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 size={14} />,
    danger: true,
    action: (node) => {
      if (confirm(`Delete ${node.label}?`)) {
        tree.deleteNode(node.id);
      }
    }
  }
];

<Tree.Root customContextMenuItems={() => menuItems}>
  {/* ... */}
</Tree.Root>
```

## See Also

- [Tree.Root](/api/tree-root)
- [Context Menu Example](/examples/context-menus)
