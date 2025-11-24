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
      cutNodeIds: new Set<TreeNodeId>(),
      history: [initialData],
      historyIndex: 0,
    };

    if (persistenceKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`arborix-${persistenceKey}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Load persisted data if available, otherwise use initialData
          const persistedData = parsed.data || initialData;
          return {
            ...baseState,
            data: persistedData,
            openIds: new Set(parsed.openIds || []),
            selectedIds: new Set(parsed.selectedIds || []),
            checkedIds: new Set(parsed.checkedIds || []),
            history: [persistedData],
            historyIndex: 0,
          };
        }
      } catch (e) {
        // Silent fail - use initial data if persistence fails
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

    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const stateToSave = {
      data: state.data,
      openIds: Array.from(state.openIds),
      selectedIds: Array.from(state.selectedIds),
      checkedIds: Array.from(state.checkedIds),
    };

    try {
      localStorage.setItem(`arborix-${persistenceKey}`, JSON.stringify(stateToSave));
    } catch (e) {
      // Silent fail - localStorage may be unavailable
    }
  }, [state.data, state.openIds, state.selectedIds, state.checkedIds, persistenceKey]);

  const [editingNodeId, setEditingNodeId] = useState<TreeNodeId | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<TreeNodeId | null>(null);

  const setFocus = useCallback((id: TreeNodeId | null) => {
    setFocusedNodeId(id);
  }, []);

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

  const [lastSelectedId, setLastSelectedId] = useState<TreeNodeId | null>(null);

  const selectNode = useCallback((id: TreeNodeId, multi = false, range = false, visibleNodes: TreeNodeId[] = []) => {
    setState(prev => {
      let newSelectedIds: Set<TreeNodeId>;

      if (range && lastSelectedId && visibleNodes.length > 0) {
        const start = visibleNodes.indexOf(lastSelectedId);
        const end = visibleNodes.indexOf(id);

        if (start !== -1 && end !== -1) {
          const [lower, upper] = start < end ? [start, end] : [end, start];
          const rangeIds = visibleNodes.slice(lower, upper + 1);

          // Se for multi, adiciona ao que já existe. Se não, substitui.
          // Geralmente Shift+Click mantém a seleção anterior se Ctrl também estiver pressionado, 
          // mas o padrão mais comum é estender a seleção a partir do último.
          // Aqui vamos assumir que Shift estende a seleção atual.
          newSelectedIds = new Set(prev.selectedIds);
          rangeIds.forEach(rangeId => newSelectedIds.add(rangeId));
        } else {
          newSelectedIds = new Set([id]);
        }
      } else if (multi) {
        newSelectedIds = new Set(prev.selectedIds);
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      } else {
        newSelectedIds = new Set([id]);
      }

      return { ...prev, selectedIds: newSelectedIds };
    });

    // Atualiza o último selecionado apenas se não for uma deseleção em modo multi
    setLastSelectedId(id);
  }, [lastSelectedId]);

  const selectAllNodes = useCallback((allIds: TreeNodeId[]) => {
    setState(prev => ({
      ...prev,
      selectedIds: new Set(allIds),
    }));
    if (allIds.length > 0) {
      setLastSelectedId(allIds[allIds.length - 1]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIds: new Set(),
    }));
    setLastSelectedId(null);
  }, []);

  const setCutNodes = useCallback((ids: Set<TreeNodeId>) => {
    setState(prev => ({
      ...prev,
      cutNodeIds: ids,
    }));
  }, []);

  const clearCutNodes = useCallback(() => {
    setState(prev => ({
      ...prev,
      cutNodeIds: new Set(),
    }));
  }, []);

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
        return { checked: 0, total: totalNodes };
      } else if (totalChecked === totalNodes) {
        checkedIds.add(node.id);
        return { checked: totalNodes, total: totalNodes };
      } else {
        partialCheckedIds.add(node.id);
        return { checked: totalChecked, total: totalNodes };
      }
    };

    for (const node of data) {
      checkChildren(node);
    }

    return { checkedIds, partialCheckedIds };
  }, []);

  const toggleCheck = useCallback((id: TreeNodeId) => {
    setState(prev => {
      const node = findNode(prev.data, id);
      if (!node) return prev;

      const newCheckedIds = new Set(prev.checkedIds);
      const isCurrentlyChecked = newCheckedIds.has(id);

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

      toggleDescendants(node, !isCurrentlyChecked);

      const { checkedIds: updatedChecked, partialCheckedIds } = updateCheckStates(prev.data, newCheckedIds);

      return {
        ...prev,
        checkedIds: updatedChecked,
        partialCheckedIds,
      };
    });
  }, [findNode, updateCheckStates]);

  const getCheckState = useCallback((id: TreeNodeId): 'checked' | 'unchecked' | 'indeterminate' => {
    if (state.checkedIds.has(id)) return 'checked';
    if (state.partialCheckedIds.has(id)) return 'indeterminate';
    return 'unchecked';
  }, [state.checkedIds, state.partialCheckedIds]);

  const setData = useCallback((newData: TreeData) => {
    setState(prev => ({ ...prev, data: newData }));
  }, []);

  const startEditing = useCallback((id: TreeNodeId) => {
    setEditingNodeId(id);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingNodeId(null);
  }, []);

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
        const node = findNode(draft, id);
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
          node.isLoading = false;
        }
      });
      return { ...prev, data: newData };
    });
    commit();
  }, [findNode, commit]);

  const addNode = useCallback((parentId: TreeNodeId | null, label: string) => {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      label,
      children: [],
    };

    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        if (parentId === null) {
          draft.push(newNode);
        } else {
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

      const newOpenIds = new Set(prev.openIds);
      if (parentId !== null) {
        newOpenIds.add(parentId);
      }

      return { ...prev, data: newData, openIds: newOpenIds };
    });

    commit();
    return newNode.id;
  }, [commit]);

  const insertNode = useCallback((parentId: TreeNodeId | null, node: TreeNode) => {
    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        if (parentId === null) {
          draft.push(node);
        } else {
          const addToNode = (nodes: TreeNode[]): boolean => {
            for (const n of nodes) {
              if (n.id === parentId) {
                if (!n.children) n.children = [];
                n.children.push(node);
                return true;
              }
              if (n.children && addToNode(n.children)) {
                return true;
              }
            }
            return false;
          };
          addToNode(draft);
        }
      });

      const newOpenIds = new Set(prev.openIds);
      if (parentId !== null) {
        newOpenIds.add(parentId);
      }

      return { ...prev, data: newData, openIds: newOpenIds };
    });
    commit();
  }, [commit]);

  const deleteNode = useCallback((ids: TreeNodeId | TreeNodeId[]) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    if (idList.length === 0) return;

    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const removeNodes = (nodes: TreeNode[]) => {
          for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (idList.includes(node.id)) {
              nodes.splice(i, 1);
            } else if (node.children) {
              removeNodes(node.children);
            }
          }
        };

        removeNodes(draft);
      });

      const newSelectedIds = new Set(prev.selectedIds);
      const newCheckedIds = new Set(prev.checkedIds);
      const newPartialCheckedIds = new Set(prev.partialCheckedIds);
      const newOpenIds = new Set(prev.openIds);

      idList.forEach(id => {
        newSelectedIds.delete(id);
        newCheckedIds.delete(id);
        newPartialCheckedIds.delete(id);
        newOpenIds.delete(id);
      });

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

  const duplicateNode = useCallback((ids: TreeNodeId | TreeNodeId[]) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    if (idList.length === 0) return;

    setState(prev => {
      const newData = produce(prev.data, (draft) => {
        const deepClone = (n: TreeNode): TreeNode => ({
          ...n,
          id: `${n.id}-copy-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          children: n.children?.map(deepClone),
        });

        const processNodes = (nodes: TreeNode[]) => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (idList.includes(node.id)) {
              const clonedNode = deepClone(node);
              nodes.splice(i + 1, 0, clonedNode);
              i++; // Skip the newly added node
            }
            if (node.children) {
              processNodes(node.children);
            }
          }
        };

        processNodes(draft);
      });

      return { ...prev, data: newData };
    });

    commit();
  }, [commit]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  useEffect(() => {
    if (options.emitter) {
      options.emitter.emit('state:change', state);
    }
  }, [state, options.emitter]);

  return {
    state,
    focusedNodeId,
    setFocus,
    toggleOpen,
    selectNode,
    selectAllNodes,
    clearSelection,
    setCutNodes,
    clearCutNodes,
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
    insertNode,
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