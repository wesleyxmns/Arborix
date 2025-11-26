# useTree

Hook to access tree state and actions.

## Import

```tsx
import { Tree } from 'arborix';

const tree = Tree.useTree();
```

## Returns

```tsx
interface TreeContextValue {
  // State
  data: TreeData;
  selectedNodes: Set<TreeNodeId>;
  openNodes: Set<TreeNodeId>;
  
  // Node Operations
  addNode: (parentId: TreeNodeId | null, label: string) => TreeNodeId;
  updateNode: (nodeId: TreeNodeId, updates: Partial<TreeNode>) => void;
  deleteNode: (nodeId: TreeNodeId) => void;
  duplicateNode: (nodeId: TreeNodeId) => TreeNodeId;
  
  // Selection
  selectNode: (nodeId: TreeNodeId) => void;
  deselectNode: (nodeId: TreeNodeId) => void;
  toggleSelection: (nodeId: TreeNodeId) => void;
  selectAll: () => void;
  deselectAll: () => void;
  
  // Expand/Collapse
  openNode: (nodeId: TreeNodeId) => void;
  closeNode: (nodeId: TreeNodeId) => void;
  toggleNode: (nodeId: TreeNodeId) => void;
  openAll: () => void;
  closeAll: () => void;
  
  // Editing
  startEditing: (nodeId: TreeNodeId) => void;
  stopEditing: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Clipboard
  cut: (nodeIds: TreeNodeId[]) => void;
  copy: (nodeIds: TreeNodeId[]) => void;
  paste: (targetId: TreeNodeId | null) => void;
  
  // Utility
  getNode: (nodeId: TreeNodeId) => TreeNode | undefined;
  getParent: (nodeId: TreeNodeId) => TreeNode | undefined;
  getChildren: (nodeId: TreeNodeId) => TreeNode[];
  getSiblings: (nodeId: TreeNodeId) => TreeNode[];
}
```

## Example

```tsx
function TreeToolbar() {
  const tree = Tree.useTree();
  
  return (
    <div className="toolbar">
      <button onClick={() => tree.addNode(null, 'New Folder')}>
        Add Folder
      </button>
      
      <button 
        onClick={() => tree.undo()}
        disabled={!tree.canUndo}
      >
        Undo
      </button>
      
      <button 
        onClick={() => tree.redo()}
        disabled={!tree.canRedo}
      >
        Redo
      </button>
      
      <button onClick={() => tree.openAll()}>
        Expand All
      </button>
      
      <button onClick={() => tree.closeAll()}>
        Collapse All
      </button>
    </div>
  );
}
```

## See Also

- [Tree.Root](/api/tree-root)
- [useTreeKeyboardNavigation](/api/use-tree-keyboard-navigation)
