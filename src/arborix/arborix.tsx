import { DndContext, DragOverlay, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { NodeRenderer } from './components/NodeRenderer/NodeRenderer';
import { SearchBar } from './components/SearchBar/SearchBar';
import { TreeToolbar } from './components/TreeToolbar/TreeToolbar';
import { useArborix } from './hooks/useArborix';
import type { ArborixProps, TreeNodeId } from './types';
import { useEffect } from 'react';

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

  const { undo, redo, canUndo, canRedo, addNode, startEditing, saveEdit, cancelEditing,
    selectNode, toggleCheck, getCheckState, setFocus, editingNodeId, focusedNodeId, clearSelection
  } = stateHook;

  const { activeId, overId, dropPosition, handleDragStart, handleDragOver, handleDragCancel } = dragDropHook;
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
        onPaste={() => {
          const targetId = state.selectedIds.size > 0
            ? Array.from(state.selectedIds)[0]
            : null;
          clipboardHook.pasteNode(targetId);
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

      <DndContext
        sensors={sensors}
        {...dndConfig}
        onDragStart={(event: DragStartEvent) => handleDragStart(event.active.id as TreeNodeId)}
        onDragOver={(event: DragOverEvent) => {
          if (event.over && event.active.id !== event.over.id) {
            handleDragOver(event.over.id as TreeNodeId, 'inside');
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

                        // 3 Zones Logic (Ant Design style)
                        const threshold = height * 0.33;

                        if (y < threshold) {
                          handleDragOver(node.id, 'before');
                        } else if (y > height - threshold) {
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
                      onSelect={(e: React.MouseEvent) => {
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
            {enableDragDrop && activeId && (
              <div
                style={{
                  height: '50px',
                  marginTop: '10px',
                  border: overId === 'root' ? '2px dashed #3b82f6' : '2px dashed transparent',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: overId === 'root' ? '#3b82f6' : '#9ca3af',
                  transition: 'all 0.2s',
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver('root', 'inside');
                }}
              >
                Mover para a Raiz
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="bg-white shadow-2xl rounded-lg p-3 border-2 border-blue-500 
                              flex items-center gap-2 backdrop-blur-sm bg-opacity-95">
                <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor" className="text-gray-400">
                  <circle cx="3" cy="3" r="1" />
                  <circle cx="3" cy="6" r="1" />
                  <circle cx="3" cy="9" r="1" />
                  <circle cx="9" cy="3" r="1" />
                  <circle cx="9" cy="6" r="1" />
                  <circle cx="9" cy="9" r="1" />
                </svg>
                <span className="font-medium text-gray-700">
                  {flatData.find(item => item.node.id === activeId)?.node.label}
                </span>
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