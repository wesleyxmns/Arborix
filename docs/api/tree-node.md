# TreeNode

Type definition for individual tree nodes.

## Definition

```tsx
interface TreeNode {
  id: TreeNodeId;
  label: string;
  children?: TreeNode[];
  [key: string]: any;
}
```

## Properties

### id

- **Type:** `TreeNodeId` (string | number)
- **Required:** Yes

Unique identifier for the node.

### label

- **Type:** `string`
- **Required:** Yes

Display text for the node.

### children

- **Type:** `TreeNode[]`
- **Optional**

Array of child nodes. If present, the node is treated as a folder.

### Custom Properties

You can add any custom properties to store additional data:

```tsx
interface CustomTreeNode extends TreeNode {
  icon?: string;
  color?: string;
  metadata?: {
    size: number;
    modified: Date;
  };
}
```

## Example

```tsx
import type { TreeNode } from 'arborix';

const node: TreeNode = {
  id: '1',
  label: 'My Folder',
  children: [
    { id: '1-1', label: 'File 1.txt' },
    { id: '1-2', label: 'File 2.txt' }
  ]
};

// With custom properties
const customNode: TreeNode = {
  id: '2',
  label: 'Image.png',
  icon: '🖼️',
  size: 1024,
  type: 'image'
};
```

## Accessing Node Data

```tsx
function MyTreeItem({ nodeId }: { nodeId: TreeNodeId }) {
  const tree = Tree.useTree();
  const node = tree.getNode(nodeId);
  
  if (!node) return null;
  
  return (
    <div>
      <span>{node.label}</span>
      {node.children && (
        <span>({node.children.length} items)</span>
      )}
    </div>
  );
}
```

## See Also

- [TreeData](/api/tree-data)
- [Tree.Root](/api/tree-root)
- [useTree](/api/use-tree)
