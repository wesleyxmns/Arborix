import EventEmitter from 'eventemitter3';
import { Draft, produce } from 'immer';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TreeData, TreeNode, TreeNodeId, TreeState } from '../types';

const MAX_HISTORY = 50;

export interface UseTreeStateOptions {
  persistenceKey?: string;
  emitter?: EventEmitter;
}

export const useTreeState = (initialData: TreeData, options: UseTreeStateOptions = {}) => {
  const { persistenceKey } = options;
  const isInitialized = useRef<boolean>(false);

  const getInitialState = (): TreeState => {
    const baseState: TreeState = {
      data: initialData,
      openIds: new Set<TreeNodeId>(),
      selectedIds: new Set<TreeNodeId>(),
      checkedIds: new Set<TreeNodeId>(),
      partialCheckedIds: new Set<TreeNodeId>(),
      history: [initialData],
      historyIndex: 0,
    };

    if (persistenceKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`arborix-${persistenceKey}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...baseState,
            // Recupera os Sets a partir dos arrays salvos
            openIds: new Set(parsed.openIds || []),
            selectedIds: new Set(parsed.selectedIds || []),
            checkedIds: new Set(parsed.checkedIds || []),
            // Não persistimos histórico ou partialCheckedIds (recalculados)
          };
        }
      } catch (e) {
        console.warn('Arborix: Falha ao carregar estado persistido', e);
      }
    }

    return baseState;
  };

  const updateState = useCallback((updater: (draft: Draft<TreeState>) => void) => {
    setState(prev => produce(prev, updater));
  }, []);

  const [state, setState] = useState<TreeState>(getInitialState);

  const getState = useCallback(() => state, [state]);

  useEffect(() => {
    if (!persistenceKey) return;

    // CORREÇÃO: Se for a primeira renderização, apenas marcamos como inicializado e retornamos.
    // Isso evita gravar no localStorage o mesmo dado que acabamos de ler dele.
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const stateToSave = {
      openIds: Array.from(state.openIds),
      selectedIds: Array.from(state.selectedIds),
      checkedIds: Array.from(state.checkedIds),
    };

    try {
      localStorage.setItem(`arborix-${persistenceKey}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Arborix: Falha ao salvar estado', e);
    }
  }, [state.openIds, state.selectedIds, state.checkedIds, persistenceKey]);

  const [editingNodeId, setEditingNodeId] = useState<TreeNodeId | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<TreeNodeId | null>(null);

  const setFocus = useCallback((id: TreeNodeId | null) => {
    setFocusedNodeId(id);
  }, []);

  // Função auxiliar para encontrar nó
  const findNode = useCallback((data: TreeData, id: TreeNodeId): TreeNode | null => {
    for (const node of data) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Função auxiliar para encontrar pai
  const findParent = useCallback((data: TreeData, id: TreeNodeId, parent: TreeNode | null = null): TreeNode | null => {
    for (const node of data) {
      if (node.id === id) return parent;
      if (node.children) {
        const found = findParent(node.children, id, node);
        if (found !== null) return found;
      }
    }
    return null;
  }, []);

  // Commit para histórico
  const commit = useCallback(() => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(prev.data);

      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Undo
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          data: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          data: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1,
        };
      }
      return prev;
    });
  }, []);

  // Toggle Open
  const toggleOpen = useCallback((id: TreeNodeId) => {
    setState(prev => {
      const newOpenIds = new Set(prev.openIds);
      if (newOpenIds.has(id)) {
        newOpenIds.delete(id);
      } else {
        newOpenIds.add(id);
      }
      return { ...prev, openIds: newOpenIds };
    });
  }, []);

  // Select Node
  const selectNode = useCallback((id: TreeNodeId, clearOthers = false) => {
    setState(prev => {
      const newSelectedIds = clearOthers ? new Set([id]) : new Set(prev.selectedIds);
      if (!clearOthers) {
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      }
      return { ...prev, selectedIds: newSelectedIds };
    });
  }, []);

  // Update check states (tri-state)
  const updateCheckStates = useCallback((data: TreeData, checkedIds: Set<TreeNodeId>) => {
    const partialCheckedIds = new Set<TreeNodeId>();

    const checkChildren = (node: TreeNode): { checked: number; total: number } => {
      if (!node.children || node.children.length === 0) {
        return { checked: checkedIds.has(node.id) ? 1 : 0, total: 1 };
      }

      let totalChecked = 0;
      let totalNodes = 0;

      for (const child of node.children) {
        const result = checkChildren(child);
        totalChecked += result.checked;
        totalNodes += result.total;
      }

      if (totalChecked === 0) {
        // Nenhum filho marcado
        return { checked: 0, total: totalNodes };
      } else if (totalChecked === totalNodes) {
        // Todos os filhos marcados
        checkedIds.add(node.id);
        return { checked: totalNodes, total: totalNodes };
      } else {
        // Alguns filhos marcados (parcial)
        partialCheckedIds.add(node.id);
        return { checked: totalChecked, total: totalNodes };
      }
    };

    for (const node of data) {
      checkChildren(node);
    }

    return { checkedIds, partialCheckedIds };
  }, []);

  // Toggle Check (tri-state)
  const toggleCheck = useCallback((id: TreeNodeId) => {
    setState(prev => {
      const node = findNode(prev.data, id);
      if (!node) return prev;

      const newCheckedIds = new Set(prev.checkedIds);
      const isCurrentlyChecked = newCheckedIds.has(id);

      // Função para marcar/desmarcar todos os descendentes
      const toggleDescendants = (n: TreeNode, checked: boolean) => {
        if (checked) {
          newCheckedIds.add(n.id);
        } else {
          newCheckedIds.delete(n.id);
        }

        if (n.children) {
          for (const child of n.children) {
            toggleDescendants(child, checked);
          }
        }
      };

      // Toggle o nó atual e todos os seus descendentes
      toggleDescendants(node, !isCurrentlyChecked);

      // Recalcula estados parciais
      const { checkedIds: updatedChecked, partialCheckedIds } = updateCheckStates(prev.data, newCheckedIds);

      return {
        ...prev,
        checkedIds: updatedChecked,
        partialCheckedIds,
      };
    });
  }, [findNode, updateCheckStates]);

  // Get Check State
  const getCheckState = useCallback((id: TreeNodeId): 'checked' | 'unchecked' | 'indeterminate' => {
    if (state.checkedIds.has(id)) return 'checked';
    if (state.partialCheckedIds.has(id)) return 'indeterminate';
    return 'unchecked';
  }, [state.checkedIds, state.partialCheckedIds]);

  // Set Data
  const setData = useCallback((newData: TreeData) => {
    setState(prev => ({ ...prev, data: newData }));
  }, []);

  // **NOVA FUNCIONALIDADE: Edição Inline**

  // Iniciar edição
  const startEditing = useCallback((id: TreeNodeId) => {
    setEditingNodeId(id);
  }, []);

  // Cancelar edição
  const cancelEditing = useCallback(() => {
    setEditingNodeId(null);
  }, []);

  // Salvar edição
  const saveEdit = useCallback((id: TreeNodeId, newLabel: string) => {
    if (!newLabel.trim()) {
      cancelEditing();
      return;
    }

    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const updateNode = (nodes: TreeNode[]): boolean => {
          for (const node of nodes) {
            if (node.id === id) {
              node.label = newLabel.trim();
              return true;
            }
            if (node.children && updateNode(node.children)) {
              return true;
            }
          }
          return false;
        };

        updateNode(draft);
      });

      return { ...prev, data: newData };
    });

    setEditingNodeId(null);
    commit();
  }, [cancelEditing, commit]);

  const setNodeLoading = useCallback((id: TreeNodeId, isLoading: boolean) => {
    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const node = findNode(draft, id); // Reutilizando seu findNode interno
        if (node) {
          node.isLoading = isLoading;
        }
      });
      return { ...prev, data: newData };
    });
  }, [findNode]);

  const setNodeChildren = useCallback((parentId: TreeNodeId, children: TreeNode[]) => {
    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const node = findNode(draft, parentId);
        if (node) {
          node.children = children;
          node.isLoading = false; // Garante que pare o loading
          // Se não tinha children array, agora tem
        }
      });
      // Mantém histórico se necessário, ou commita
      return { ...prev, data: newData };
    });
    commit(); // Salva no histórico para permitir Undo do carregamento
  }, [findNode, commit]);

  // Adicionar nó
  const addNode = useCallback((parentId: TreeNodeId | null, label: string) => {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      label,
      children: [],
    };

    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        if (parentId === null) {
          // Adicionar na raiz
          draft.push(newNode);
        } else {
          // Adicionar como filho
          const addToNode = (nodes: TreeNode[]): boolean => {
            for (const node of nodes) {
              if (node.id === parentId) {
                if (!node.children) {
                  node.children = [];
                }
                node.children.push(newNode);
                return true;
              }
              if (node.children && addToNode(node.children)) {
                return true;
              }
            }
            return false;
          };

          addToNode(draft);
        }
      });

      // Auto-expandir o pai se necessário
      const newOpenIds = new Set(prev.openIds);
      if (parentId !== null) {
        newOpenIds.add(parentId);
      }

      return { ...prev, data: newData, openIds: newOpenIds };
    });

    commit();
    return newNode.id;
  }, [commit]);

  // Deletar nó
  const deleteNode = useCallback((id: TreeNodeId) => {
    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const removeNode = (nodes: TreeNode[]): boolean => {
          const index = nodes.findIndex(n => n.id === id);
          if (index !== -1) {
            nodes.splice(index, 1);
            return true;
          }

          for (const node of nodes) {
            if (node.children && removeNode(node.children)) {
              return true;
            }
          }
          return false;
        };

        removeNode(draft);
      });

      // Limpar estados relacionados
      const newSelectedIds = new Set(prev.selectedIds);
      const newCheckedIds = new Set(prev.checkedIds);
      const newPartialCheckedIds = new Set(prev.partialCheckedIds);
      const newOpenIds = new Set(prev.openIds);

      newSelectedIds.delete(id);
      newCheckedIds.delete(id);
      newPartialCheckedIds.delete(id);
      newOpenIds.delete(id);

      return {
        ...prev,
        data: newData,
        selectedIds: newSelectedIds,
        checkedIds: newCheckedIds,
        partialCheckedIds: newPartialCheckedIds,
        openIds: newOpenIds,
      };
    });

    commit();
  }, [commit]);

  // Duplicar nó
  const duplicateNode = useCallback((id: TreeNodeId) => {
    setState(prev => {
      const node = findNode(prev.data, id);
      if (!node) return prev;

      const parent = findParent(prev.data, id);

      const deepClone = (n: TreeNode): TreeNode => ({
        ...n,
        id: `${n.id}-copy-${Date.now()}`,
        children: n.children?.map(deepClone),
      });

      const clonedNode = deepClone(node);

      const newData = produce(prev.data, (draft) => {
        if (parent === null) {
          // Adicionar na raiz
          const index = draft.findIndex(n => n.id === id);
          draft.splice(index + 1, 0, clonedNode);
        } else {
          // Adicionar como irmão
          const addSibling = (nodes: TreeNode[]): boolean => {
            for (const n of nodes) {
              if (n.children) {
                const index = n.children.findIndex(child => child.id === id);
                if (index !== -1) {
                  n.children.splice(index + 1, 0, clonedNode);
                  return true;
                }
                if (addSibling(n.children)) {
                  return true;
                }
              }
            }
            return false;
          };

          addSibling(draft);
        }
      });

      return { ...prev, data: newData };
    });

    commit();
  }, [findNode, findParent, commit]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  useEffect(() => {
    if (options.emitter) {
      // Emite o estado atual (imutável) sempre que ele muda
      options.emitter.emit('state:change', state);
    }
  }, [state, options.emitter]);

  return {
    state,
    focusedNodeId,
    setFocus,
    toggleOpen,
    selectNode,
    toggleCheck,
    getCheckState,
    setData,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    editingNodeId,
    startEditing,
    cancelEditing,
    saveEdit,
    addNode,
    deleteNode,
    duplicateNode,
    findNode,
    findParent,
    setNodeLoading,
    setNodeChildren,
    getState,
    updateState,
  };
};