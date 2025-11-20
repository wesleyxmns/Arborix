import { GripVertical } from 'lucide-react';
import { TreeNode } from '../../types';

export interface TreeToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddNode: () => void;
  clipboard: {
    nodes: TreeNode[];
    mode: 'cut' | 'copy';
  } | null;
  selectedCount: number;
  checkedCount: number;
  showCheckboxes: boolean;

  // Drag & Drop Toggle
  enableDragDrop: boolean;
  isDragEnabled: boolean;
  onToggleDrag: () => void;

  // Expand/Collapse All
  showExpandButtons?: boolean;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;

  // Paste
  onPaste?: () => void;
}

export const TreeToolbar: React.FC<TreeToolbarProps> = ({
  undo,
  redo,
  canUndo,
  canRedo,
  onAddNode,
  clipboard,
  selectedCount,
  checkedCount,
  showCheckboxes,
  enableDragDrop,
  isDragEnabled,
  onToggleDrag,
  showExpandButtons = false,
  onExpandAll,
  onCollapseAll,
  onPaste,
}) => {
  return (
    <div className="flex items-center gap-2">
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

      <button
        onClick={onAddNode}
        className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        title="Add root node"
      >
        + Add Node
      </button>

      {showExpandButtons && onExpandAll && onCollapseAll && (
        <div className="flex gap-1">
          <button
            onClick={onExpandAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            title="Expand all nodes"
          >
            ⊕ Expand All
          </button>
          <button
            onClick={onCollapseAll}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            title="Collapse all nodes"
          >
            ⊖ Collapse All
          </button>
        </div>
      )}

      {onPaste && (
        <button
          onClick={onPaste}
          disabled={!clipboard}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Paste (Cmd/Ctrl + V)"
        >
          📋 Paste
        </button>
      )}

      {enableDragDrop && (
        <button
          onClick={onToggleDrag}
          className={`px-2 py-1 text-sm border rounded flex items-center gap-1 transition-colors ${isDragEnabled
            ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
            : 'hover:bg-gray-100 text-gray-500'
            }`}
          title={isDragEnabled ? "Disable Drag & Drop" : "Enable Drag & Drop"}
        >
          <GripVertical size={14} />
          {isDragEnabled ? 'Drag On' : 'Drag Off'}
        </button>
      )}

      {clipboard && (
        <div className="text-xs text-gray-500 px-2 py-1 bg-blue-50 border border-blue-200 rounded">
          {clipboard.mode === 'cut' ? '✂️' : '📋'} {clipboard.nodes.length} item(s)
        </div>
      )}

      <div className="text-xs text-gray-500 ml-auto">
        {selectedCount > 0 && `${selectedCount} selected`}
        {showCheckboxes && checkedCount > 0 && ` • ${checkedCount} checked`}
      </div>
    </div>
  );
};
