import { memo } from 'react';
import { useDragDropContext } from '../context/useDragDropContext';
import { cn } from '../utils/cn';

// ============================================================================
// RootDropZone Component
// Area at the bottom of the tree to drop nodes into the root level
// ============================================================================

export const RootDropZone = memo(() => {
  const dragDrop = useDragDropContext();

  // If drag & drop is disabled or no item is being dragged, don't render
  if (!dragDrop || !dragDrop.activeId) return null;

  const { overId, handleRootDragOver, handleRootDrop } = dragDrop;

  // Only show if handlers are available
  if (!handleRootDragOver || !handleRootDrop) return null;

  const isOver = overId === '__root__';

  return (
    <div
      onDragOver={handleRootDragOver}
      onDrop={handleRootDrop}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "mt-2 mx-1 p-4 border-2 border-dashed rounded-lg text-center text-sm transition-all duration-100",
        isOver
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-gray-300 text-gray-400 hover:border-gray-400"
      )}
    >
      Soltar aqui para mover para a raiz
    </div>
  );
});

RootDropZone.displayName = 'Tree.RootDropZone';
