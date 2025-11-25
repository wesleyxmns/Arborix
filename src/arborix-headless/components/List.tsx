import { useVirtualizationContext } from '../context/VirtualizationContext';
import { useDragDropContext } from '../context/useDragDropContext';
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
  const virtualization = useVirtualizationContext();
  const dragDrop = useDragDropContext();

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
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}

List.displayName = 'Tree.List';
