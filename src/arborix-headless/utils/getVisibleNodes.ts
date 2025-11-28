import type { TreeData, TreeNodeId, TreeNode } from '../types';

// ============================================================================
// Get Visible Nodes - Flatten tree based on open state
// ============================================================================

/**
 * Flattens a tree structure into a list of visible node IDs based on open state
 *
 * @param data - The tree data
 * @param openIds - Set of node IDs that are currently expanded
 * @returns Array of visible node IDs in display order
 */
export function getVisibleNodes(
  data: TreeData,
  openIds: Set<TreeNodeId>
): TreeNodeId[] {
  const result: TreeNodeId[] = [];

  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      result.push(node.id);

      // If node is open and has children, recursively add them
      if (openIds.has(node.id) && node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(data);
  return result;
}

/**
 * Gets visible nodes with their depth information
 */
export interface VisibleNodeWithDepth {
  id: TreeNodeId;
  depth: number;
  node: TreeNode;
}

export function getVisibleNodesWithDepth(
  data: TreeData,
  openIds: Set<TreeNodeId>
): VisibleNodeWithDepth[] {
  const result: VisibleNodeWithDepth[] = [];

  function traverse(nodes: TreeNode[], depth: number = 0) {
    for (const node of nodes) {
      result.push({ id: node.id, depth, node });

      // If node is open and has children, recursively add them
      if (openIds.has(node.id) && node.children && node.children.length > 0) {
        traverse(node.children, depth + 1);
      }
    }
  }

  traverse(data);
  return result;
}
