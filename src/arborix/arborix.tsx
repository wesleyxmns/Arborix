import {
  closestCenter,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import EventEmitter from 'eventemitter3';
import React, { useEffect, useMemo, useState } from 'react';
import { ContextMenu, ContextMenuIcons, ContextMenuItem, useContextMenu } from './components/ContextMenu/ContextMenu';
import { NodeRenderer } from './components/NodeRenderer/NodeRenderer';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useDragDrop } from './hooks/useDragDrop';
import { useTreeSearch } from './hooks/useTreeSearch';
import { useTreeState } from './hooks/useTreeState';
import { PluginManager } from './plugins/plugins';
import type { FilterFn, TreeData, TreeInstance, TreeNode, TreeNodeId, TreePlugin } from './types';
import { filterTreeData } from './utils/treeUtils';
import { useVirtualTree } from './virtual/useVirtualTree';

export interface ArborixProps {
  data: TreeData;
  persistenceKey?: string;
  height?: number;
  rowHeight?: number;
  showCheckboxes?: boolean;
  enableDragDrop?: boolean;
  enableSearch?: boolean;
  enableInlineEdit?: boolean;
  enableContextMenu?: boolean;
  filterFn?: FilterFn;
  plugins?: TreePlugin[];
  renderNode?: (node: any) => React.ReactNode;
  onDataChange?: (data: TreeData) => void;
  onLoadData?: (node: TreeNode) => Promise<TreeNode[] | void>;
}

export const Arborix: React.FC<ArborixProps> = ({
  data,
  persistenceKey,
  height = 600,
  rowHeight = 32,
  showCheckboxes = false,
  enableDragDrop = true,
  enableSearch = true,
  enableInlineEdit = true,
  enableContextMenu = true,
  filterFn,
  plugins = [],
  renderNode,
  onDataChange,
  onLoadData,
}) => {
  const emitter = useMemo(() => new EventEmitter(), []);

  const {
    state,
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
    focusedNodeId,
    setFocus,
    getState,
    updateState
  } = useTreeState(data, { persistenceKey, emitter });

  const {
    activeId,
    overId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop();

  // Context Menu
  const { contextMenu, closeContextMenu, handleContextMenu } = useContextMenu();

  // Clipboard (cut/copy/paste)
  const [clipboard, setClipboard] = useState<{
    node: TreeNode;
    mode: 'cut' | 'copy';
  } | null>(null);

  const displayData = useMemo(() => {
    if (!filterFn) return state.data;
    return filterTreeData(state.data, filterFn);
  }, [state.data, filterFn]);

  // Hook de busca
  const {
    searchQuery,
    search,
    clearSearch,
    matchedNodeIds,
    nodesToExpand,
    currentResult,
    currentResultIndex,
    nextResult,
    previousResult,
    totalResults,
    getHighlightIndices,
  } = useTreeSearch(displayData, {
    minSearchLength: 2,
    autoExpand: true,
  });

  useEffect(() => {
    // 1. Criar a instância estável da árvore
    const treeInstance: TreeInstance = {
      emitter,
      getState,
      update: updateState,
      undo,
      redo,
    };

    // 2. Instanciar e instalar os plugins
    const manager = new PluginManager();
    plugins.forEach(plugin => manager.install(treeInstance, plugin));

    // 3. Cleanup: Desinstalar no unmount (chamando teardown)
    return () => {
      manager.destroy();
    };
  }, [plugins, emitter, getState, updateState, undo, redo]); // Dependências

  // Notificar mudanças nos dados
  useEffect(() => {
    if (onDataChange) {
      onDataChange(state.data);
    }
  }, [state.data, onDataChange]);

  // Auto-expande nós quando há resultados de busca
  useEffect(() => {
    if (nodesToExpand.size > 0) {
      nodesToExpand.forEach(id => {
        if (!state.openIds.has(id)) {
          toggleOpen(id);
        }
      });
    }
  }, [nodesToExpand, state.openIds, toggleOpen]);

  // Rola até o resultado atual
  useEffect(() => {
    if (currentResult) {
      const container = document.getElementById('arborix-scroll-container');
      const element = document.querySelector(`[data-node-id="${currentResult.nodeId}"]`);

      if (container && element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentResult]);

  // Funções de clipboard
  const cutNode = (id: TreeNodeId) => {
    const node = findNode(state.data, id);
    if (node) {
      setClipboard({ node, mode: 'cut' });
    }
  };

  const copyNode = (id: TreeNodeId) => {
    const node = findNode(state.data, id);
    if (node) {
      setClipboard({ node, mode: 'copy' });
    }
  };

  const pasteNode = (targetId: TreeNodeId | null) => {
    if (!clipboard) return;

    if (clipboard.mode === 'cut') {
      // Remover do local original e adicionar no novo
      deleteNode(clipboard.node.id);
      const newNode = { ...clipboard.node, id: Date.now().toString() };

      // Adicionar como filho do target
      if (targetId) {
        addNode(targetId, newNode.label);
      } else {
        addNode(null, newNode.label);
      }

      setClipboard(null);
    } else {
      // Copy - apenas duplicar
      const deepClone = (n: TreeNode): TreeNode => ({
        ...n,
        id: `${n.id}-paste-${Date.now()}`,
        children: n.children?.map(deepClone),
      });

      const clonedNode = deepClone(clipboard.node);

      if (targetId) {
        addNode(targetId, clonedNode.label);
      } else {
        addNode(null, clonedNode.label);
      }
    }

    commit();
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' && e.shiftKey || e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }

      // Edição inline - F2 ou Enter
      if (enableInlineEdit && state.selectedIds.size === 1 && !editingNodeId) {
        if (e.key === 'F2' || e.key === 'Enter') {
          e.preventDefault();
          const selectedId = Array.from(state.selectedIds)[0];
          startEditing(selectedId);
        }
      }

      // Delete
      if (e.key === 'Delete' && state.selectedIds.size > 0 && !editingNodeId) {
        e.preventDefault();
        state.selectedIds.forEach(id => deleteNode(id));
      }

      // Duplicate - Cmd/Ctrl + D
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && state.selectedIds.size === 1 && !editingNodeId) {
        e.preventDefault();
        const selectedId = Array.from(state.selectedIds)[0];
        duplicateNode(selectedId);
      }

      // Cut - Cmd/Ctrl + X
      if ((e.metaKey || e.ctrlKey) && e.key === 'x' && state.selectedIds.size === 1 && !editingNodeId) {
        e.preventDefault();
        const selectedId = Array.from(state.selectedIds)[0];
        cutNode(selectedId);
      }

      // Copy - Cmd/Ctrl + C
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && state.selectedIds.size === 1 && !editingNodeId) {
        e.preventDefault();
        const selectedId = Array.from(state.selectedIds)[0];
        copyNode(selectedId);
      }

      // Paste - Cmd/Ctrl + V
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard && !editingNodeId) {
        e.preventDefault();
        const targetId = state.selectedIds.size === 1 ? Array.from(state.selectedIds)[0] : null;
        pasteNode(targetId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    state.selectedIds,
    editingNodeId,
    canUndo,
    canRedo,
    undo,
    redo,
    enableInlineEdit,
    startEditing,
    deleteNode,
    duplicateNode,
    clipboard,
  ]);

  const { virtualRows, totalHeight, flatData, virtualizer } = useVirtualTree({
    data: displayData,
    openIds: state.openIds,
    rowHeight,
    searchResults: matchedNodeIds,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const nodeIds = flatData.map(item => item.node.id);

  const handleDrop = () => {
    handleDragEnd(state.data, (newData) => {
      setData(newData);
      commit();
    });
  };

  // Gerar itens do context menu
  const getContextMenuItems = (nodeId: TreeNodeId): ContextMenuItem[] => {
    const node = findNode(state.data, nodeId);
    if (!node) return [];

    const parent = findParent(state.data, nodeId);

    return [
      {
        id: 'rename',
        label: 'Renomear',
        icon: ContextMenuIcons.Edit,
        action: () => startEditing(nodeId),
      },
      {
        id: 'duplicate',
        label: 'Duplicar',
        icon: ContextMenuIcons.Copy,
        action: () => duplicateNode(nodeId),
      },
      { id: 'sep1', label: '', separator: true },
      {
        id: 'add-child',
        label: 'Novo filho',
        icon: ContextMenuIcons.AddFolder,
        action: () => addNode(nodeId, 'Novo filho'),
      },
      {
        id: 'add-sibling',
        label: 'Novo irmão',
        icon: ContextMenuIcons.Add,
        action: () => {
          const parentId = parent?.id ?? null;
          addNode(parentId, 'Novo irmão');
        },
      },
      { id: 'sep2', label: '', separator: true },
      {
        id: 'delete',
        label: 'Excluir',
        icon: ContextMenuIcons.Delete,
        danger: true,
        action: () => deleteNode(nodeId),
      },
    ];
  };

  const handleTreeKeyDown = (e: React.KeyboardEvent) => {
    // Ignora se estiver editando
    if (editingNodeId) return;

    // Mapeamento de teclas
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
          // Se tem filhos e está fechado -> Abre
          if ((item.node.children?.length || !item.node.isLeaf) && !state.openIds.has(item.node.id)) {
            // Chama o toggle (que lida com lazy load se necessário)
            // Precisamos expor o handleToggle criado dentro do componente ou recriá-lo aqui?
            // O handleToggle está definido abaixo no código original, vamos movê-lo para cima ou referenciá-lo
            handleToggle(item.node.id);
          } else {
            // Se já está aberto ou não tem filhos -> Vai para o próximo (primeiro filho visual)
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
          // Se está aberto -> Fecha
          if (state.openIds.has(item.node.id)) {
            toggleOpen(item.node.id);
          } else if (item.parentId) {
            // Se está fechado -> Vai para o pai
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
          selectNode(focusedNodeId, e.ctrlKey || e.metaKey); // Suporte a multi-seleção
        }
        break;
      }

      case ' ': // Space
        e.preventDefault();
        if (focusedNodeId) {
          if (showCheckboxes) {
            toggleCheck(focusedNodeId);
          } else {
            selectNode(focusedNodeId, e.ctrlKey || e.metaKey);
          }
        }
        break;

      case '*': // Asterisco (Expandir todos irmãos - opcional, mas comum em trees)
        // Podemos implementar depois se necessário
        break;
    }
  };

  const handleToggle = async (id: TreeNodeId) => {
    const node = findNode(state.data, id); // Usa o findNode que já vem do useTreeState

    if (!node) return;

    const needsLoad =
      onLoadData &&
      !node.isLeaf &&
      (!node.children || node.children.length === 0) &&
      !state.openIds.has(id); // Só carrega se estiver abrindo

    if (needsLoad) {
      // 1. Abre visualmente (para mostrar o loading spinner se quisermos, ou mantemos fechado até carregar. 
      // Geralmente árvore expande e mostra spinner dentro ou substitui o ícone. 
      // O NodeRenderer atual substitui o ícone de seta pelo spinner).

      // Setar loading true
      setNodeLoading(id, true);

      try {
        // Chama a função do usuário
        const result = await onLoadData(node);

        // Se a função retornar dados diretamente (array), usamos.
        // Se retornar void, assume-se que o usuário atualizou `data` via prop `onDataChange` ou similar, 
        // mas para controle interno é melhor injetarmos.
        if (Array.isArray(result)) {
          setNodeChildren(id, result);
          // Agora expande
          toggleOpen(id);
        } else {
          // Se o usuário não retornou nada, apenas paramos o loading e abrimos
          // (assumindo que o usuário manipulou os dados externamente e passou nova prop data)
          setNodeLoading(id, false);
          toggleOpen(id);
        }
      } catch (error) {
        console.error("Erro ao carregar nós:", error);
        setNodeLoading(id, false);
      }
    } else {
      // Comportamento padrão
      toggleOpen(id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Cmd/Ctrl + Z)"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Cmd/Ctrl + Shift + Z)"
          >
            Redo
          </button>
        </div>

        {/* Add Node */}
        <button
          onClick={() => {
            const newId = addNode(null, 'New Node');
            startEditing(newId);
          }}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          title="Add root node"
        >
          + Add Node
        </button>

        {/* Clipboard status */}
        {clipboard && (
          <div className="text-xs text-gray-500 px-2 py-1 bg-blue-50 border border-blue-200 rounded">
            {clipboard.mode === 'cut' ? '✂️' : '📋'} {clipboard.node.label}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 ml-auto">
          {state.selectedIds.size > 0 && `${state.selectedIds.size} selected`}
          {showCheckboxes && state.checkedIds.size > 0 && ` • ${state.checkedIds.size} checked`}
        </div>
      </div>

      {/* Barra de busca */}
      {enableSearch && (
        <SearchBar
          value={searchQuery}
          onChange={search}
          onClear={clearSearch}
          onNext={nextResult}
          onPrevious={previousResult}
          currentIndex={currentResultIndex}
          totalResults={totalResults}
          placeholder="Search tree (Cmd/Ctrl + F)"
        />
      )}

      {/* Árvore */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={({ active }) => handleDragStart(active.id)}
        onDragEnd={handleDrop}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
          <div
            role="tree" // <--- IMPORTANTE
            aria-label="File Tree"
            aria-multiselectable={true} // ou prop
            onKeyDown={handleTreeKeyDown} // <--- IMPORTANTE
            id="arborix-scroll-container"
            style={{ height, overflow: 'auto', position: 'relative' }}
          >
            <div style={{ height: totalHeight, position: 'relative' }}>
              {virtualRows.map(virtualRow => {
                const item = flatData[virtualRow.index];
                if (!item) return null;

                const { node, depth, parentId } = item;

                const isOpen = state.openIds.has(node.id);
                const isSelected = state.selectedIds.has(node.id);
                const checkState = showCheckboxes ? getCheckState(node.id) : undefined;
                const isBeingDragged = activeId === node.id;
                const currentDropPosition = overId === node.id ? dropPosition : null;
                const isEditing = enableInlineEdit && editingNodeId === node.id;

                // Props relacionadas à busca
                const isMatched = matchedNodeIds.has(node.id);
                const isCurrentResult = currentResult?.nodeId === node.id;
                const highlightIndices = searchQuery ? getHighlightIndices(node.id) : [];

                const isFocused = focusedNodeId === node.id;

                const siblingNodes = parentId ? findNode(displayData, parentId)?.children : displayData; // <-- Usa parentId
                const ariaSetSize = siblingNodes?.length;
                const ariaPosInSet = siblingNodes ? siblingNodes.findIndex(n => n.id === node.id) + 1 : virtualRow.index + 1;

                return (
                  <div
                    key={node.id}
                    data-node-id={node.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onDragOver={(e) => {
                      if (enableDragDrop && activeId && activeId !== node.id) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const height = rect.height;

                        if (y < height * 0.25) {
                          handleDragOver(node.id, 'before');
                        } else if (y > height * 0.75) {
                          handleDragOver(node.id, 'after');
                        } else {
                          handleDragOver(node.id, 'inside');
                        }
                      }
                    }}
                  >
                    <NodeRenderer
                      node={node}
                      depth={depth}
                      isOpen={isOpen}
                      isSelected={isSelected}
                      checkState={checkState}
                      onToggle={() => handleToggle(node.id)}
                      onSelect={() => {
                        selectNode(node.id, true);
                        setFocus(node.id);
                      }}
                      onCheck={showCheckboxes ? () => toggleCheck(node.id) : undefined}
                      renderNode={renderNode}
                      isDraggable={enableDragDrop}
                      isBeingDragged={isBeingDragged}
                      dropPosition={currentDropPosition}
                      isMatched={isMatched}
                      isCurrentResult={isCurrentResult}
                      highlightIndices={highlightIndices}
                      isEditing={isEditing}
                      onStartEdit={enableInlineEdit ? () => startEditing(node.id) : undefined}
                      onSaveEdit={enableInlineEdit ? (newLabel) => saveEdit(node.id, newLabel) : undefined}
                      onCancelEdit={enableInlineEdit ? cancelEditing : undefined}
                      onContextMenu={enableContextMenu ? (e) => handleContextMenu(e, getContextMenuItems(node.id)) : undefined}
                      canLoadData={!!onLoadData}
                      isFocused={isFocused}
                      ariaSetSize={ariaSetSize}
                      ariaPosInSet={ariaPosInSet}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white shadow-lg rounded p-2 border-2 border-blue-400">
                {flatData.find(item => item.node.id === activeId)?.node.label}
              </div>
            ) : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>

      {/* Context Menu */}
      {contextMenu && enableContextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};