import { useCallback, useState } from 'react';
import type { DropPosition, TreeData, TreeNode, TreeNodeId } from '../types';

const findNodeAndParent = (
  nodes: TreeData,
  id: TreeNodeId
): { node: TreeNode; parentArray: TreeData; index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return { node, parentArray: nodes, index: i };
    }
    if (node.children) {
      const found = findNodeAndParent(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const removeNode = (
  data: TreeData,
  nodeId: TreeNodeId
): { newData: TreeData; removedNode: TreeNode | null } => {
  let removedNode: TreeNode | null = null;

  const remove = (nodes: TreeData): TreeData => {
    return nodes.reduce<TreeData>((acc, node) => {
      if (node.id === nodeId) {
        removedNode = node;
        return acc;
      }

      let newNode = { ...node };
      if (node.children) {
        const newChildren = remove(node.children);

        if (newChildren.length !== node.children.length || newChildren !== node.children) {
          newNode.children = newChildren;
        }

        if (newNode.children?.length === 0) {
          delete newNode.children;
        }
      }

      acc.push(newNode);
      return acc;
    }, []);
  };

  const newData = remove(data);
  return { newData, removedNode };
};

const insertNode = (
  data: TreeData,
  targetId: TreeNodeId,
  nodeToInsert: TreeNode,
  position: DropPosition
): TreeData => {
  const deepClone = <T,>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone) as T;

    const cloned = { ...obj } as any;
    for (const key in cloned) {
      cloned[key] = deepClone(cloned[key]);
    }
    return cloned;
  };

  const newData = deepClone(data);
  const targetInfo = findNodeAndParent(newData, targetId);

  if (!targetInfo) return newData;

  const { node: targetNode, parentArray, index } = targetInfo;

  if (position === 'inside') {
    targetNode.children = targetNode.children || [];
    targetNode.children.unshift(nodeToInsert);

    if (targetNode.isLeaf) targetNode.isLeaf = false;
  } else {
    if (position === 'before') {
      parentArray.splice(index, 0, nodeToInsert);
    } else if (position === 'after') {
      parentArray.splice(index + 1, 0, nodeToInsert);
    }
  }

  return newData;
};

const isDescendantOf = (
  nodeId: TreeNodeId,
  potentialAncestorId: TreeNodeId,
  data: TreeData
): boolean => {
  const findNode = (nodes: TreeData, id: TreeNodeId): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const checkDescendants = (node: TreeNode): boolean => {
    if (node.id === potentialAncestorId) return true;
    if (node.children) {
      return node.children.some(child => checkDescendants(child));
    }
    return false;
  };

  const startNode = findNode(data, nodeId);
  return startNode ? checkDescendants(startNode) : false;
};

export interface UseDragDropResult {
  activeId: TreeNodeId | null;
  overId: TreeNodeId | null;
  dropPosition: DropPosition | null;
  handleDragStart: (id: TreeNodeId) => void;
  handleDragOver: (id: TreeNodeId, position: DropPosition) => void;
  handleDragEnd: (data: TreeData, onUpdate: (newData: TreeData) => void) => void;
  handleDragCancel: () => void;
  canDrop: (draggedId: TreeNodeId, targetId: TreeNodeId, data: TreeData) => boolean;
}

export const useDragDrop = (): UseDragDropResult => {
  const [activeId, setActiveId] = useState<TreeNodeId | null>(null);
  const [overId, setOverId] = useState<TreeNodeId | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setDropPosition(null);
  }, []);

  const handleDragStart = useCallback((id: TreeNodeId) => {
    setActiveId(id);
  }, []);

  const handleDragOver = useCallback((id: TreeNodeId, position: DropPosition) => {
    setOverId(id);
    setDropPosition(position);
  }, []);

  const canDrop = useCallback((draggedId: TreeNodeId, targetId: TreeNodeId, data: TreeData): boolean => {
    if (draggedId === targetId) return false;

    if (isDescendantOf(targetId, draggedId, data)) return false;

    return true;
  }, []);

  const handleDragEnd = useCallback((data: TreeData, onUpdate: (newData: TreeData) => void) => {
    if (!activeId || !overId || !dropPosition) {
      handleDragCancel();
      return;
    }

    if (!canDrop(activeId, overId, data)) {
      handleDragCancel();
      return;
    }

    const { newData: intermediateData, removedNode } = removeNode(data, activeId);

    if (!removedNode) {
      handleDragCancel();
      return;
    }

    const finalData = insertNode(intermediateData, overId, removedNode, dropPosition);

    onUpdate(finalData);
    handleDragCancel();
  }, [activeId, overId, dropPosition, canDrop, handleDragCancel]);

  return {
    activeId,
    overId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    canDrop,
  };
};