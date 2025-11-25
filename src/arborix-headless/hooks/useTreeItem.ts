import { useMemo } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useDragDropContext } from '../context/useDragDropContext';
import type { TreeNodeId, ItemRenderState } from '../types';

/**
 * Hook to access state for a specific tree item
 * 
 * @param nodeId - The ID of the node to get state for
 * @returns ItemRenderState with all node state
 * 
 * @example
 * ```tsx
 * function CustomTreeItem({ nodeId }: { nodeId: string }) {
 *   const item = useTreeItem(nodeId);
 *   
 *   return (
 *     <div style={{ paddingLeft: item.depth * 20 }}>
 *       {item.isSelected && '✓'} {item.node.label}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTreeItem(nodeId: TreeNodeId): ItemRenderState | null {
  const tree = useTreeContext();
  const dragDrop = useDragDropContext();

  const state = useMemo(() => {
    const node = tree.findNode(tree.state.data, nodeId);

    if (!node) {
      return null;
    }

    const depth = tree.getNodeDepth(nodeId);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isOpen = tree.state.openIds.has(nodeId);
    const isSelected = tree.state.selectedIds.has(nodeId);
    const isFocused = tree.focusedNodeId === nodeId;
    const isChecked = tree.state.checkedIds.has(nodeId);
    const isPartiallyChecked = tree.state.partialCheckedIds.has(nodeId);
    const isCut = tree.state.cutNodeIds.has(nodeId);
    const isEditing = tree.editingNodeId === nodeId;
    const isLoading = Boolean(node.isLoading);

    const isDragging = dragDrop?.activeId === nodeId;
    const isDropTarget = dragDrop?.overId === nodeId;
    const dropPosition = isDropTarget ? dragDrop.dropPosition : null;

    return {
      node,
      depth,
      isOpen,
      isSelected,
      isFocused,
      isChecked,
      isPartiallyChecked,
      isCut,
      hasChildren,
      isEditing,
      isLoading,
      isDragging,
      isDropTarget,
      dropPosition,
    };
  }, [
    nodeId,
    tree,
    dragDrop,
  ]);

  return state;
}
