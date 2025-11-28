import { useMemo } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useOptionalItemContext } from '../context/ItemContext';
import type { TreeContentProps, ItemRenderState } from '../types';

// ============================================================================
// Content Component - Custom node content area
// ============================================================================

export function Content({
  nodeId: nodeIdProp,
  children,
  as: Component = 'div',
  className,
  style,
}: TreeContentProps) {
  const tree = useTreeContext();
  const itemContext = useOptionalItemContext();

  // Use explicit nodeId if provided, otherwise get from ItemContext
  const nodeId = nodeIdProp ?? itemContext?.nodeId;

  if (!nodeId) {
    throw new Error(
      'Tree.Content requires a nodeId prop or must be used within Tree.Item'
    );
  }

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  // Calculate depth
  const depth = tree.getNodeDepth(nodeId);

  // Compute full item state for render props
  const state: ItemRenderState = useMemo(() => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isOpen = tree.state.openIds.has(nodeId);
    const isSelected = tree.state.selectedIds.has(nodeId);
    const isFocused = tree.focusedNodeId === nodeId;
    const isChecked = tree.state.checkedIds.has(nodeId);
    const isPartiallyChecked = tree.state.partialCheckedIds.has(nodeId);
    const isCut = tree.state.cutNodeIds.has(nodeId);
    const isEditing = tree.editingNodeId === nodeId;
    const isLoading = Boolean(node.isLoading);

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
      isDragging: false, // DragDrop context is optional
      isDropTarget: false,
      dropPosition: null,
    };
  }, [
    node,
    depth,
    nodeId,
    tree.state.openIds,
    tree.state.selectedIds,
    tree.focusedNodeId,
    tree.state.checkedIds,
    tree.state.partialCheckedIds,
    tree.state.cutNodeIds,
    tree.editingNodeId,
  ]);

  return (
    <Component className={className} style={style}>
      {typeof children === 'function' ? children(node, state) : children}
    </Component>
  );
}

Content.displayName = 'Tree.Content';
