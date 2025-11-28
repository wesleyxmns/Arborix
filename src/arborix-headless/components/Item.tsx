import { useMemo, type CSSProperties } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useDragDropContext } from '../context/useDragDropContext';
import { ItemProvider } from '../context/ItemContext';
import type { TreeItemProps, ItemRenderState } from '../types';

// ============================================================================
// Item Component - Individual tree node
// ============================================================================

export function Item({
  nodeId,
  children,
  as: Component = 'div',
  className,
  style,
  onClick,
  onDoubleClick,
  onContextMenu,
}: TreeItemProps) {
  const tree = useTreeContext();
  const dragDrop = useDragDropContext();

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  // Calculate depth
  const depth = tree.getNodeDepth(nodeId);

  // Compute item state
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
    dragDrop?.activeId,
    dragDrop?.overId,
    dragDrop?.dropPosition,
  ]);

  // Resolve className (can be string or function)
  const resolvedClassName = typeof className === 'function'
    ? className(state)
    : className;

  // Resolve style (can be object or function)
  const resolvedStyle: CSSProperties = typeof style === 'function'
    ? style(state)
    : style || {};

  // Event handlers
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e, state);
    } else {
      // Default behavior: select node
      const multi = e.ctrlKey || e.metaKey;
      const range = e.shiftKey;
      tree.selectNode(nodeId, multi, range);
      tree.setFocus(nodeId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (onDoubleClick) {
      onDoubleClick(e, state);
    } else {
      // Default behavior: toggle open or start editing
      if (state.hasChildren) {
        tree.toggleOpen(nodeId);
      } else {
        tree.startEditing(nodeId);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      onContextMenu(e, state);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (dragDrop && !state.isEditing) {
      dragDrop.handleDragStart(e, nodeId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (dragDrop) {
      e.preventDefault();
      e.stopPropagation();
      dragDrop.handleDragOver(e, nodeId);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (dragDrop) {
      dragDrop.handleDrop(e);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (dragDrop) {
      dragDrop.handleDragEnd(e);
    }
  };

  // ARIA attributes
  const ariaExpanded = state.hasChildren ? state.isOpen : undefined;
  const ariaSelected = state.isSelected;
  const ariaLevel = depth + 1;

  return (
    <ItemProvider value={{ nodeId }}>
      <Component
        data-node-id={nodeId}
        role="treeitem"
        aria-expanded={ariaExpanded}
        aria-selected={ariaSelected}
        aria-level={ariaLevel}
        tabIndex={state.isEditing ? -1 : 0}
        draggable={dragDrop && !state.isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={resolvedClassName}
        style={resolvedStyle}
      >
        {typeof children === 'function' ? children(state) : children}
      </Component>
    </ItemProvider>
  );
}

Item.displayName = 'Tree.Item';
