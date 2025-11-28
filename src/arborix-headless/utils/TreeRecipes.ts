import type { TreeData, TreeNode, TreeNodeId } from '../types';

// ============================================================================
// TreeRecipes - Common utility functions for tree operations
// ============================================================================

/**
 * Collection of utility functions for common tree operations
 */
export const TreeRecipes = {
  /**
   * Filter tree by search query (case-insensitive)
   * Returns a new tree with only matching nodes and their ancestors
   *
   * @param data - Tree data
   * @param query - Search query
   * @returns Filtered tree data
   */
  filterTree(data: TreeData, query: string): TreeData {
    if (!query.trim()) return data;

    const lowerQuery = query.toLowerCase();

    function filterNode(node: TreeNode): TreeNode | null {
      const matches = node.label.toLowerCase().includes(lowerQuery);

      // Filter children recursively
      const filteredChildren = node.children
        ?.map((child) => filterNode(child))
        .filter((child): child is TreeNode => child !== null);

      // Include node if it matches OR has matching descendants
      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren,
          isOpen: filteredChildren && filteredChildren.length > 0 ? true : node.isOpen,
        };
      }

      return null;
    }

    return data
      .map((node) => filterNode(node))
      .filter((node): node is TreeNode => node !== null);
  },

  /**
   * Get path from root to a specific node
   *
   * @param data - Tree data
   * @param targetId - Target node ID
   * @returns Array of nodes from root to target, or empty array if not found
   */
  getNodePath(data: TreeData, targetId: TreeNodeId): TreeNode[] {
    function findPath(nodes: TreeNode[], path: TreeNode[] = []): TreeNode[] | null {
      for (const node of nodes) {
        const currentPath = [...path, node];

        if (node.id === targetId) {
          return currentPath;
        }

        if (node.children) {
          const found = findPath(node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    }

    return findPath(data) || [];
  },

  /**
   * Count total number of nodes in tree
   *
   * @param data - Tree data
   * @returns Total node count
   */
  countNodes(data: TreeData): number {
    let count = 0;

    function traverse(nodes: TreeNode[]) {
      for (const node of nodes) {
        count++;
        if (node.children) {
          traverse(node.children);
        }
      }
    }

    traverse(data);
    return count;
  },

  /**
   * Get all leaf nodes (nodes without children)
   *
   * @param data - Tree data
   * @returns Array of leaf nodes
   */
  getLeafNodes(data: TreeData): TreeNode[] {
    const leaves: TreeNode[] = [];

    function traverse(nodes: TreeNode[]) {
      for (const node of nodes) {
        if (!node.children || node.children.length === 0) {
          leaves.push(node);
        } else {
          traverse(node.children);
        }
      }
    }

    traverse(data);
    return leaves;
  },

  /**
   * Get all parent nodes (nodes with children)
   *
   * @param data - Tree data
   * @returns Array of parent nodes
   */
  getParentNodes(data: TreeData): TreeNode[] {
    const parents: TreeNode[] = [];

    function traverse(nodes: TreeNode[]) {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          parents.push(node);
          traverse(node.children);
        }
      }
    }

    traverse(data);
    return parents;
  },

  /**
   * Clone tree with new IDs
   * Useful for duplicating tree structures
   *
   * @param data - Tree data
   * @param generateId - Function to generate new IDs (defaults to timestamp-based)
   * @returns Cloned tree with new IDs
   */
  cloneTreeWithNewIds(
    data: TreeData,
    generateId: () => TreeNodeId = () => `${Date.now()}-${Math.random()}`
  ): TreeData {
    function cloneNode(node: TreeNode): TreeNode {
      return {
        ...node,
        id: generateId(),
        children: node.children?.map((child) => cloneNode(child)),
      };
    }

    return data.map((node) => cloneNode(node));
  },

  /**
   * Flatten tree into a single-level array
   *
   * @param data - Tree data
   * @returns Flat array of all nodes
   */
  flattenTree(data: TreeData): TreeNode[] {
    const result: TreeNode[] = [];

    function traverse(nodes: TreeNode[]) {
      for (const node of nodes) {
        result.push(node);
        if (node.children) {
          traverse(node.children);
        }
      }
    }

    traverse(data);
    return result;
  },

  /**
   * Find node by ID
   *
   * @param data - Tree data
   * @param id - Node ID to find
   * @returns Node if found, null otherwise
   */
  findNode(data: TreeData, id: TreeNodeId): TreeNode | null {
    function search(nodes: TreeNode[]): TreeNode | null {
      for (const node of nodes) {
        if (node.id === id) return node;

        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    }

    return search(data);
  },

  /**
   * Find parent of a node
   *
   * @param data - Tree data
   * @param childId - ID of child node
   * @returns Parent node if found, null otherwise
   */
  findParent(data: TreeData, childId: TreeNodeId): TreeNode | null {
    function search(nodes: TreeNode[]): TreeNode | null {
      for (const node of nodes) {
        if (node.children) {
          // Check if any child has the target ID
          if (node.children.some((child) => child.id === childId)) {
            return node;
          }

          // Recursively search children
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    }

    return search(data);
  },

  /**
   * Get all node IDs at a specific depth
   *
   * @param data - Tree data
   * @param targetDepth - Depth level (0 = root level)
   * @returns Array of node IDs at the specified depth
   */
  getNodesAtDepth(data: TreeData, targetDepth: number): TreeNodeId[] {
    const result: TreeNodeId[] = [];

    function traverse(nodes: TreeNode[], currentDepth: number) {
      for (const node of nodes) {
        if (currentDepth === targetDepth) {
          result.push(node.id);
        }

        if (node.children && currentDepth < targetDepth) {
          traverse(node.children, currentDepth + 1);
        }
      }
    }

    traverse(data, 0);
    return result;
  },

  /**
   * Get maximum depth of tree
   *
   * @param data - Tree data
   * @returns Maximum depth
   */
  getMaxDepth(data: TreeData): number {
    let maxDepth = 0;

    function traverse(nodes: TreeNode[], currentDepth: number) {
      maxDepth = Math.max(maxDepth, currentDepth);

      for (const node of nodes) {
        if (node.children) {
          traverse(node.children, currentDepth + 1);
        }
      }
    }

    traverse(data, 0);
    return maxDepth;
  },

  /**
   * Sort tree nodes by label (alphabetically)
   *
   * @param data - Tree data
   * @param descending - Sort in descending order
   * @returns Sorted tree data
   */
  sortByLabel(data: TreeData, descending = false): TreeData {
    function sortNode(node: TreeNode): TreeNode {
      const sortedChildren = node.children
        ?.map((child) => sortNode(child))
        .sort((a, b) => {
          const comparison = a.label.localeCompare(b.label);
          return descending ? -comparison : comparison;
        });

      return {
        ...node,
        children: sortedChildren,
      };
    }

    return data
      .map((node) => sortNode(node))
      .sort((a, b) => {
        const comparison = a.label.localeCompare(b.label);
        return descending ? -comparison : comparison;
      });
  },

  /**
   * Sort tree with folders first, then files
   *
   * @param data - Tree data
   * @returns Sorted tree data
   */
  sortFoldersFirst(data: TreeData): TreeData {
    function sortNode(node: TreeNode): TreeNode {
      const sortedChildren = node.children
        ?.map((child) => sortNode(child))
        .sort((a, b) => {
          const aIsFolder = Boolean(a.children && a.children.length > 0);
          const bIsFolder = Boolean(b.children && b.children.length > 0);

          if (aIsFolder && !bIsFolder) return -1;
          if (!aIsFolder && bIsFolder) return 1;

          return a.label.localeCompare(b.label);
        });

      return {
        ...node,
        children: sortedChildren,
      };
    }

    return data
      .map((node) => sortNode(node))
      .sort((a, b) => {
        const aIsFolder = Boolean(a.children && a.children.length > 0);
        const bIsFolder = Boolean(b.children && b.children.length > 0);

        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        return a.label.localeCompare(b.label);
      });
  },

  /**
   * Expand all nodes up to a certain depth
   *
   * @param data - Tree data
   * @param maxDepth - Maximum depth to expand (-1 for all)
   * @returns Set of node IDs to mark as open
   */
  expandToDepth(data: TreeData, maxDepth: number = -1): Set<TreeNodeId> {
    const openIds = new Set<TreeNodeId>();

    function traverse(nodes: TreeNode[], currentDepth: number) {
      for (const node of nodes) {
        if (node.children && (maxDepth === -1 || currentDepth < maxDepth)) {
          openIds.add(node.id);
          traverse(node.children, currentDepth + 1);
        }
      }
    }

    traverse(data, 0);
    return openIds;
  },
};
