import EventEmitter from 'eventemitter3';
import { useEffect, useMemo } from 'react';

import { useContextMenu } from '../components/ContextMenu/ContextMenu';
import { PluginManager } from '../plugins/plugins';
import type { ArborixProps, TreeInstance, TreeNodeId } from '../types';
import { getContextMenuItems } from '../utils/menuUtils';
import { filterTreeData } from '../utils/treeUtils';
import { useVirtualTree } from '../virtual/useVirtualTree';
import { useTreeClipboard } from './useTreeClipboard';
import { useTreeKeyboard } from './useTreeKeyboard';
import { useTreeSearch } from './useTreeSearch';
import { useTreeState } from './useTreeState';

export const useArborix = (props: ArborixProps) => {
  const {
    data,
    persistenceKey,
    rowHeight = 32,
    showCheckboxes = false,
    // enableDragDrop = true, // Removed unused prop
    enableInlineEdit = true,
    enableContextMenu = true,
    filterFn,
    plugins = [],
    onDataChange,
    onLoadData,
    contextMenuOptions,
    customContextMenuItems,
  } = props;

  const emitter = useMemo(() => new EventEmitter(), []);

  // Drag enabled state logic removed as it's handled by Arborix component directly now
  // or we can keep it if we want to toggle it via toolbar, but the hook logic is gone.
  // Let's keep the state for toolbar toggle compatibility if needed, but it's not used by the new hook directly.
  // const [isDragEnabled, setIsDragEnabled] = useState(enableDragDrop);

  // useEffect(() => {
  //   setIsDragEnabled(enableDragDrop);
  // }, [enableDragDrop]);

  // const toggleDrag = () => setIsDragEnabled(prev => !prev);

  const stateHook = useTreeState(data, { persistenceKey, emitter });
  const {
    state,
    toggleOpen,
    selectNode,
    selectAllNodes,
    // clearSelection, // Used in return
    toggleCheck,
    // setData, // Used in return? No, internal state update.
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    editingNodeId,
    startEditing,
    addNode,
    insertNode,
    deleteNode,
    duplicateNode,
    findNode,
    findParent,
    setNodeLoading,
    setNodeChildren,
    focusedNodeId,
    setFocus,
    setCutNodes,
    clearCutNodes,
    getState,
    updateState
  } = stateHook;

  const contextMenuHook = useContextMenu();
  const { handleContextMenu } = contextMenuHook;

  const clipboardHook = useTreeClipboard({
    data: state.data,
    insertNode,
    deleteNode,
    findNode,
    commit,
    setCutNodes,
    clearCutNodes,
  });
  const { clipboard, cutNode, copyNode, pasteNode } = clipboardHook;

  const displayData = useMemo(() => {
    if (!filterFn) return state.data;
    return filterTreeData(state.data, filterFn);
  }, [state.data, filterFn]);

  const searchHook = useTreeSearch(displayData, {
    minSearchLength: 2,
    autoExpand: true,
  });
  const {
    matchedNodeIds,
    nodesToExpand,
    currentResult,
    getHighlightIndices,
  } = searchHook;

  const virtualHook = useVirtualTree({
    data: displayData,
    openIds: state.openIds,
    rowHeight,
    searchResults: matchedNodeIds,
  });
  const { virtualRows, totalHeight, flatData, virtualizer } = virtualHook;

  const handleToggle = async (id: TreeNodeId) => {
    const node = findNode(state.data, id);
    if (!node) return;

    const needsLoad =
      onLoadData &&
      !node.isLeaf &&
      (!node.children || node.children.length === 0) &&
      !state.openIds.has(id);

    if (needsLoad) {
      setNodeLoading(id, true);
      try {
        const result = await onLoadData(node);
        if (Array.isArray(result)) {
          setNodeChildren(id, result);
          toggleOpen(id);
        } else {
          setNodeLoading(id, false);
          toggleOpen(id);
        }
      } catch (error) {
        setNodeLoading(id, false);
      }
    } else {
      toggleOpen(id);
    }
  };

  const keyboardHook = useTreeKeyboard({
    focusedNodeId,
    selectedIds: state.selectedIds,
    openIds: state.openIds,
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
    toggleOpen,
    handleToggle,
    virtualizer,
  });

  useEffect(() => {
    const treeInstance: TreeInstance = {
      emitter,
      getState,
      update: updateState,
      undo,
      redo,
    };
    const manager = new PluginManager();
    plugins.forEach(plugin => manager.install(treeInstance, plugin));
    return () => manager.destroy();
  }, [plugins, emitter, getState, updateState, undo, redo]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(state.data);
    }
  }, [state.data, onDataChange]);

  useEffect(() => {
    if (nodesToExpand.size > 0) {
      nodesToExpand.forEach(id => {
        if (!state.openIds.has(id)) toggleOpen(id);
      });
    }
  }, [nodesToExpand, state.openIds, toggleOpen]);

  useEffect(() => {
    if (currentResult) {
      const container = document.getElementById('arborix-scroll-container');
      const element = document.querySelector(`[data-node-id="${currentResult.nodeId}"]`);
      if (container && element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentResult]);

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: TreeNodeId) => {
    if (!enableContextMenu) return;

    const targetIds = state.selectedIds.has(nodeId)
      ? Array.from(state.selectedIds)
      : [nodeId];

    const items = getContextMenuItems({
      nodeId,
      targetIds,
      data: state.data,
      findNode,
      findParent,
      startEditing,
      duplicateNode,
      cutNode,
      copyNode,
      pasteNode,
      addNode,
      deleteNode,
      clipboard,
      options: contextMenuOptions,
      customItems: customContextMenuItems,
    });
    handleContextMenu(e.nativeEvent, items);
  };

  return {
    state,
    displayData,
    flatData,
    virtualRows,
    totalHeight,
    nodeIds: flatData.map(item => item.node.id),

    stateHook,
    contextMenuHook,
    clipboardHook,
    searchHook,
    keyboardHook,

    handleToggle,
    handleNodeContextMenu,
    getHighlightIndices,
  };
};
