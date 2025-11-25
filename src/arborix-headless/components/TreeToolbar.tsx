import {
  CheckSquare,
  FolderPlus,
  GripVertical,
  Maximize2,
  Minimize2,
  Plus,
  Redo2,
  Undo2
} from 'lucide-react';

export interface TreeToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddNode: () => void;
  onAddFolder?: () => void;
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
}

const IconButton = ({
  onClick,
  disabled,
  title,
  children,
  active = false
}: {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-1.5 rounded-md transition-colors
      ${active
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
      }
      disabled:opacity-40 disabled:cursor-not-allowed
    `}
    title={title}
  >
    {children}
  </button>
);

const Separator = () => <div className="w-px h-4 bg-gray-200 mx-1" />;

export const TreeToolbar: React.FC<TreeToolbarProps> = ({
  undo,
  redo,
  canUndo,
  canRedo,
  onAddNode,
  onAddFolder,
  selectedCount,
  checkedCount,
  showCheckboxes,
  enableDragDrop,
  isDragEnabled,
  onToggleDrag,
  showExpandButtons = false,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 border-b bg-white">
      {/* History Group */}
      <div className="flex items-center gap-0.5">
        <IconButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 size={16} />
        </IconButton>
        <IconButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
          <Redo2 size={16} />
        </IconButton>
      </div>

      <Separator />

      {/* Actions Group */}
      <div className="flex items-center gap-0.5">
        <IconButton onClick={onAddNode} title="Add Item">
          <Plus size={16} />
        </IconButton>
        {onAddFolder && (
          <IconButton onClick={onAddFolder} title="Add Folder">
            <FolderPlus size={16} />
          </IconButton>
        )}
      </div>

      {(showExpandButtons || enableDragDrop) && <Separator />}

      {/* View/State Group */}
      <div className="flex items-center gap-0.5">
        {showExpandButtons && onExpandAll && onCollapseAll && (
          <>
            <IconButton onClick={onExpandAll} title="Expand All">
              <Maximize2 size={16} />
            </IconButton>
            <IconButton onClick={onCollapseAll} title="Collapse All">
              <Minimize2 size={16} />
            </IconButton>
          </>
        )}

        {enableDragDrop && (
          <IconButton
            onClick={onToggleDrag}
            active={isDragEnabled}
            title={isDragEnabled ? "Disable Drag & Drop" : "Enable Drag & Drop"}
          >
            <GripVertical size={16} />
          </IconButton>
        )}
      </div>

      {/* Stats (Right aligned) */}
      <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 px-2">
        {selectedCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {selectedCount} selected
          </span>
        )}
        {showCheckboxes && checkedCount > 0 && (
          <span className="flex items-center gap-1.5">
            <CheckSquare size={12} />
            {checkedCount} checked
          </span>
        )}
      </div>
    </div>
  );
};
