import { useEffect } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useVirtualizationContext } from '../context/VirtualizationContext';

/**
 * Hook for keyboard navigation in the tree
 * Provides basic keyboard shortcuts for tree interaction
 * 
 * @example
 * ```tsx
 * function MyTree() {
 *   useTreeKeyboardNavigation();
 *   
 *   return <Tree.Root>...</Tree.Root>
 * }
 * ```
 */
export function useTreeKeyboardNavigation() {
  const tree = useTreeContext();
  const virtualization = useVirtualizationContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const flatData = virtualization?.flatData || [];
      const focusedId = tree.focusedNodeId;

      const currentIndex = flatData.findIndex(item => item.node.id === focusedId);
      if (currentIndex === -1) return;

      const currentNode = currentIndex !== -1 ? flatData[currentIndex].node : null;

      switch (e.key) {
        case 'ArrowDown':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Move to next visible node
          if (currentIndex < flatData.length - 1) {
            const nextNode = flatData[currentIndex + 1];
            tree.setFocus(nextNode.node.id);
            tree.selectNode(nextNode.node.id, false, false, flatData.map(n => n.node.id));
          }
          break;

        case 'ArrowUp':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Move to previous visible node
          if (currentIndex > 0) {
            const prevNode = flatData[currentIndex - 1];
            tree.setFocus(prevNode.node.id);
            tree.selectNode(prevNode.node.id, false, false, flatData.map(n => n.node.id));
          }
          break;

        case 'ArrowRight':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Expand node or move to first child
          if (currentNode.children && currentNode.children.length > 0) {
            if (!tree.state.openIds.has(focusedId)) {
              tree.toggleOpen(focusedId);
            } else {
              // Move to first child
              const firstChild = currentNode.children[0];
              tree.setFocus(firstChild.id);
              tree.selectNode(firstChild.id, false, false, flatData.map(n => n.node.id));
            }
          }
          break;

        case 'ArrowLeft':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Collapse node or move to parent
          if (tree.state.openIds.has(focusedId) && currentNode.children && currentNode.children.length > 0) {
            tree.toggleOpen(focusedId);
          } else {
            // Move to parent
            const parent = tree.findParent(tree.state.data, focusedId);
            if (parent) {
              tree.setFocus(parent.id);
              tree.selectNode(parent.id, false, false, flatData.map(n => n.node.id));
            }
          }
          break;

        case 'Enter':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Toggle selection
          tree.selectNode(focusedId, false, false, flatData.map(n => n.node.id));
          break;

        case ' ':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Toggle checkbox if enabled
          tree.toggleCheck(focusedId);
          break;

        case 'F2':
          if (!focusedId || !currentNode) return;
          e.preventDefault();
          // Start editing
          tree.startEditing(focusedId);
          break;

        case 'Delete':
          if (!focusedId && tree.state.selectedIds.size === 0) return;
          e.preventDefault();
          // Delete selected nodes
          if (tree.state.selectedIds.size > 0) {
            tree.state.selectedIds.forEach(id => tree.deleteNode(id));
          } else if (focusedId) {
            tree.deleteNode(focusedId);
          }
          break;

        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Select all visible nodes
            tree.selectAllNodes(flatData.map(n => n.node.id));
          }
          break;

        // Copy
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (tree.state.selectedIds.size > 0) {
              tree.copyNode(Array.from(tree.state.selectedIds));
            } else if (focusedId) {
              tree.copyNode([focusedId]);
            }
          }
          break;

        // Cut
        case 'x':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (tree.state.selectedIds.size > 0) {
              tree.cutNode(Array.from(tree.state.selectedIds));
            } else if (focusedId) {
              tree.cutNode([focusedId]);
            }
          }
          break;

        // Paste
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const targetId = focusedId || null;
            tree.pasteNode(targetId);
          }
          break;

        // Undo
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
              tree.redo();
            } else {
              // Undo - if there are cut nodes, clear them first
              if (tree.state.cutNodeIds.size > 0) {
                tree.clearCutNodes();
              } else {
                tree.undo();
              }
            }
          }
          break;

        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Redo
            tree.redo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tree, virtualization]);
}
