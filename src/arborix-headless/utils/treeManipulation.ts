import type { TreeData, TreeNode, TreeNodeId } from '../types';

// ============================================================================
// Tree Manipulation Utilities
// Extracted from v1.x useDragDrop hook - EXACT SAME LOGIC
// ============================================================================

/**
 * Find a node and its parent in the tree
 * @param data - Tree data
 * @param targetId - ID of the node to find
 * @param parent - Current parent (used in recursion)
 * @returns Object with node and parent, or null if not found
 */
export const findNodeAndParent = (
  data: TreeData,
  targetId: TreeNodeId,
  parent: TreeNode | null = null
): { node: TreeNode; parent: TreeNode | null } | null => {
  for (const node of data) {
    if (node.id === targetId) return { node, parent };
    if (node.children) {
      const result = findNodeAndParent(node.children, targetId, node);
      if (result) return result;
    }
  }
  return null;
};

/**
 * Remove a node from the tree
 * @param data - Tree data
 * @param nodeId - ID of the node to remove
 * @returns New tree data without the node
 */
export const removeNode = (data: TreeData, nodeId: TreeNodeId): TreeData => {
  const result: TreeData = [];

  for (const node of data) {
    if (node.id === nodeId) continue;

    if (node.children) {
      const newChildren = removeNode(node.children, nodeId);
      result.push({ ...node, children: newChildren });
    } else {
      result.push(node);
    }
  }

  return result;
};

/**
 * Insert a node at a specific position relative to a target node
 * @param data - Tree data
 * @param nodeToInsert - Node to insert
 * @param targetId - ID of the target node
 * @param position - Position relative to target ('before' | 'after' | 'inside')
 * @returns New tree data with the node inserted
 */
export const insertNode = (
  data: TreeData,
  nodeToInsert: TreeNode,
  targetId: TreeNodeId,
  position: 'before' | 'after' | 'inside'
): TreeData => {
  const result: TreeData = [];

  for (const current of data) {
    if (current.id === targetId) {
      if (position === 'before') {
        result.push(nodeToInsert);
        result.push(current);
      } else if (position === 'after') {
        result.push(current);
        result.push(nodeToInsert);
      } else {
        // inside
        result.push({
          ...current,
          children: [...(current.children || []), nodeToInsert],
        });
      }
    } else if (current.children) {
      const newChildren = insertNode(current.children, nodeToInsert, targetId, position);
      result.push({ ...current, children: newChildren });
    } else {
      result.push(current);
    }
  }

  return result;
};

/**
 * Check if a node is a descendant of another node
 * @param data - Tree data
 * @param nodeId - ID of the potential descendant
 * @param ancestorId - ID of the potential ancestor
 * @returns True if nodeId is a descendant of ancestorId
 */
export const isDescendantOf = (
  data: TreeData,
  nodeId: TreeNodeId,
  ancestorId: TreeNodeId
): boolean => {
  const findNode = (nodes: TreeData, id: TreeNodeId): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const hasDescendant = (node: TreeNode | null, targetId: TreeNodeId): boolean => {
    if (!node?.children) return false;
    for (const child of node.children) {
      if (child.id === targetId) return true;
      if (hasDescendant(child, targetId)) return true;
    }
    return false;
  };

  const ancestor = findNode(data, ancestorId);
  return hasDescendant(ancestor, nodeId);
};

/**
 * Clean up empty children arrays from nodes
 * Converts nodes with empty children to leaf nodes
 * @param data - Tree data
 * @returns New tree data with empty children removed
 */
export const cleanupEmptyParents = (data: TreeData): TreeData => {
  return data.map(node => {
    if (node.children) {
      const cleanedChildren = cleanupEmptyParents(node.children);
      if (cleanedChildren.length === 0) {
        const { children, ...rest } = node;
        return rest as TreeNode;
      }
      return { ...node, children: cleanedChildren };
    }
    return node;
  });
};

/**
 * Find a node by ID (simple version without parent)
 * @param data - Tree data
 * @param id - ID of the node to find
 * @returns The node or null if not found
 */
export const findNode = (data: TreeData, id: TreeNodeId): TreeNode | null => {
  for (const node of data) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};
