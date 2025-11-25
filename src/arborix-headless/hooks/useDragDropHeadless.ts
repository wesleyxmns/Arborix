import { useCallback, useEffect, useRef, useState } from 'react';
import type { TreeData, TreeNodeId } from '../types';
import {
  findNodeAndParent,
  removeNode,
  insertNode,
  isDescendantOf,
  cleanupEmptyParents,
} from '../utils/treeManipulation';

// ============================================================================
// Types
// ============================================================================

export type DropPosition = 'before' | 'after' | 'inside';

// ============================================================================
// Hook: useDragDropHeadless
// EXACT SAME LOGIC as v1.x useDragDrop hook
// ============================================================================

export const useDragDropHeadless = (
  data: TreeData,
  onUpdate: (newData: TreeData) => void
) => {
  const [activeId, setActiveId] = useState<TreeNodeId | null>(null);
  const [overId, setOverId] = useState<TreeNodeId | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  // Refs to store current values (avoid stale closures)
  const dataRef = useRef(data);
  const onUpdateRef = useRef(onUpdate);
  const activeIdRef = useRef<TreeNodeId | null>(null);
  const overIdRef = useRef<TreeNodeId | null>(null);
  const dropPositionRef = useRef<DropPosition | null>(null);

  // Sync refs with state
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    overIdRef.current = overId;
  }, [overId]);

  useEffect(() => {
    dropPositionRef.current = dropPosition;
  }, [dropPosition]);

  // ============================================================================
  // Handler: Drag Start
  // ============================================================================

  const handleDragStart = useCallback((e: React.DragEvent, id: TreeNodeId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    setActiveId(id);
    activeIdRef.current = id; // Sync update to avoid race condition
  }, []);

  // ============================================================================
  // Handler: Drag Over
  // EXACT SAME LOGIC as v1.x (lines 161-236)
  // ============================================================================

  const handleDragOver = useCallback((e: React.DragEvent, id: TreeNodeId) => {
    e.preventDefault();
    e.stopPropagation();

    // Use refs to get updated values
    const currentData = dataRef.current;
    const currentActiveId = activeIdRef.current;

    // Validations
    if (!currentActiveId) {
      return;
    }

    if (currentActiveId === id) {
      e.dataTransfer.dropEffect = 'none';
      setOverId(null);
      setDropPosition(null);
      return;
    }

    if (isDescendantOf(currentData, id, currentActiveId)) {
      e.dataTransfer.dropEffect = 'none';
      setOverId(null);
      setDropPosition(null);
      return;
    }

    e.dataTransfer.dropEffect = 'move';

    // Get node information
    const draggedInfo = findNodeAndParent(currentData, currentActiveId);
    const targetInfo = findNodeAndParent(currentData, id);

    if (!draggedInfo || !targetInfo) {
      return;
    }

    const isSiblingReorder = draggedInfo.parent?.id === targetInfo.parent?.id;
    const targetIsLeaf = !targetInfo.node.children || targetInfo.node.children.length === 0;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const rectTop = rect.top;
    const rectHeight = rect.height;
    const middle = rectTop + (rectHeight / 2);

    let pos: DropPosition;

    // Se for reordenação de irmãos E target for folha, só permite before/after
    // Se target for pasta, permite inside também
    if (isSiblingReorder && targetIsLeaf) {
      pos = mouseY < middle ? 'before' : 'after';
    } else {
      const y = mouseY - rectTop;
      // Zonas de drop: 25% topo (before), 50% meio (inside), 25% fundo (after)
      if (y < rectHeight * 0.25) {
        pos = 'before';
      } else if (y > rectHeight * 0.75) {
        pos = 'after';
      } else {
        pos = 'inside';
      }
    }

    const currentOverId = overIdRef.current;
    const currentDropPosition = dropPositionRef.current;

    if (currentOverId === id && currentDropPosition === pos) {
      return;
    }

    if (currentOverId !== id) {
      setOverId(id);
      overIdRef.current = id;
    }
    if (currentDropPosition !== pos) {
      setDropPosition(pos);
      dropPositionRef.current = pos;
    }

  }, []);

  // ============================================================================
  // Handler: Drop
  // EXACT SAME LOGIC as v1.x (lines 238-292)
  // ============================================================================

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentActiveId = activeIdRef.current;
    const currentOverId = overIdRef.current;
    const currentDropPosition = dropPositionRef.current;
    const currentData = dataRef.current;


    setActiveId(null);
    setOverId(null);
    setDropPosition(null);

    // Validations
    if (!currentActiveId || !currentOverId || !currentDropPosition) {
      return;
    }


    if (currentActiveId === currentOverId) {
      return;
    }


    if (currentOverId === '__root__') {
      // Handled by handleRootDrop
      return;
    }


    if (isDescendantOf(currentData, currentOverId, currentActiveId)) {
      return;
    }


    // Find the dragged node
    const draggedInfo = findNodeAndParent(currentData, currentActiveId);
    if (!draggedInfo) {
      return;
    }


    // 1. Remove from current position
    let dataAfterRemove = removeNode(currentData, currentActiveId);

    // 2. Clean up empty parents (convert to leaf)
    dataAfterRemove = cleanupEmptyParents(dataAfterRemove);

    // 3. Insert at new position
    const dataAfterInsert = insertNode(
      dataAfterRemove,
      draggedInfo.node,
      currentOverId,
      currentDropPosition
    );

    // 4. Update and commit to history
    onUpdateRef.current(dataAfterInsert);
  }, []); // CRITICAL: Empty array - handler is never recreated!

  // ============================================================================
  // Handler: Drag End
  // ============================================================================

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setDropPosition(null);
  }, []);

  // ============================================================================
  // Handler: Root Drag Over
  // EXACT SAME LOGIC as v1.x (lines 300-310)
  // ============================================================================

  const handleRootDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentActiveId = activeIdRef.current;
    if (currentActiveId) {
      e.dataTransfer.dropEffect = 'move';
      setOverId('__root__');
      setDropPosition('inside');
    }
  }, []); // CRITICAL: Empty array - handler is never recreated!

  // ============================================================================
  // Handler: Root Drop
  // EXACT SAME LOGIC as v1.x (lines 312-335)
  // ============================================================================

  const handleRootDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentActiveId = activeIdRef.current;
    const currentData = dataRef.current;

    // Reset state
    setActiveId(null);
    setOverId(null);
    setDropPosition(null);

    if (!currentActiveId) return;

    const draggedInfo = findNodeAndParent(currentData, currentActiveId);
    if (!draggedInfo) return;

    let dataAfterRemove = removeNode(currentData, currentActiveId);
    // Clean up empty parents after removal
    dataAfterRemove = cleanupEmptyParents(dataAfterRemove);
    const newData = [...dataAfterRemove, draggedInfo.node];

    onUpdateRef.current(newData);
  }, []); // CRITICAL: Empty array - handler is never recreated!

  return {
    activeId,
    overId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleRootDragOver,
    handleRootDrop,
  };
};
