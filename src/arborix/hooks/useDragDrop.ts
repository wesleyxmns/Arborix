import { useCallback, useEffect, useRef, useState } from 'react';
import { TreeData, TreeNode, TreeNodeId } from '../types';

export type DropPosition = 'before' | 'after' | 'inside';



const findNodeAndParent = (
  data: TreeData,
  targetId: TreeNodeId,
  parent: TreeNode | null = null
): { node: TreeNode; parent: TreeNode | null } | null => {
  for (const node of data) {
    if (node.id === targetId) return { node, parent };
    if (node.children) {
      const result = findNodeAndParent(node.children, targetId, node);
      if (result) return result;
    }
  }
  return null;
};

const removeNode = (data: TreeData, nodeId: TreeNodeId): TreeData => {
  const result: TreeData = [];

  for (const node of data) {
    if (node.id === nodeId) continue;

    if (node.children) {
      const newChildren = removeNode(node.children, nodeId);
      result.push({ ...node, children: newChildren });
    } else {
      result.push(node);
    }
  }

  return result;
};

const insertNode = (
  data: TreeData,
  nodeToInsert: TreeNode,
  targetId: TreeNodeId,
  position: DropPosition
): TreeData => {
  const result: TreeData = [];

  for (const current of data) {
    if (current.id === targetId) {
      if (position === 'before') {
        result.push(nodeToInsert);
        result.push(current);
      } else if (position === 'after') {
        result.push(current);
        result.push(nodeToInsert);
      } else {
        result.push({
          ...current,
          children: [...(current.children || []), nodeToInsert],
        });
      }
    } else if (current.children) {
      const newChildren = insertNode(current.children, nodeToInsert, targetId, position);
      result.push({ ...current, children: newChildren });
    } else {
      result.push(current);
    }
  }

  return result;
};

const isDescendantOf = (
  data: TreeData,
  nodeId: TreeNodeId,
  ancestorId: TreeNodeId
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

  const hasDescendant = (node: TreeNode | null, targetId: TreeNodeId): boolean => {
    if (!node?.children) return false;
    for (const child of node.children) {
      if (child.id === targetId) return true;
      if (hasDescendant(child, targetId)) return true;
    }
    return false;
  };

  const ancestor = findNode(data, ancestorId);
  return hasDescendant(ancestor, nodeId);
};

const cleanupEmptyParents = (data: TreeData): TreeData => {
  return data.map(node => {
    if (node.children) {
      const cleanedChildren = cleanupEmptyParents(node.children);
      if (cleanedChildren.length === 0) {
        const { children, ...rest } = node;
        return rest as TreeNode;
      }
      return { ...node, children: cleanedChildren };
    }
    return node;
  });
};



export const useDragDrop = (
  data: TreeData,
  onUpdate: (newData: TreeData) => void
) => {
  const [activeId, setActiveId] = useState<TreeNodeId | null>(null);
  const [overId, setOverId] = useState<TreeNodeId | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  const dataRef = useRef(data);
  const onUpdateRef = useRef(onUpdate);

  const activeIdRef = useRef<TreeNodeId | null>(null);
  const overIdRef = useRef<TreeNodeId | null>(null);
  const dropPositionRef = useRef<DropPosition | null>(null);

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

  const handleDragStart = useCallback((e: React.DragEvent, id: TreeNodeId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    setActiveId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: TreeNodeId) => {
    e.preventDefault();
    e.stopPropagation();

    // Usa refs para pegar valores atualizados
    const currentData = dataRef.current;
    const currentActiveId = activeIdRef.current;

    // Validações
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

    // Obtém informações dos nodes
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

    if (isSiblingReorder && !targetIsLeaf) {
      pos = mouseY < middle ? 'before' : 'after';
    } else {
      const y = mouseY - rectTop;
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
    }
    if (currentDropPosition !== pos) {
      setDropPosition(pos);
    }
  }, []);

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

    // Validações
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

    // Encontra o nó sendo arrastado
    const draggedInfo = findNodeAndParent(currentData, currentActiveId);
    if (!draggedInfo) {
      return;
    }

    // 1. Remove da posição atual
    let dataAfterRemove = removeNode(currentData, currentActiveId);

    // 2. Limpa parents vazios (converte para leaf)
    dataAfterRemove = cleanupEmptyParents(dataAfterRemove);

    // 3. Insere na nova posição
    const dataAfterInsert = insertNode(
      dataAfterRemove,
      draggedInfo.node,
      currentOverId,
      currentDropPosition
    );

    // 4. Atualiza e faz commit para histórico
    onUpdateRef.current(dataAfterInsert);
  }, []); // CRÍTICO: Array vazio - handler nunca é recriado!

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setDropPosition(null);
  }, []);

  const handleRootDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentActiveId = activeIdRef.current;
    if (currentActiveId) {
      e.dataTransfer.dropEffect = 'move';
      setOverId('__root__');
      setDropPosition('inside');
    }
  }, []); // CRÍTICO: Array vazio - handler nunca é recriado!

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
    // Limpa parents vazios após remover
    dataAfterRemove = cleanupEmptyParents(dataAfterRemove);
    const newData = [...dataAfterRemove, draggedInfo.node];

    onUpdateRef.current(newData);
  }, []); // CRÍTICO: Array vazio - handler nunca é recriado!

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