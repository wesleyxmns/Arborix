// src/arborix/virtual/useVirtualTree.ts
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo } from 'react';
import { flattenVisibleTree, type VisibleNode } from '../utils/flattenTree';
import type { TreeData, TreeNodeId } from '../types';

interface UseVirtualTreeProps {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  searchResults?: Set<TreeNodeId>;
  rowHeight?: number;
}

export const useVirtualTree = ({
  data,
  openIds,
  searchResults,
  rowHeight = 32,
}: UseVirtualTreeProps) => {
  const flatData: VisibleNode[] = useMemo(() => {
    return flattenVisibleTree(data, openIds, searchResults);
  }, [data, openIds, searchResults]);

  const virtualizer = useVirtualizer({
    count: flatData.length,
    getScrollElement: () => document.getElementById('arborix-scroll-container'),
    estimateSize: () => rowHeight,
    overscan: 15,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return {
    flatData,
    virtualizer,
    virtualRows,
    totalHeight: virtualizer.getTotalSize(),
  };
};