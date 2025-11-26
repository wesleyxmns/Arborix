# Types

TypeScript type definitions for Arborix.

## TreeData

```tsx
type TreeData = TreeNode[];
```

Array of root-level tree nodes.

## TreeNode

```tsx
interface TreeNode {
  id: TreeNodeId;
  label: string;
  children?: TreeNode[];
  [key: string]: any; // Custom properties
}
```

### Properties

- `id` - Unique identifier
- `label` - Display text
- `children` - Optional array of child nodes
- Custom properties - Any additional data

## TreeNodeId

```tsx
type TreeNodeId = string | number;
```

Unique identifier for a tree node.

## CustomActionButton

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

### Properties

- `id` - Unique button identifier
- `icon` - React element to display
- `tooltip` - Hover tooltip text
- `action` - Click handler
- `visible` - Conditional visibility function
- `danger` - Red styling for destructive actions

## ContextMenuItem

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

### Properties

- `id` - Unique item identifier
- `label` - Display text
- `icon` - Optional icon
- `action` - Click handler
- `visible` - Conditional visibility
- `danger` - Red styling
- `separator` - Show separator after item

## Example

```tsx
import type { 
  TreeData, 
  TreeNode, 
  CustomActionButton,
  ContextMenuItem 
} from 'arborix';

const data: TreeData = [
  {
    id: '1',
    label: 'Folder',
    children: [
      { id: '1-1', label: 'File' }
    ]
  }
];

const buttons: CustomActionButton[] = [
  {
    id: 'delete',
    icon: <TrashIcon />,
    tooltip: 'Delete',
    action: (node) => console.log('Delete', node),
    danger: true
  }
];

const menuItems: ContextMenuItem[] = [
  {
    id: 'rename',
    label: 'Rename',
    action: (node) => console.log('Rename', node)
  }
];
```

## See Also

- [Tree.Root](/api/tree-root)
- [Custom Action Buttons](/examples/custom-buttons)
