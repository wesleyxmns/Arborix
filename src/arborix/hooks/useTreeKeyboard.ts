import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect } from 'react';
import { TreeNodeId } from '../types';
import { VisibleNode } from '../utils/flattenTree';

export interface UseTreeKeyboardProps {
  focusedNodeId: TreeNodeId | null;
  selectedIds: Set<TreeNodeId>;
  openIds: Set<TreeNodeId>;
  editingNodeId: TreeNodeId | null;
  clipboard: any;
  showCheckboxes: boolean;
  enableInlineEdit: boolean;
  flatData: VisibleNode[];

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  startEditing: (id: TreeNodeId) => void;
  deleteNode: (id: TreeNodeId | TreeNodeId[]) => void;
  duplicateNode: (id: TreeNodeId | TreeNodeId[]) => void;
  cutNode: (id: TreeNodeId | TreeNodeId[]) => void;
  copyNode: (id: TreeNodeId | TreeNodeId[]) => void;
  pasteNode: (targetId: TreeNodeId | null) => void;
  setFocus: (id: TreeNodeId) => void;
  selectNode: (id: TreeNodeId, multi?: boolean, range?: boolean, visibleNodes?: TreeNodeId[]) => void;
  selectAllNodes: (allIds: TreeNodeId[]) => void;
  toggleCheck: (id: TreeNodeId) => void;
  toggleOpen: (id: TreeNodeId) => void;
  handleToggle: (id: TreeNodeId) => void;

  virtualizer: Virtualizer<any, any>;
}

export const useTreeKeyboard = ({
  focusedNodeId,
  selectedIds,
  openIds,
  editingNodeId,
  clipboard,
  showCheckboxes,
  enableInlineEdit,
  flatData,
  undo,
  redo,
  canUndo,
  canRedo,
  startEditing,
  deleteNode,
  duplicateNode,
  cutNode,
  copyNode,
  pasteNode,
  setFocus,
  selectNode,
  selectAllNodes,
  toggleCheck,
  handleToggle,
  toggleOpen,
  virtualizer,
}: UseTreeKeyboardProps) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingNodeId) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' && e.shiftKey || e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }

      if (enableInlineEdit && selectedIds.size === 1) {
        if (e.key === 'F2' || e.key === 'Enter') {
          e.preventDefault();
          const selectedId = Array.from(selectedIds)[0];
          startEditing(selectedId);
        }
      }

      if (e.key === 'Delete' && selectedIds.size > 0) {
        e.preventDefault();
        deleteNode(Array.from(selectedIds));
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        if (flatData.length > 0) {
          const allNodeIds = flatData.map(item => item.node.id);
          selectAllNodes(allNodeIds);
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedIds.size > 0) {
        e.preventDefault();
        duplicateNode(Array.from(selectedIds));
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'x' && selectedIds.size > 0) {
        e.preventDefault();
        cutNode(Array.from(selectedIds));
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && selectedIds.size > 0) {
        e.preventDefault();
        copyNode(Array.from(selectedIds));
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard) {
        e.preventDefault();
        const targetId = selectedIds.size === 1 ? Array.from(selectedIds)[0] : null;
        pasteNode(targetId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedIds,
    editingNodeId,
    canUndo,
    canRedo,
    undo,
    redo,
    enableInlineEdit,
    startEditing,
    deleteNode,
    duplicateNode,
    cutNode,
    copyNode,
    pasteNode,
    clipboard,
  ]);

  const handleTreeNavigation = (e: React.KeyboardEvent) => {
    if (editingNodeId) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!focusedNodeId && flatData.length > 0) {
          setFocus(flatData[0].node.id);
          return;
        }
        const currentIndex = flatData.findIndex(item => item.node.id === focusedNodeId);
        if (currentIndex < flatData.length - 1) {
          const nextNode = flatData[currentIndex + 1].node;
          setFocus(nextNode.id);
          virtualizer.scrollToIndex(currentIndex + 1);
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        const currentIndex = flatData.findIndex(item => item.node.id === focusedNodeId);
        if (currentIndex > 0) {
          const prevNode = flatData[currentIndex - 1].node;
          setFocus(prevNode.id);
          virtualizer.scrollToIndex(currentIndex - 1);
        }
        break;
      }

      case 'ArrowRight': {
        e.preventDefault();
        if (!focusedNodeId) return;
        const item = flatData.find(i => i.node.id === focusedNodeId);
        if (item) {
          if ((item.node.children?.length || !item.node.isLeaf) && !openIds.has(item.node.id)) {
            handleToggle(item.node.id);
          } else {
            const currentIndex = flatData.findIndex(i => i.node.id === focusedNodeId);
            if (currentIndex < flatData.length - 1) {
              setFocus(flatData[currentIndex + 1].node.id);
              virtualizer.scrollToIndex(currentIndex + 1);
            }
          }
        }
        break;
      }

      case 'ArrowLeft': {
        e.preventDefault();
        if (!focusedNodeId) return;
        const item = flatData.find(i => i.node.id === focusedNodeId);
        if (item) {
          if (openIds.has(item.node.id)) {
            toggleOpen(item.node.id);
          } else if (item.parentId) {
            setFocus(item.parentId);
            const parentIndex = flatData.findIndex(i => i.node.id === item.parentId);
            if (parentIndex !== -1) virtualizer.scrollToIndex(parentIndex);
          }
        }
        break;
      }

      case 'Home': {
        e.preventDefault();
        if (flatData.length > 0) {
          setFocus(flatData[0].node.id);
          virtualizer.scrollToIndex(0);
        }
        break;
      }

      case 'End': {
        e.preventDefault();
        if (flatData.length > 0) {
          setFocus(flatData[flatData.length - 1].node.id);
          virtualizer.scrollToIndex(flatData.length - 1);
        }
        break;
      }

      case 'Enter': {
        e.preventDefault();
        if (focusedNodeId) {
          selectNode(focusedNodeId, e.ctrlKey || e.metaKey);
        }
        break;
      }

      case ' ':
        e.preventDefault();
        if (focusedNodeId) {
          if (showCheckboxes) {
            toggleCheck(focusedNodeId);
          } else {
            selectNode(focusedNodeId, e.ctrlKey || e.metaKey);
          }
        }
        break;
    }
  };

  return { handleTreeNavigation };
};
