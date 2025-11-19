import { useCallback, useState } from 'react';
import type { DropPosition, TreeData, TreeNode, TreeNodeId } from '../types';

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

// Remove um nó da árvore
const removeNode = (data: TreeData, nodeId: TreeNodeId): { newData: TreeData; removedNode: TreeNode | null } => {
  let removedNode: TreeNode | null = null;

  const remove = (nodes: TreeData): TreeData => {
    return nodes.filter(node => {
      if (node.id === nodeId) {
        removedNode = node;
        return false;
      }
      if (node.children) {
        node.children = remove(node.children);
      }
      return true;
    });
  };

  const newData = remove(JSON.parse(JSON.stringify(data)));
  return { newData, removedNode };
};

// Insere um nó na árvore
const insertNode = (
  data: TreeData,
  targetId: TreeNodeId,
  nodeToInsert: TreeNode,
  position: DropPosition
): TreeData => {
  const insert = (nodes: TreeData): TreeData => {
    const result: TreeData = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.id === targetId) {
        if (position === 'before') {
          result.push(nodeToInsert, node);
        } else if (position === 'after') {
          result.push(node, nodeToInsert);
        } else if (position === 'inside') {
          result.push({
            ...node,
            children: [...(node.children || []), nodeToInsert],
          });
        }
      } else {
        if (node.children) {
          result.push({
            ...node,
            children: insert(node.children),
          });
        } else {
          result.push(node);
        }
      }
    }

    return result;
  };

  return insert(data);
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

  const handleDragStart = useCallback((id: TreeNodeId) => {
    setActiveId(id);
  }, []);

  const handleDragOver = useCallback((id: TreeNodeId, position: DropPosition) => {
    setOverId(id);
    setDropPosition(position);
  }, []);

  const canDrop = useCallback((draggedId: TreeNodeId, targetId: TreeNodeId, data: TreeData): boolean => {
    // Não pode dropar em si mesmo
    if (draggedId === targetId) return false;

    // Não pode dropar pai dentro de filho (evitar ciclo)
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

    // Remove o nó da posição original
    const { newData, removedNode } = removeNode(data, activeId);

    if (!removedNode) {
      handleDragCancel();
      return;
    }

    // Insere na nova posição
    const finalData = insertNode(newData, overId, removedNode, dropPosition);

    onUpdate(finalData);
    handleDragCancel();
  }, [activeId, overId, dropPosition, canDrop]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setDropPosition(null);
  }, []);

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