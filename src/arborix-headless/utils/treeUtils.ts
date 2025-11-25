import { TreeData, TreeNode, TreeNodeId } from '../types';

/**
 * Flattens the visible nodes of the tree, respecting the open/closed state.
 */
export const getVisibleFlatNodes = (
  nodes: TreeData,
  openIds: Set<TreeNodeId>
): TreeNodeId[] => {
  const result: TreeNodeId[] = [];

  const traverse = (items: TreeData) => {
    for (const item of items) {
      result.push(item.id);
      if (item.children && item.children.length > 0 && openIds.has(item.id)) {
        traverse(item.children);
      }
    }
  };

  traverse(nodes);
  return result;
};

/**
 * Deeply clones a node and its children, generating new unique IDs.
 */
export const cloneNode = (node: TreeNode): TreeNode => {
  const newId = `${node.id}_copy_${Math.random().toString(36).substr(2, 9)}`;

  const newNode: TreeNode = {
    ...node,
    id: newId,
    label: `${node.label} (Copy)`,
    children: node.children ? node.children.map(child => cloneNode(child)) : undefined,
  };

  return newNode;
};
