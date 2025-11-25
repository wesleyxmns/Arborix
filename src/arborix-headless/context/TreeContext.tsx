import EventEmitter from 'eventemitter3';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useTreeClipboard } from '../../arborix/hooks/useTreeClipboard';
import { useTreeState } from '../../arborix/hooks/useTreeState';
import type { ContextMenuItem, ContextMenuOptions, TreeAction, TreeContextValue, TreeData, TreeNode, TreeNodeId, CustomActionButton } from '../types';
import { cloneNode } from '../utils/treeUtils';

// ============================================================================
// Context
// ============================================================================

const TreeContext = createContext<TreeContextValue | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface TreeProviderProps {
  data: TreeData;
  onDataChange?: (data: TreeData) => void;
  persistenceKey?: string;
  onLoadData?: (node: any) => Promise<any[] | void>;
  children: ReactNode;
  selectionMode?: 'none' | 'single' | 'multiple';
  checkMode?: 'independent' | 'tri-state';
  defaultOpenIds?: TreeNodeId[];
  defaultSelectedIds?: TreeNodeId[];
  defaultCheckedIds?: TreeNodeId[];
  contextMenuOptions?: ContextMenuOptions;
  customContextMenuItems?: (node: TreeNode) => ContextMenuItem[];
  onAction?: (action: TreeAction) => void;
  folderIcon?: ReactNode;
  fileIcon?: ReactNode;
  customActionButtons?: CustomActionButton[];
}

// ============================================================================
// Provider Component
// ============================================================================

export function TreeProvider({
  data,
  onDataChange,
  persistenceKey,
  onLoadData,
  children,
  onAction,
  folderIcon,
  fileIcon,
  customActionButtons,
}: TreeProviderProps) {
  const emitter = useMemo(() => new EventEmitter(), []);

  // Reuse the battle-tested useTreeState hook from v1.x
  const stateHook = useTreeState(data, { persistenceKey, emitter });

  const {
    state,
    toggleOpen,
    selectNode,
    clearSelection,
    selectAllNodes,
    toggleCheck,
    getCheckState,
    setFocus,
    startEditing,
    saveEdit,
    cancelEditing,
    insertNode,
    deleteNode,
    findNode,
    findParent,
    setData,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    editingNodeId,
    focusedNodeId,
    updateState,
  } = stateHook;

  // Clipboard functionality
  const clipboardHook = useTreeClipboard({
    data: state.data,
    insertNode,
    deleteNode,
    findNode,
    commit,
    setCutNodes: stateHook.setCutNodes,
    clearCutNodes: stateHook.clearCutNodes,
  });

  const { clipboard, cutNode, copyNode, pasteNode } = clipboardHook;

  // Utility functions
  const getNodeDepth = (id: any): number => {
    let depth = 0;
    let current = findNode(state.data, id);

    while (current) {
      const parent = findParent(state.data, current.id);
      if (!parent) break;
      depth++;
      current = parent;
    }

    return depth;
  };

  const getNodePath = (id: any): any[] => {
    const path: any[] = [];
    let current = findNode(state.data, id);

    while (current) {
      path.unshift(current.id);
      const parent = findParent(state.data, current.id);
      if (!parent) break;
      current = parent;
    }

    return path;
  };

  const updateNode = (id: any, updates: Partial<any>) => {
    // Use setTimeout to ensure addNode state has settled
    setTimeout(() => {
      // Find and update the node in the latest state
      const updateInNodes = (nodes: any[]): boolean => {
        for (const node of nodes) {
          if (node.id === id) {
            Object.assign(node, updates);
            return true;
          }
          if (node.children && updateInNodes(node.children)) {
            return true;
          }
        }
        return false;
      };

      // Update in current state
      if (updateInNodes(state.data)) {
        // Trigger re-render with new array reference
        setData([...state.data]);
        // Commit to history
        commit();
      }
    }, 0);
  };

  // Wrapper functions to match v2.0 API signatures
  const wrappedInsertNode = (targetId: any, position: 'before' | 'after' | 'inside', node: any) => {
    // v1.x insertNode expects (parentId, node)
    // For v2.0, we'll use the position to determine the parent
    if (position === 'inside') {
      insertNode(targetId, node);
    } else {
      const parent = findParent(state.data, targetId);
      insertNode(parent?.id || null, node);
    }
  };

  const wrappedDuplicateNode = (id: any): any => {
    const node = findNode(state.data, id);
    if (node) {
      const newNode = cloneNode(node);
      // Insert after the original node
      const parent = findParent(state.data, id);
      insertNode(parent?.id || null, newNode);

      // Commit to history
      commit();

      if (onAction) {
        onAction({ type: 'duplicate', nodeId: id });
      }
      return newNode.id;
    }
    return null;
  };

  const wrappedDeleteNode = (id: any) => {
    // v1.x deleteNode accepts single or array
    // v2.0 expects single id
    deleteNode(id);
    if (onAction) {
      onAction({ type: 'delete', items: [id] });
    }
  };

  // Fix clipboard type property
  const wrappedClipboard = clipboard ? {
    type: clipboard.mode as 'cut' | 'copy',
    nodes: clipboard.nodes
  } : null;

  // Context value
  const contextValue: TreeContextValue = {
    // State
    state,
    focusedNodeId,
    editingNodeId,

    // Tree operations
    toggleOpen,
    selectNode,
    clearSelection,
    selectAllNodes,
    expandAll: () => {
      const allIds = new Set<TreeNodeId>();
      const traverse = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            allIds.add(node.id);
            traverse(node.children);
          }
        });
      };
      traverse(state.data);
      updateState((draft) => {
        draft.openIds = allIds;
      });
    },
    collapseAll: () => {
      updateState((draft) => {
        draft.openIds = new Set();
      });
    },
    toggleCheck,
    getCheckState,

    // Focus & editing
    setFocus,
    startEditing,
    saveEdit,
    cancelEditing,

    // CRUD operations
    addNode: (parentId: any, label: string) => stateHook.addNode(parentId, label),
    insertNode: wrappedInsertNode,
    deleteNode: wrappedDeleteNode,
    duplicateNode: wrappedDuplicateNode,
    updateNode,

    // History
    undo,
    redo,
    canUndo,
    canRedo,
    commit,

    // Utilities
    findNode,
    findParent,
    getNodeDepth,
    getNodePath,
    setData,

    // Clipboard
    cutNode: (ids: any) => {
      cutNode(ids);
      // Ensure cut state is committed to history if not already handled by hook
      // commit(); // useTreeClipboard usually handles this, but let's verify behavior
      if (onAction) {
        const nodes = (Array.isArray(ids) ? ids : [ids])
          .map((id: any) => findNode(state.data, id))
          .filter((n: any): n is TreeNode => !!n);
        onAction({ type: 'cut', items: nodes });
      }
    },
    copyNode: (ids: any) => {
      copyNode(ids);
      if (onAction) {
        const nodes = (Array.isArray(ids) ? ids : [ids])
          .map((id: any) => findNode(state.data, id))
          .filter((n: any): n is TreeNode => !!n);
        onAction({ type: 'copy', items: nodes });
      }
    },
    pasteNode: (targetId: any) => {
      if (clipboard) {
        pasteNode(targetId);
        if (onAction) {
          onAction({ type: 'paste', items: clipboard.nodes, targetId });
        }
      }
    },
    clipboard: wrappedClipboard,
    onAction,
    clearCutNodes: stateHook.clearCutNodes,

    // Callbacks
    onDataChange,
    onLoadData,

    // Icons
    folderIcon,
    fileIcon,

    // Custom Action Buttons
    customActionButtons,
  };

  return (
    <TreeContext.Provider value={contextValue}>
      {children}
    </TreeContext.Provider>
  );
}

// ============================================================================
// Hook to access context
// ============================================================================

export function useTreeContext(): TreeContextValue {
  const context = useContext(TreeContext);

  if (!context) {
    throw new Error(
      'useTreeContext must be used within a TreeProvider (Tree.Root component)'
    );
  }

  return context;
}

// ============================================================================
// Convenience hook with better naming
// ============================================================================

export function useTree(): TreeContextValue {
  return useTreeContext();
}
