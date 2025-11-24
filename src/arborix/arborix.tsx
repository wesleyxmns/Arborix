import { useEffect, useState } from 'react';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { NodeRenderer } from './components/NodeRenderer/NodeRenderer';
import { RootDropZone } from './components/RootDropZone/RootDropZone';
import { SearchBar } from './components/SearchBar/SearchBar';
import { TreeToolbar } from './components/TreeToolbar/TreeToolbar';
import { useArborix } from './hooks/useArborix';
import { useDragDrop } from './hooks/useDragDrop';
import type { ArborixProps } from './types';

export type { ArborixProps };

export const Arborix: React.FC<ArborixProps> = (props) => {
  const {
    height = 600,
    showCheckboxes = false,
    enableDragDrop = true,
    enableSearch = true,
    enableInlineEdit = true,
    enableContextMenu = true,
    showExpandButtons = false,
    renderNode,
    onLoadData,
    nodeClassName,
  } = props;

  // Estado para controlar ativação/desativação do Drag & Drop
  const [isDragEnabled, setIsDragEnabled] = useState(enableDragDrop);

  // Sincroniza com a prop quando ela mudar
  useEffect(() => {
    setIsDragEnabled(enableDragDrop);
  }, [enableDragDrop]);

  const toggleDrag = () => setIsDragEnabled((prev: boolean) => !prev);

  const {
    state,
    displayData,
    flatData,
    virtualRows,
    totalHeight,

    stateHook,
    contextMenuHook,
    clipboardHook,
    searchHook,
    keyboardHook,

    handleToggle,
    handleNodeContextMenu,
    getHighlightIndices,
  } = useArborix(props);

  const {
    undo, redo, canUndo, canRedo, addNode, startEditing, saveEdit, cancelEditing,
    selectNode, toggleCheck, getCheckState, setFocus, editingNodeId, focusedNodeId,
    clearSelection, setData, commit
  } = stateHook;

  // IMPORTANTE: usa state.data (dados internos) e setData + commit para atualizar
  const dragDrop = useDragDrop(state.data, (newData) => {
    // Atualiza o estado interno
    setData(newData);
    // Salva no histórico para permitir undo/redo
    commit();
  });

  const { contextMenu, closeContextMenu } = contextMenuHook;
  const { clipboard } = clipboardHook;
  const {
    searchQuery, search, clearSearch, nextResult, previousResult,
    currentResultIndex, totalResults, currentResult, matchedNodeIds
  } = searchHook;

  const { handleTreeNavigation } = keyboardHook;

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const treeContainer = document.getElementById('arborix-scroll-container');
      if (treeContainer && !treeContainer.contains(e.target as Node)) {
        clearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSelection]);

  return (
    <div className="flex flex-col gap-2">
      <TreeToolbar
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onAddNode={() => {
          const newId = addNode(null, 'New Node');
          startEditing(newId);
        }}
        clipboard={clipboard}
        selectedCount={state.selectedIds.size}
        checkedCount={state.checkedIds.size}
        showCheckboxes={showCheckboxes}
        enableDragDrop={enableDragDrop}
        isDragEnabled={isDragEnabled}
        onToggleDrag={toggleDrag}
        showExpandButtons={showExpandButtons}
        onExpandAll={() => {
          const allParentNodeIds = flatData
            .filter(item => item.node.children && item.node.children.length > 0)
            .map(item => item.node.id);
          allParentNodeIds.forEach(id => {
            if (!state.openIds.has(id)) handleToggle(id);
          });
        }}
        onCollapseAll={() => {
          const allOpenNodeIds = Array.from(state.openIds);
          allOpenNodeIds.forEach(id => stateHook.toggleOpen(id));
        }}
      />

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

      <div
        role="tree"
        aria-label="File Tree"
        aria-multiselectable={true}
        onKeyDown={handleTreeNavigation}
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
            const isEditing = enableInlineEdit && editingNodeId === node.id;

            const isMatched = matchedNodeIds.has(node.id);
            const isCurrentResult = currentResult?.nodeId === node.id;
            const highlightIndices = searchQuery ? getHighlightIndices(node.id) : [];
            const isFocused = focusedNodeId === node.id;

            const siblingNodes = parentId ? stateHook.findNode(displayData, parentId)?.children : displayData;
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
              >
                <NodeRenderer
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  isSelected={isSelected}
                  checkState={checkState}
                  dragDrop={dragDrop}
                  isDragEnabled={isDragEnabled}
                  onToggle={() => handleToggle(node.id)}
                  onSelect={(e: React.MouseEvent) => {
                    const multi = e.ctrlKey || e.metaKey;
                    const range = e.shiftKey;
                    const visibleNodes = flatData.map(i => i.node.id);
                    selectNode(node.id, multi, range, visibleNodes);
                    setFocus(node.id);
                  }}
                  onCheck={showCheckboxes ? () => toggleCheck(node.id) : undefined}
                  renderNode={renderNode}
                  isMatched={isMatched}
                  isCurrentResult={isCurrentResult}
                  highlightIndices={highlightIndices}
                  isEditing={isEditing}
                  isCut={state.cutNodeIds.has(node.id)}
                  onStartEdit={enableInlineEdit ? () => startEditing(node.id) : undefined}
                  onSaveEdit={enableInlineEdit ? (newLabel: string) => saveEdit(node.id, newLabel) : undefined}
                  onCancelEdit={enableInlineEdit ? cancelEditing : undefined}
                  onContextMenu={enableContextMenu ? (e: React.MouseEvent) => handleNodeContextMenu(e, node.id) : undefined}
                  canLoadData={!!onLoadData}
                  isFocused={isFocused}
                  ariaSetSize={ariaSetSize}
                  ariaPosInSet={ariaPosInSet}
                  className={nodeClassName}
                />
              </div>
            );
          })}
        </div>

        {/* Root Drop Zone at the bottom of the list content */}
        {enableDragDrop && <RootDropZone dragDrop={dragDrop} />}
      </div>

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