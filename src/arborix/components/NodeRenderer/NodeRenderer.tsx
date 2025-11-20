import { DropPosition, TreeNode } from '@/arborix/types';
import type { DraggableAttributes, } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Loader2, Minus, MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HighlightText } from '../HighlightText/HighlightText';

type UseSortableReturnType = ReturnType<typeof useSortable>;
type SyntheticListenerMap = UseSortableReturnType['listeners'];

export interface NodeRendererProps {
  node: TreeNode;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  checkState?: 'checked' | 'unchecked' | 'indeterminate';
  onToggle: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onCheck?: () => void;
  renderNode?: (node: TreeNode) => React.ReactNode;
  isDraggable?: boolean;
  isBeingDragged?: boolean;
  dropPosition?: DropPosition | null;
  onDropPositionChange?: (position: DropPosition | null) => void;
  isMatched?: boolean;
  isCurrentResult?: boolean;
  highlightIndices?: number[];
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSaveEdit?: (newLabel: string) => void;
  onCancelEdit?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  canLoadData?: boolean;

  isFocused?: boolean;
  ariaSetSize?: number;
  ariaPosInSet?: number;

  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export const NodeRenderer = ({
  node,
  depth,
  isOpen,
  isSelected,
  checkState = 'unchecked',
  onToggle,
  onSelect,
  onCheck,
  renderNode,
  isDraggable = true,
  isBeingDragged = false,
  canLoadData = false,
  dropPosition = null,
  onDropPositionChange,
  isMatched = false,
  isCurrentResult = false,
  highlightIndices = [],
  isEditing = false,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onContextMenu,
  isFocused = false,
  ariaSetSize,
  ariaPosInSet,
}: NodeRendererProps) => {
  const [editValue, setEditValue] = useState(node.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const setCombinedRef = (el: HTMLDivElement | null) => {
    setNodeRef(el);
    nodeRef.current = el;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    disabled: !isDraggable || isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = (node.children && node.children.length > 0) || (canLoadData && !node.isLeaf);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(node.label);
    }
  }, [isEditing, node.label]);

  const handleDragOver = (e: React.DragEvent, position: DropPosition) => {
    e.preventDefault();
    e.stopPropagation();
    onDropPositionChange?.(position);
  };

  const handleDragLeave = () => {
    onDropPositionChange?.(null);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && onSaveEdit) {
      onSaveEdit(editValue.trim());
    } else {
      onCancelEdit?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit?.();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing && onStartEdit) {
      e.stopPropagation();
      onStartEdit();
    }
  };

  useEffect(() => {
    if (isFocused && !isDragging && !isEditing && nodeRef.current) {
      nodeRef.current.focus({ preventScroll: true });
    }
  }, [isFocused, isDragging, isEditing]);

  return (
    <div className="relative group">
      {dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}

      <motion.div
        ref={setCombinedRef}
        style={style}
        layout
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-selected={isSelected}
        aria-level={depth + 1}
        aria-setsize={ariaSetSize}
        aria-posinset={ariaPosInSet}
        tabIndex={isFocused ? 0 : -1}

        className={`flex items-center gap-2 py-1 px-2 rounded transition-all outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'
          } ${isDragging || isBeingDragged ? 'shadow-lg opacity-50' : ''} ${dropPosition === 'inside' ? 'bg-blue-50 ring-2 ring-blue-300' : ''
          } ${isCurrentResult ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${isMatched && !isCurrentResult ? 'bg-yellow-50' : ''
          } ${isEditing ? 'ring-2 ring-green-400 bg-green-50' : 'cursor-pointer'}`}

        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={isEditing ? undefined : (e) => {
          onSelect(e);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={onContextMenu}
        onDragOver={(e) => handleDragOver(e, 'inside')}
        onDragLeave={handleDragLeave}

        onKeyDown={(e) => {
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
          }
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1/4"
          onDragOver={(e) => handleDragOver(e, 'before')}
          onDragLeave={handleDragLeave}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-1/4"
          onDragOver={(e) => handleDragOver(e, 'after')}
          onDragLeave={handleDragLeave}
        />

        <div style={{ width: depth * 20 }} />

        {node.isLoading ? (
          <div className="p-1 flex items-center justify-center">
            <Loader2 size={16} className="animate-spin text-blue-500" />
          </div>
        ) : hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center justify-center"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            disabled={isEditing}
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div style={{ width: 24 }} />
        )}

        {onCheck && (
          <div
            className="relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (!isEditing) onCheck();
            }}
          >
            {checkState === 'indeterminate' ? (
              <div className="w-4 h-4 border-2 border-blue-500 rounded flex items-center justify-center bg-blue-500 cursor-pointer">
                <Minus size={12} className="text-white" />
              </div>
            ) : (
              <input
                type="checkbox"
                checked={checkState === 'checked'}
                onChange={() => { }}
                className="cursor-pointer w-4 h-4"
                aria-label={`${checkState === 'checked' ? 'Uncheck' : 'Check'} ${node.label}`}
                disabled={isEditing}
              />
            )}
          </div>
        )}

        <div
          {...(isDraggable && !isEditing ? attributes : {})}
          {...(isDraggable && !isEditing ? listeners : {})}
          className={`flex-1 ${isDraggable && !isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full px-2 py-1 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : renderNode ? (
            renderNode(node)
          ) : (
            <HighlightText
              text={node.label}
              indices={highlightIndices}
              isCurrentResult={isCurrentResult}
            />
          )}
        </div>

        {/* Context Menu Trigger */}
        {onContextMenu && !isEditing && (
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu(e);
            }}
          >
            <MoreVertical size={14} className="text-gray-500" />
          </div>
        )}

      </motion.div>

      {dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}
    </div>
  );
};