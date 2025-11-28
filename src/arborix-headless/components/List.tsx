import { useMemo } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useVirtualizationContext } from '../context/VirtualizationContext';
import { useDragDropContext } from '../context/useDragDropContext';
import { getVisibleNodes } from '../utils/getVisibleNodes';
import type { TreeListProps } from '../types';

// ============================================================================
// List Component - Scrollable container for tree items
// ============================================================================

export function List({
  as: Component = 'div',
  className,
  style,
  children,
}: TreeListProps) {
  const tree = useTreeContext();
  const virtualization = useVirtualizationContext();
  const dragDrop = useDragDropContext();

  // Calculate visible nodes based on open state
  const visibleNodes = useMemo(() => {
    // If virtualization is enabled, use flatData from context
    if (virtualization) {
      return virtualization.flatData.map((item) => item.node.id);
    }

    // Otherwise, calculate visible nodes manually
    return getVisibleNodes(tree.state.data, tree.state.openIds);
  }, [tree.state.data, tree.state.openIds, virtualization]);

  // If virtualization is enabled, apply necessary styles
  const containerStyle = virtualization
    ? {
      ...style,
      overflow: 'auto',
      position: 'relative' as const,
    }
    : style;

  // Root drop zone handlers
  const handleDragOver = (e: React.DragEvent) => {
    if (dragDrop?.handleRootDragOver) {
      dragDrop.handleRootDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (dragDrop?.handleRootDrop) {
      dragDrop.handleRootDrop(e);
    }
  };

  // Render children with visibleNodes
  const content = typeof children === 'function'
    ? children({ visibleNodes })
    : children;

  return (
    <Component
      id="arborix-scroll-container"
      className={className}
      style={containerStyle}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {virtualization ? (
        <div style={{ height: virtualization.totalHeight, position: 'relative' }}>
          {content}
        </div>
      ) : (
        content
      )}
    </Component>
  );
}

List.displayName = 'Tree.List';
