import type { TreeNode, TreeNodeId } from '../types';

export interface VisibleNode {
  node: TreeNode;
  depth: number;
  index: number;
  parentId: TreeNodeId | null;
  isLastChild: boolean;
}

export const flattenVisibleTree = (
  data: TreeNode[],
  openIds: Set<TreeNodeId>,
  searchResults?: Set<TreeNodeId>
): VisibleNode[] => {
  const result: VisibleNode[] = [];
  const openSet = searchResults ? new Set([...openIds, ...searchResults]) : openIds;

  const walk = (nodes: TreeNode[], depth = 0, parentId: TreeNodeId | null = null) => {
    nodes.forEach((node, i) => {
      const isLast = i === nodes.length - 1;
      result.push({ node, depth, index: result.length, parentId, isLastChild: isLast });

      if (node.children && openSet.has(node.id)) {
        // Chamada recursiva ajustada (quarto argumento removido)
        walk(node.children, depth + 1, node.id);
      }
    });
  };

  walk(data);
  return result;
};