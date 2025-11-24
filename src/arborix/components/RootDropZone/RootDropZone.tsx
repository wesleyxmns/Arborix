import { memo } from 'react';
import { useDragDrop } from '../../hooks/useDragDrop';
import { cn } from '../../utils/cn';

interface RootDropZoneProps {
  dragDrop: ReturnType<typeof useDragDrop>;
}

export const RootDropZone = memo(({ dragDrop }: RootDropZoneProps) => {
  const { activeId, overId, handleRootDragOver, handleRootDrop } = dragDrop;

  // Só mostra quando está arrastando algo
  if (!activeId) return null;

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

RootDropZone.displayName = 'RootDropZone';