import { createContext, type ReactNode } from 'react';
import { useDragDropHeadless } from '../hooks/useDragDropHeadless';
import type { DragDropContextValue, TreeData } from '../types';

// ============================================================================
// Context
// ============================================================================

export const DragDropContext = createContext<DragDropContextValue | null>(null);


// ============================================================================
// Provider Props
// ============================================================================

export interface DragDropProviderProps {
  data: TreeData;
  onDataChange: (data: TreeData) => void;
  children: ReactNode;
}

// ============================================================================
// Provider Component
// ============================================================================

export function DragDropProvider({
  data,
  onDataChange,
  children,
}: DragDropProviderProps) {
  // Use the new headless drag & drop hook (no v1.x dependency)
  const dragDropHook = useDragDropHeadless(data, onDataChange);

  const {
    activeId,
    overId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = dragDropHook;

  const contextValue: DragDropContextValue = {
    activeId,
    overId,
    dropPosition,
    isDragging: activeId !== null,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleRootDragOver: dragDropHook.handleRootDragOver,
    handleRootDrop: dragDropHook.handleRootDrop,
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
}

