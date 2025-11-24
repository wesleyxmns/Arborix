import { memo, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, GripVertical, MoreVertical, Loader2 } from 'lucide-react';
import { NodeRendererProps } from '../../types';
import { cn } from '../../utils/cn';
import { HighlightText } from '../HighlightText/HighlightText';
import { useDragDrop } from '../../hooks/useDragDrop';

interface ExtendedNodeRendererProps extends NodeRendererProps {
  dragDrop: ReturnType<typeof useDragDrop>;
  isDragEnabled?: boolean;
}

export const NodeRenderer = memo(({
  node,
  depth,
  style,
  onToggle,
  onSelect,
  isSelected,
  isEditing,
  isCurrentResult,
  highlightIndices,
  onContextMenu,
  checkState,
  onCheck,
  canLoadData,
  isOpen,
  ariaSetSize,
  ariaPosInSet,
  dragDrop,
  isDragEnabled = true,
  renderNode,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isCut
}: ExtendedNodeRendererProps) => {
  const {
    activeId,
    overId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = dragDrop;

  const [localEditValue, setLocalEditValue] = useState(node.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const hasChildren = node.children && node.children.length > 0;
  const isFolder = (node.children !== undefined) || (canLoadData && !node.isLeaf);

  const isActive = activeId === node.id;
  const isOver = overId === node.id;

  const showBefore = isOver && dropPosition === 'before';
  const showAfter = isOver && dropPosition === 'after';
  const showInside = isOver && dropPosition === 'inside';

  const indent = depth * 24;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setLocalEditValue(node.label);
    }
  }, [isEditing, node.label]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = checkState === 'indeterminate';
    }
  }, [checkState]);

  const onLocalSaveEdit = () => {
    if (onSaveEdit && localEditValue.trim()) {
      onSaveEdit(localEditValue.trim());
    } else {
      onCancelEdit?.();
    }
  };

  const onLocalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onLocalSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit?.();
    }
  };

  // Handler local para dragOver que passa o node.id
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragOver(e, node.id);
  };

  // Handler local para dragStart que passa o node.id
  const onDragStart = (e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    handleDragStart(e, node.id);
  };

  return (
    <div style={style} className="absolute w-full" ref={nodeRef}>
      <div className="relative h-full group">
        {/* BEFORE indicator - linha acima */}
        <div
          className={cn(
            "absolute left-0 right-2 h-0.5 rounded-full pointer-events-none z-20",
            "transition-opacity duration-75",
            showBefore ? "bg-blue-500 opacity-100" : "opacity-0"
          )}
          style={{ marginLeft: `${indent}px`, top: 0 }}
        />

        <div
          draggable={isDragEnabled && !isEditing}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(e);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            // Apenas ativa edit se NÃO estiver clicando em botão, ícone ou input
            const target = e.target as HTMLElement;
            if (
              target.tagName !== 'BUTTON' &&
              target.tagName !== 'svg' &&
              target.tagName !== 'INPUT' &&
              !target.closest('button')
            ) {
              if (!isEditing && onStartEdit) onStartEdit();
              else if (isFolder) onToggle();
            }
          }}
          onContextMenu={onContextMenu}
          className={cn(
            "relative flex items-center gap-1 h-full pr-2 rounded select-none",
            "transition-all duration-75 outline-none",
            // Cursor
            isEditing ? "cursor-text" : "cursor-grab",
            isActive && "cursor-grabbing",
            // Estados visuais
            isActive && "opacity-40 scale-[0.98]",
            isSelected && !isActive && "bg-blue-50",
            !isSelected && !isActive && "hover:bg-gray-50",
            showInside && "bg-blue-100 ring-2 ring-blue-500 ring-inset",
            isCut && "opacity-50"
          )}
          style={{ paddingLeft: `${indent}px` }}
          role="treeitem"
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-selected={isSelected}
          aria-level={depth + 1}
          aria-setsize={ariaSetSize}
          aria-posinset={ariaPosInSet}
          tabIndex={isEditing ? -1 : 0}
        >
          {/* Grip handle */}
          <GripVertical
            className={cn(
              "w-4 h-4 flex-shrink-0 transition-colors",
              isActive ? "text-blue-500" : "text-gray-300 hover:text-gray-500"
            )}
          />

          {/* Expand/collapse button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isFolder || canLoadData) onToggle();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "w-5 h-5 flex items-center justify-center flex-shrink-0 rounded",
              "hover:bg-gray-200 focus:outline-none",
              (!isFolder && !canLoadData) && "invisible"
            )}
          >
            {canLoadData && node.isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
            ) : (isFolder || canLoadData) && (
              isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Checkbox */}
          {checkState !== undefined && (
            <input
              type="checkbox"
              checked={checkState === 'checked'}
              ref={checkboxRef}
              onChange={(e) => { e.stopPropagation(); onCheck?.(e); }}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mr-1"
            />
          )}

          {/* Icon */}
          {isFolder ? (
            <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
          ) : (
            <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )}

          {/* Label / Edit input */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={localEditValue}
              onChange={(e) => setLocalEditValue(e.target.value)}
              onKeyDown={onLocalKeyDown}
              onBlur={onLocalSaveEdit}
              className="flex-1 ml-1 px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : renderNode ? (
            <div className="flex-1 ml-1">{renderNode(node)}</div>
          ) : (
            <div className="flex-1 ml-1 truncate text-sm">
              <HighlightText
                text={node.label}
                indices={highlightIndices || []}
                isCurrentResult={isCurrentResult}
              />
            </div>
          )}

          {/* Context menu button */}
          {onContextMenu && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e);
              }}
              className={cn(
                "ml-auto p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
              aria-label="More actions"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* AFTER indicator - linha abaixo */}
        <div
          className={cn(
            "absolute left-0 right-2 h-0.5 rounded-full pointer-events-none z-20",
            "transition-opacity duration-75",
            showAfter ? "bg-blue-500 opacity-100" : "opacity-0"
          )}
          style={{ marginLeft: `${indent}px`, bottom: 0 }}
        />
      </div>
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';