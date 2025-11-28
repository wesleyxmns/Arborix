import { createContext, useContext } from 'react';
import type { TreeNodeId } from '../types';

// ============================================================================
// ItemContext - Provides nodeId to child components to avoid repetition
// ============================================================================

interface ItemContextValue {
  nodeId: TreeNodeId;
}

const ItemContext = createContext<ItemContextValue | null>(null);

export const ItemProvider = ItemContext.Provider;

/**
 * Hook to access the current item's nodeId from context
 * This allows child components (Trigger, Checkbox, Label, etc.) to avoid
 * having to pass nodeId repeatedly
 *
 * @returns nodeId from the nearest Tree.Item ancestor
 * @throws Error if used outside of Tree.Item
 */
export function useItemContext(): ItemContextValue {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error(
      'useItemContext must be used within a Tree.Item component. ' +
      'Make sure Tree.Trigger, Tree.Checkbox, Tree.Label, etc. are children of Tree.Item.'
    );
  }

  return context;
}

/**
 * Hook to optionally access item context
 * Returns null if not within Tree.Item (useful for optional context access)
 */
export function useOptionalItemContext(): ItemContextValue | null {
  return useContext(ItemContext);
}
