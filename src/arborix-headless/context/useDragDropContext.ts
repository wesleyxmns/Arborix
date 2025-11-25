import { useContext } from 'react';
import { DragDropContext } from './DragDropContext';
import type { DragDropContextValue } from '../types';

// ============================================================================
// Hook to access context
// ============================================================================

export function useDragDropContext(): DragDropContextValue | null {
  return useContext(DragDropContext);
}

export function useDragDrop(): DragDropContextValue {
  const context = useDragDropContext();

  if (!context) {
    throw new Error(
      'useDragDrop must be used within a DragDropProvider (Tree.Root with enableDragDrop)'
    );
  }

  return context;
}
