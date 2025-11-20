import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import React from 'react';

import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { NodeRenderer } from './components/NodeRenderer/NodeRenderer';
import { SearchBar } from './components/SearchBar/SearchBar';
import { TreeToolbar } from './components/TreeToolbar/TreeToolbar';
import { useArborix } from './hooks/useArborix';
import type { ArborixProps, TreeNodeId } from './types';

export const Arborix: React.FC<ArborixProps> = (props) => {
  const {
    height = 600,
    showCheckboxes = false,
    enableDragDrop = true,
    enableSearch = true,
    enableInlineEdit = true,
    enableContextMenu = true,
    renderNode,
    onLoadData,
  } = props;

  const {
    state,
    displayData,
    flatData,
    virtualRows,
    totalHeight,
    nodeIds,
    isDragEnabled,
    toggleDrag,

    stateHook,
    dragDropHook,
    contextMenuHook,
    clipboardHook,
    searchHook,
    keyboardHook,

    handleToggle,
    handleDrop,
    handleNodeContextMenu,
    getHighlightIndices,

    sensors,
    dndConfig,
    sortableConfig,
  } = useArborix(props);

  const {
    undo, redo, canUndo, canRedo, addNode, startEditing, saveEdit, cancelEditing,
    selectNode, toggleCheck, getCheckState, setFocus, editingNodeId, focusedNodeId
  } = stateHook;

  const { activeId, overId, dropPosition, handleDragStart, handleDragOver, handleDragCancel } = dragDropHook;
  const { contextMenu, closeContextMenu } = contextMenuHook;
  const { clipboard } = clipboardHook;
  const {
    searchQuery, search, clearSearch, nextResult, previousResult,
    currentResultIndex, totalResults, currentResult, matchedNodeIds
  } = searchHook;

  const { handleTreeNavigation } = keyboardHook;

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

      <DndContext
        sensors={sensors}
        {...dndConfig}
        onDragStart={({ active }) => handleDragStart(active.id as TreeNodeId)}
        onDragOver={({ active, over }) => {
          if (over && active.id !== over.id) {
            handleDragOver(over.id as TreeNodeId, 'inside');
          }
        }}
        onDragEnd={handleDrop}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={nodeIds} {...sortableConfig}>
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
                const isBeingDragged = activeId === node.id;
                const currentDropPosition = overId === node.id ? dropPosition : null;
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
                      onSelect={(e) => {
                        const multi = e.ctrlKey || e.metaKey;
                        const range = e.shiftKey;
                        const visibleNodes = flatData.map(i => i.node.id);
                        selectNode(node.id, multi, range, visibleNodes);
                        setFocus(node.id);
                      }}
                      onCheck={showCheckboxes ? () => toggleCheck(node.id) : undefined}
                      renderNode={renderNode}
                      isDraggable={enableDragDrop && isDragEnabled}
                      isBeingDragged={isBeingDragged}
                      dropPosition={currentDropPosition}
                      isMatched={isMatched}
                      isCurrentResult={isCurrentResult}
                      highlightIndices={highlightIndices}
                      isEditing={isEditing}
                      onStartEdit={enableInlineEdit ? () => startEditing(node.id) : undefined}
                      onSaveEdit={enableInlineEdit ? (newLabel) => saveEdit(node.id, newLabel) : undefined}
                      onCancelEdit={enableInlineEdit ? cancelEditing : undefined}
                      onContextMenu={enableContextMenu ? (e) => handleNodeContextMenu(e, node.id) : undefined}
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

          <DragOverlay>
            {activeId ? (
              <div className="bg-white shadow-lg rounded p-2 border-2 border-blue-400">
                {flatData.find(item => item.node.id === activeId)?.node.label}
              </div>
            ) : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>

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