import { useMemo } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { TreeRecipes } from '../utils/TreeRecipes';
import type { TreeNodeId } from '../types';

// ============================================================================
// useTreeHelpers - Convenience hook with common tree operations
// ============================================================================

/**
 * Hook that provides convenient helper functions for common tree operations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const helpers = useTreeHelpers();
 *
 *   return (
 *     <button onClick={() => helpers.addFolder(null, 'New Folder')}>
 *       Add Folder
 *     </button>
 *   );
 * }
 * ```
 */
export function useTreeHelpers() {
  const tree = useTreeContext();

  return useMemo(
    () => ({
      // ========================================================================
      // CRUD Shortcuts
      // ========================================================================

      /**
       * Add a new folder (node with children array)
       */
      addFolder: (parentId: TreeNodeId | null, name: string = 'New Folder') => {
        const id = tree.addNode(parentId, name);
        tree.updateNode(id, { children: [] });
        return id;
      },

      /**
       * Add a new file (leaf node without children)
       */
      addFile: (parentId: TreeNodeId | null, name: string = 'New File') => {
        return tree.addNode(parentId, name);
      },

      /**
       * Add node and immediately start editing
       */
      addAndEdit: (parentId: TreeNodeId | null, name: string = 'New Item') => {
        const id = tree.addNode(parentId, name);
        setTimeout(() => tree.startEditing(id), 0);
        return id;
      },

      /**
       * Add folder and immediately start editing
       */
      addFolderAndEdit: (parentId: TreeNodeId | null, name: string = 'New Folder') => {
        const id = tree.addNode(parentId, name);
        tree.updateNode(id, { children: [] });
        setTimeout(() => tree.startEditing(id), 0);
        return id;
      },

      /**
       * Delete multiple nodes at once
       */
      deleteNodes: (ids: TreeNodeId[]) => {
        ids.forEach((id) => tree.deleteNode(id));
        tree.commit();
      },

      /**
       * Delete all selected nodes
       */
      deleteSelected: () => {
        const ids = Array.from(tree.state.selectedIds);
        ids.forEach((id) => tree.deleteNode(id));
        tree.clearSelection();
        tree.commit();
      },

      // ========================================================================
      // Selection Helpers
      // ========================================================================

      /**
       * Select node and expand it if it has children
       */
      selectAndExpand: (nodeId: TreeNodeId) => {
        tree.selectNode(nodeId);
        const node = tree.findNode(tree.state.data, nodeId);
        if (node?.children && node.children.length > 0) {
          if (!tree.state.openIds.has(nodeId)) {
            tree.toggleOpen(nodeId);
          }
        }
      },

      /**
       * Select all nodes at a specific depth
       */
      selectAtDepth: (depth: number) => {
        const nodesAtDepth = TreeRecipes.getNodesAtDepth(tree.state.data, depth);
        tree.clearSelection();
        nodesAtDepth.forEach((id) => tree.selectNode(id, true));
      },

      /**
       * Select all leaf nodes
       */
      selectAllLeaves: () => {
        const leaves = TreeRecipes.getLeafNodes(tree.state.data);
        tree.clearSelection();
        leaves.forEach((node) => tree.selectNode(node.id, true));
      },

      /**
       * Select all parent nodes (folders)
       */
      selectAllParents: () => {
        const parents = TreeRecipes.getParentNodes(tree.state.data);
        tree.clearSelection();
        parents.forEach((node) => tree.selectNode(node.id, true));
      },

      // ========================================================================
      // Expansion Helpers
      // ========================================================================

      /**
       * Expand all nodes up to a specific depth
       */
      expandToDepth: (maxDepth: number) => {
        const openIds = TreeRecipes.expandToDepth(tree.state.data, maxDepth);
        openIds.forEach((id) => {
          if (!tree.state.openIds.has(id)) {
            tree.toggleOpen(id);
          }
        });
      },

      /**
       * Collapse all nodes except those in a specific path
       */
      collapseAllExcept: (nodeId: TreeNodeId) => {
        const path = TreeRecipes.getNodePath(tree.state.data, nodeId);
        const pathIds = new Set(path.map((n) => n.id));

        // Collapse all nodes not in path
        tree.state.openIds.forEach((id) => {
          if (!pathIds.has(id)) {
            tree.toggleOpen(id);
          }
        });
      },

      /**
       * Expand path to a specific node (reveal it)
       */
      revealNode: (nodeId: TreeNodeId) => {
        const path = TreeRecipes.getNodePath(tree.state.data, nodeId);

        // Expand all ancestors
        path.forEach((node) => {
          if (node.children && !tree.state.openIds.has(node.id)) {
            tree.toggleOpen(node.id);
          }
        });
      },

      // ========================================================================
      // Search and Filter
      // ========================================================================

      /**
       * Search tree and expand matching nodes
       */
      searchAndExpand: (query: string) => {
        if (!query.trim()) return;

        const filtered = TreeRecipes.filterTree(tree.state.data, query);

        // Expand all parent nodes in filtered results
        function expandFiltered(nodes: typeof filtered) {
          nodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
              if (!tree.state.openIds.has(node.id)) {
                tree.toggleOpen(node.id);
              }
              expandFiltered(node.children);
            }
          });
        }

        expandFiltered(filtered);
        return filtered;
      },

      /**
       * Highlight matching nodes by selecting them
       */
      searchAndSelect: (query: string) => {
        if (!query.trim()) {
          tree.clearSelection();
          return;
        }

        const lowerQuery = query.toLowerCase();
        const allNodes = TreeRecipes.flattenTree(tree.state.data);
        const matches = allNodes.filter((node) =>
          node.label.toLowerCase().includes(lowerQuery)
        );

        tree.clearSelection();
        matches.forEach((node) => tree.selectNode(node.id, true));

        return matches;
      },

      // ========================================================================
      // Sorting
      // ========================================================================

      /**
       * Sort tree alphabetically
       */
      sortAlphabetically: (descending = false) => {
        const sorted = TreeRecipes.sortByLabel(tree.state.data, descending);
        tree.setData(sorted);
        tree.commit();
      },

      /**
       * Sort with folders first
       */
      sortFoldersFirst: () => {
        const sorted = TreeRecipes.sortFoldersFirst(tree.state.data);
        tree.setData(sorted);
        tree.commit();
      },

      // ========================================================================
      // Info Getters
      // ========================================================================

      /**
       * Get statistics about the tree
       */
      getStats: () => ({
        totalNodes: TreeRecipes.countNodes(tree.state.data),
        leafNodes: TreeRecipes.getLeafNodes(tree.state.data).length,
        parentNodes: TreeRecipes.getParentNodes(tree.state.data).length,
        maxDepth: TreeRecipes.getMaxDepth(tree.state.data),
        selectedCount: tree.state.selectedIds.size,
        checkedCount: tree.state.checkedIds.size,
        openCount: tree.state.openIds.size,
      }),

      /**
       * Check if a node is visible (all ancestors are expanded)
       */
      isNodeVisible: (nodeId: TreeNodeId) => {
        const path = TreeRecipes.getNodePath(tree.state.data, nodeId);

        // All ancestors (except the node itself) must be open
        return path.slice(0, -1).every((node) => tree.state.openIds.has(node.id));
      },

      /**
       * Get siblings of a node
       */
      getSiblings: (nodeId: TreeNodeId) => {
        const parent = tree.findParent(tree.state.data, nodeId);

        if (parent?.children) {
          return parent.children.filter((child) => child.id !== nodeId);
        }

        // Root level siblings
        return tree.state.data.filter((node) => node.id !== nodeId);
      },

      /**
       * Get all descendants of a node
       */
      getDescendants: (nodeId: TreeNodeId) => {
        const node = tree.findNode(tree.state.data, nodeId);
        if (!node?.children) return [];

        return TreeRecipes.flattenTree(node.children);
      },

      // ========================================================================
      // Direct access to TreeRecipes
      // ========================================================================
      recipes: TreeRecipes,
    }),
    [tree]
  );
}
