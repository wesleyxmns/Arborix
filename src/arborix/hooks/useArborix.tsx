import {
  closestCenter,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import EventEmitter from 'eventemitter3';
import { useEffect, useMemo, useState } from 'react';

import { useContextMenu } from '../components/ContextMenu/ContextMenu';
import { PluginManager } from '../plugins/plugins';
import type { ArborixProps, TreeInstance, TreeNodeId } from '../types';
import { getContextMenuItems } from '../utils/menuUtils';
import { filterTreeData } from '../utils/treeUtils';
import { useVirtualTree } from '../virtual/useVirtualTree';
import { useDragDrop } from './useDragDrop';
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
    enableDragDrop = true,
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
  const [isDragEnabled, setIsDragEnabled] = useState(enableDragDrop);

  // Sync internal state if prop changes, but allow toggle
  useEffect(() => {
    setIsDragEnabled(enableDragDrop);
  }, [enableDragDrop]);

  const toggleDrag = () => setIsDragEnabled(prev => !prev);

  const stateHook = useTreeState(data, { persistenceKey, emitter });
  const {
    state,
    toggleOpen,
    selectNode,
    toggleCheck,
    setData,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    editingNodeId,
    startEditing,
    addNode,
    deleteNode,
    duplicateNode,
    findNode,
    findParent,
    setNodeLoading,
    setNodeChildren,
    focusedNodeId,
    setFocus,
    getState,
    updateState
  } = stateHook;

  const dragDropHook = useDragDrop();
  const { handleDragEnd } = dragDropHook;

  const contextMenuHook = useContextMenu();
  const { handleContextMenu } = contextMenuHook;

  const clipboardHook = useTreeClipboard({
    data: state.data,
    addNode,
    deleteNode,
    findNode,
    commit,
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
        console.error("Erro ao carregar nós:", error);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDrop = () => {
    handleDragEnd(state.data, (newData) => {
      setData(newData);
      commit();
    });
  };

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: TreeNodeId) => {
    if (!enableContextMenu) return;
    const items = getContextMenuItems({
      nodeId,
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
    handleContextMenu(e, items);
  };

  return {
    state,
    displayData,
    flatData,
    virtualRows,
    totalHeight,
    nodeIds: flatData.map(item => item.node.id),
    isDragEnabled,
    toggleDrag,

    stateHook,
    dragDropHook,
    contextMenuHook,
    clipboardHook,
    searchHook,
    virtualHook,
    keyboardHook,

    handleToggle,
    handleDrop,
    handleNodeContextMenu,
    getHighlightIndices,

    sensors,
    dndConfig: {
      collisionDetection: closestCenter,
      measuring: { droppable: { strategy: MeasuringStrategy.Always } },
    },
    sortableConfig: {
      strategy: verticalListSortingStrategy,
    },
  };
};
