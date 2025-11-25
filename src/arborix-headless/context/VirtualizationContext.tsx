import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useVirtualTree } from '../../arborix/virtual/useVirtualTree';
import { flattenVisibleTree } from '../utils/flattenTree';
import type { VirtualizationContextValue, TreeData, TreeNodeId, FlatNode } from '../types';

// ============================================================================
// Context
// ============================================================================

const VirtualizationContext = createContext<VirtualizationContextValue | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface VirtualizationProviderProps {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  rowHeight?: number;
  overscan?: number;
  searchResults?: Set<TreeNodeId>;
  children: ReactNode;
}

// ============================================================================
// Provider Component
// ============================================================================

export function VirtualizationProvider({
  data,
  openIds,
  rowHeight = 32,
  searchResults,
  children,
}: VirtualizationProviderProps) {
  // Flatten tree for virtualization
  const flatData: FlatNode[] = useMemo(() => {
    return flattenVisibleTree(data, openIds);
  }, [data, openIds]);
 
  // Use the existing virtualization hook from v1.x
  const virtualHook = useVirtualTree({
    data,
    openIds,
    rowHeight,
    searchResults,
  });

  const { virtualRows, totalHeight, virtualizer } = virtualHook;

  // Scroll to specific node
  const scrollToNode = (id: TreeNodeId) => {
    const index = flatData.findIndex(item => item.node.id === id);
    if (index !== -1 && virtualizer) {
      virtualizer.scrollToIndex(index, { align: 'center', behavior: 'smooth' });
    }
  };

  const contextValue: VirtualizationContextValue = {
    flatData,
    totalHeight,
    virtualRows,
    virtualizer,
    scrollToNode,
  };

  return (
    <VirtualizationContext.Provider value={contextValue}>
      {children}
    </VirtualizationContext.Provider>
  );
}

// ============================================================================
// Hook to access context
// ============================================================================

export function useVirtualizationContext(): VirtualizationContextValue | null {
  return useContext(VirtualizationContext);
}

export function useVirtualization(): VirtualizationContextValue {
  const context = useVirtualizationContext();

  if (!context) {
    throw new Error(
      'useVirtualization must be used within a VirtualizationProvider'
    );
  }

  return context;
}
