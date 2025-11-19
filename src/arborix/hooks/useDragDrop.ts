// src/arborix/hooks/useDragDrop.ts
import { useCallback, useState } from 'react';
import type { DropPosition, TreeData, TreeNode, TreeNodeId } from '../types';

// ====================================================================
// FUNÇÕES AUXILIARES DE MANIPULAÇÃO DE ÁRVORE (IMUTÁVEL)
// ====================================================================

// Localiza um nó e seu array pai imediato
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

// ⚠️ Refatorada para ser imutável e pura (não altera 'nodes' diretamente)
const removeNode = (
  data: TreeData,
  nodeId: TreeNodeId
): { newData: TreeData; removedNode: TreeNode | null } => {
  let removedNode: TreeNode | null = null;

  const remove = (nodes: TreeData): TreeData => {
    return nodes.reduce<TreeData>((acc, node) => {
      if (node.id === nodeId) {
        removedNode = node;
        return acc; // Não inclui o nó na nova lista (remoção)
      }
      
      let newNode = { ...node }; // Cópia superficial do nó pai para imutabilidade
      if (node.children) {
        const newChildren = remove(node.children);
        
        // Se a lista de filhos mudou, atualiza.
        if (newChildren.length !== node.children.length || newChildren !== node.children) {
            newNode.children = newChildren;
        }

        // Se o array de filhos ficou vazio, remove a propriedade 'children'
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

// 🔑 Função Crítica: Insere o nó no novo local
const insertNode = (
  data: TreeData,
  targetId: TreeNodeId,
  nodeToInsert: TreeNode,
  position: DropPosition
): TreeData => {
  // Cria uma cópia profunda dos dados para manipular.
  // Isso é necessário porque 'immer' só é usado no useTreeState, não aqui.
  const newData = JSON.parse(JSON.stringify(data)) as TreeData;

  const targetInfo = findNodeAndParent(newData, targetId);

  if (!targetInfo) {
    // Retorna a cópia se o alvo não for encontrado
    return newData; 
  }

  const { node: targetNode, parentArray, index } = targetInfo;

  if (position === 'inside') {
    // 1. Drop INSIDE: Adiciona como filho (unshift para ser o primeiro)
    targetNode.children = targetNode.children || [];
    targetNode.children.unshift(nodeToInsert);
    // ⚠️ Se você tem um estado de 'openIds', talvez seja necessário garantir que o nó alvo está aberto
  } else {
    // 2. Drop BEFORE/AFTER: Adiciona como irmão no parentArray
    if (position === 'before') {
      parentArray.splice(index, 0, nodeToInsert);
    } else if (position === 'after') {
      parentArray.splice(index + 1, 0, nodeToInsert);
    }
  }

  return newData;
};


// Checa se o nó é descendente (função do seu snippet, mantida)
const isDescendantOf = (
  nodeId: TreeNodeId,
  potentialAncestorId: TreeNodeId,
  data: TreeData
): boolean => {
  // ... (Sua implementação de isDescendantOf)
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

// ====================================================================
// HOOK PRINCIPAL
// ====================================================================

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

  // Regra de Dropar: Mantida do seu snippet original
  const canDrop = useCallback((draggedId: TreeNodeId, targetId: TreeNodeId, data: TreeData): boolean => {
    // Não pode dropar em si mesmo
    if (draggedId === targetId) return false;

    // Não pode dropar pai dentro de filho (evitar ciclo)
    if (isDescendantOf(targetId, draggedId, data)) return false;

    return true;
  }, []);

  // 🔑 Lógica final do Drag & Drop: Corrigida para usar os helpers robustos
  const handleDragEnd = useCallback((data: TreeData, onUpdate: (newData: TreeData) => void) => {
    if (!activeId || !overId || !dropPosition) {
      handleDragCancel();
      return;
    }

    if (!canDrop(activeId, overId, data)) {
      handleDragCancel();
      return;
    }

    // 1. Remove o nó da posição original (Imutável)
    const { newData: intermediateData, removedNode } = removeNode(data, activeId);

    if (!removedNode) {
      handleDragCancel();
      return;
    }

    // 2. Insere na nova posição (Imutável)
    const finalData = insertNode(intermediateData, overId, removedNode, dropPosition);

    // 3. Atualiza o estado (useTreeState vai receber o novo array)
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