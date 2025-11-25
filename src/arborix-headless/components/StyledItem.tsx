import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { GripVertical, Folder, File, MoreVertical } from 'lucide-react';
import { useTreeContext } from '../context/TreeContext';
import { useDragDropContext } from '../context/useDragDropContext';
import { useVirtualizationContext } from '../context/VirtualizationContext';
import type { TreeItemProps, ItemRenderState } from '../types';
import { cn } from '../utils/cn';
import { defaultTheme } from '../utils/theme';
import { getContextMenuItems } from '../utils/menuUtils';
import { getVisibleFlatNodes } from '../utils/treeUtils';

// ============================================================================
// StyledItem Component - Item with v1.x default styling
// ============================================================================

interface StyledItemProps extends Omit<TreeItemProps, 'children'> {
  children?: ReactNode | ((state: ItemRenderState) => ReactNode);
  showGrip?: boolean;
  showIcon?: boolean;
  showContextMenuButton?: boolean;
  renderCustomContent?: (state: ItemRenderState) => ReactNode;
}

export function StyledItem({
  nodeId,
  children,
  showGrip = true,
  showIcon = true,
  showContextMenuButton = false,
  renderCustomContent,
  as: Component = 'div',
  className,
  style,
  onClick,
  onDoubleClick,
  onContextMenu,
}: StyledItemProps) {
  const tree = useTreeContext();
  const dragDrop = useDragDropContext();
  const virtualization = useVirtualizationContext();

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  // Calculate depth
  const depth = tree.getNodeDepth(nodeId);

  // Compute item state
  const state: ItemRenderState = useMemo(() => {
    const hasChildren = Array.isArray(node.children);
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
  const customClassName = typeof className === 'function'
    ? className(state)
    : className;

  // Merge default classes with custom
  const resolvedClassName = cn(
    defaultTheme.nodeBase,
    state.isSelected && !state.isDragging && defaultTheme.nodeSelected,
    !state.isSelected && !state.isDragging && defaultTheme.nodeHover,
    state.isDragging && defaultTheme.nodeDragging,
    state.isDropTarget && state.dropPosition === 'inside' && defaultTheme.nodeDropTarget,
    state.isCut && defaultTheme.nodeCut,
    state.isCut && defaultTheme.nodeCut,
    !state.isEditing && (dragDrop ? 'cursor-grab' : defaultTheme.nodeCursor),
    state.isEditing && 'cursor-text',
    'group', // For hover effects
    customClassName
  );

  // Resolve style (can be object or function)
  const customStyle: CSSProperties = typeof style === 'function'
    ? style(state)
    : style || {};

  const resolvedStyle: CSSProperties = {
    paddingLeft: `${depth * 24}px`,
    ...customStyle,
  };

  // Event handlers
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e, state);
    } else {
      // Default behavior: select node
      const multi = e.ctrlKey || e.metaKey;
      const range = e.shiftKey;

      // Get visible nodes for range selection
      let visibleNodes: any[] = [];
      if (virtualization?.flatData) {
        visibleNodes = virtualization.flatData.map(item => item.node.id);
      } else {
        // Fallback: Flatten visible nodes manually using utility
        visibleNodes = getVisibleFlatNodes(tree.state.data, tree.state.openIds);
      }

      tree.selectNode(nodeId, multi, range, visibleNodes);
      tree.setFocus(nodeId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;

    // Don't trigger if clicking on button, svg, or input
    if (
      target.tagName !== 'BUTTON' &&
      target.tagName !== 'svg' &&
      target.tagName !== 'INPUT' &&
      !target.closest('button')
    ) {
      if (onDoubleClick) {
        onDoubleClick(e, state);
      } else {
        // Default behavior: start editing or toggle
        if (!state.isEditing) {
          tree.startEditing(nodeId);
        } else if (state.hasChildren) {
          tree.toggleOpen(nodeId);
        }
      }
    }
  };



  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.stopPropagation();
      e.preventDefault();
      // Generate menu items using the utility
      const menuItems = getContextMenuItems({
        nodeId,
        data: tree.state.data,
        findNode: tree.findNode,
        findParent: tree.findParent,
        startEditing: tree.startEditing,
        duplicateNode: (ids: any) => tree.duplicateNode(Array.isArray(ids) ? ids[0] : ids),
        cutNode: (ids: any) => tree.cutNode(ids),
        copyNode: (ids: any) => tree.copyNode(ids),
        pasteNode: tree.pasteNode,
        addNode: tree.addNode,
        deleteNode: (ids: any) => tree.deleteNode(ids),
        clipboard: tree.clipboard ? {
          nodes: tree.clipboard.nodes,
          mode: tree.clipboard.type // Map type to mode
        } : null,
        options: tree.contextMenuOptions,
        customItems: tree.customContextMenuItems,
      });

      // Pass the generated items to the handler
      // The parent component (e.g. NodeRenderer) will handle showing the menu
      // We attach the items to the event object or pass them as a second argument
      // depending on how the parent expects it.
      // For now, we assume onContextMenu accepts (e, items)
      (onContextMenu as any)(e, menuItems);
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

  const indent = depth * 24;
  const showBefore = state.isDropTarget && state.dropPosition === 'before';
  const showAfter = state.isDropTarget && state.dropPosition === 'after';

  return (
    <div className="relative">
      {/* BEFORE indicator */}
      <div
        className={cn(
          defaultTheme.dropIndicatorBase,
          showBefore ? defaultTheme.dropIndicatorActive : defaultTheme.dropIndicatorInactive
        )}
        style={{ marginLeft: `${indent}px`, top: 0 }}
      />

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
        {/* Grip handle */}
        {showGrip && dragDrop && (
          <GripVertical
            className={cn(
              defaultTheme.gripIcon,
              state.isDragging && defaultTheme.gripIconActive
            )}
          />
        )}

        {/* Icon */}
        {showIcon && (
          state.hasChildren ? (
            tree.folderIcon ? <>{tree.folderIcon}</> : <Folder className={defaultTheme.folderIcon} />
          ) : (
            tree.fileIcon ? <>{tree.fileIcon}</> : <File className={defaultTheme.fileIcon} />
          )
        )}

        {/* Custom content or children */}
        {renderCustomContent ? (
          renderCustomContent(state)
        ) : typeof children === 'function' ? (
          children(state)
        ) : (
          children
        )}

        {/* Custom Action Buttons */}
        {tree.customActionButtons && tree.customActionButtons.length > 0 && (
          <div className="custom-action-buttons opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 ml-2">
            {tree.customActionButtons
              .filter(btn => !btn.visible || btn.visible(node))
              .map(btn => (
                <button
                  key={btn.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    btn.action(node);
                  }}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors",
                    btn.danger && "hover:bg-red-100 text-red-600"
                  )}
                  title={btn.tooltip}
                  aria-label={btn.tooltip || btn.id}
                >
                  {btn.icon}
                </button>
              ))}
          </div>
        )}

        {/* Context menu button */}
        {showContextMenuButton && onContextMenu && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e as any);
            }}
            className={defaultTheme.contextMenuButton}
            aria-label="More actions"
          >
            <MoreVertical className={defaultTheme.moreIcon} />
          </button>
        )}
      </Component>

      {/* AFTER indicator */}
      <div
        className={cn(
          defaultTheme.dropIndicatorBase,
          showAfter ? defaultTheme.dropIndicatorActive : defaultTheme.dropIndicatorInactive
        )}
        style={{ marginLeft: `${indent}px`, bottom: 0 }}
      />
    </div>
  );
}

StyledItem.displayName = 'Tree.StyledItem';
