import type { CSSProperties, ElementType, ReactNode } from 'react';

// ============================================================================
// Core Types
// ============================================================================

// Custom Action Button
export interface CustomActionButton {
  id: string;
  icon: ReactNode;
  tooltip?: string;
  action: (node: TreeNode) => void;
  visible?: (node: TreeNode) => boolean;
  danger?: boolean;
}

export type TreeNodeId = string | number;

export interface TreeNode {
  id: TreeNodeId;
  label: string;
  children?: TreeNode[];
  isOpen?: boolean;
  isLoading?: boolean;
  isLeaf?: boolean;
  disabled?: boolean;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export type TreeData = TreeNode[];

// ============================================================================
// State Types
// ============================================================================

export interface TreeState {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  selectedIds: Set<TreeNodeId>;
  checkedIds: Set<TreeNodeId>;
  partialCheckedIds: Set<TreeNodeId>;
  cutNodeIds: Set<TreeNodeId>;
  history: TreeData[];
  historyIndex: number;
}

export interface FlatNode {
  node: TreeNode;
  parentId: TreeNodeId | null;
  depth: number;
  index: number;
}

// ============================================================================
// Context Types
// ============================================================================

export interface TreeContextValue {
  // State
  state: TreeState;
  focusedNodeId: TreeNodeId | null;
  editingNodeId: TreeNodeId | null;

  // Tree operations
  toggleOpen: (id: TreeNodeId) => void;
  selectNode: (id: TreeNodeId, multi?: boolean, range?: boolean, visibleNodes?: TreeNodeId[]) => void;
  clearSelection: () => void;
  selectAllNodes: (visibleNodes: TreeNodeId[]) => void;
  expandAll: () => void;
  collapseAll: () => void;
  toggleCheck: (id: TreeNodeId) => void;
  getCheckState: (id: TreeNodeId) => 'checked' | 'unchecked' | 'indeterminate';

  // Context Menu
  contextMenuOptions?: ContextMenuOptions;
  customContextMenuItems?: (node: TreeNode) => ContextMenuItem[];

  // Custom Action Buttons
  customActionButtons?: CustomActionButton[];

  // Focus & editing
  setFocus: (id: TreeNodeId | null) => void;
  startEditing: (id: TreeNodeId) => void;
  saveEdit: (id: TreeNodeId, newLabel: string) => void;
  cancelEditing: () => void;

  // CRUD operations
  addNode: (parentId: TreeNodeId | null, label: string) => TreeNodeId;
  insertNode: (targetId: TreeNodeId, position: 'before' | 'after' | 'inside', node: TreeNode) => void;
  deleteNode: (id: TreeNodeId) => void;
  duplicateNode: (id: TreeNodeId) => TreeNodeId | null;
  updateNode: (id: TreeNodeId, updates: Partial<TreeNode>) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  commit: () => void;

  // Utilities
  findNode: (data: TreeData, id: TreeNodeId) => TreeNode | null;
  findParent: (data: TreeData, childId: TreeNodeId) => TreeNode | null;
  getNodeDepth: (id: TreeNodeId) => number;
  getNodePath: (id: TreeNodeId) => TreeNodeId[];
  setData: (data: TreeData) => void;

  // Clipboard
  cutNode: (ids: TreeNodeId[]) => void;
  copyNode: (ids: TreeNodeId[]) => void;
  pasteNode: (targetId: TreeNodeId | null) => void;
  clipboard: { type: 'cut' | 'copy'; nodes: TreeNode[] } | null;
  clearCutNodes: () => void;

  // Callbacks
  onDataChange?: (data: TreeData) => void;
  onLoadData?: (node: TreeNode) => Promise<TreeNode[] | void>;
  onAction?: (action: TreeAction) => void;

  // Custom Icons
  folderIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;
}

export interface VirtualizationContextValue {
  flatData: FlatNode[];
  totalHeight: number;
  virtualRows: any[]; // VirtualItem from @tanstack/react-virtual
  virtualizer: any; // Virtualizer instance
  scrollToNode: (id: TreeNodeId) => void;
}

export interface DragDropContextValue {
  activeId: TreeNodeId | null;
  overId: TreeNodeId | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, nodeId: TreeNodeId) => void;
  handleDragOver: (e: React.DragEvent, nodeId: TreeNodeId) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleRootDragOver?: (e: React.DragEvent) => void;
  handleRootDrop?: (e: React.DragEvent) => void;
}

// ============================================================================
// Context Menu Types
// ============================================================================

export interface ContextMenuItem {
  id: string;
  label: string;
  shortcutLabel?: string;
  icon?: React.ReactNode;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuOptions {
  rename?: boolean;
  duplicate?: boolean;
  cut?: boolean;
  copy?: boolean;
  paste?: boolean;
  addChild?: boolean;
  addSibling?: boolean;
  delete?: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface PolymorphicProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export interface TreeRootProps extends PolymorphicProps {
  data: TreeData;
  onDataChange?: (data: TreeData) => void;

  // Features
  enableDragDrop?: boolean;
  enableVirtualization?: boolean;

  // Virtualization config
  height?: number;
  rowHeight?: number;
  overscan?: number;

  // State persistence
  persistenceKey?: string;

  // Lazy loading
  onLoadData?: (node: TreeNode) => Promise<TreeNode[] | void>;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  contextMenuOptions?: ContextMenuOptions;
  customContextMenuItems?: (node: TreeNode) => ContextMenuItem[];
  onAction?: (action: TreeAction) => void;
  onContextMenu?: (e: React.MouseEvent, items: ContextMenuItem[]) => void;

  // Custom Action Buttons
  customActionButtons?: CustomActionButton[];

  // Custom Icons
  folderIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;

  children: ReactNode;
}

export interface TreeListProps extends PolymorphicProps {
  children: ReactNode;
}

// ============================================================================
// Item Render State (for render props)
// ============================================================================

export interface ItemRenderState {
  node: TreeNode;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isChecked: boolean;
  isPartiallyChecked: boolean;
  isCut: boolean;
  hasChildren: boolean;
  isEditing: boolean;
  isLoading: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

export interface TreeItemProps extends Omit<PolymorphicProps, 'className' | 'style'> {
  nodeId: TreeNodeId;
  children: ReactNode | ((state: ItemRenderState) => ReactNode);
  className?: string | ((state: ItemRenderState) => string);
  style?: CSSProperties | ((state: ItemRenderState) => CSSProperties);
  onClick?: (e: React.MouseEvent, state: ItemRenderState) => void;
  onDoubleClick?: (e: React.MouseEvent, state: ItemRenderState) => void;
  onContextMenu?: (e: React.MouseEvent, state: ItemRenderState) => void;
}

// ============================================================================
// Trigger (Expand/Collapse Button)
// ============================================================================

export interface TriggerState {
  isOpen: boolean;
  hasChildren: boolean;
  isDisabled: boolean;
  isLoading: boolean;
}

export interface TreeTriggerProps extends Omit<PolymorphicProps, 'className'> {
  nodeId: TreeNodeId;
  children?: ReactNode | ((state: TriggerState) => ReactNode);
  className?: string | ((state: TriggerState) => string);
  onClick?: (e: React.MouseEvent, state: TriggerState) => void;
}

// ============================================================================
// Checkbox
// ============================================================================

export interface CheckboxState {
  isChecked: boolean;
  isPartiallyChecked: boolean;
  isDisabled: boolean;
}

export interface TreeCheckboxProps extends PolymorphicProps {
  nodeId: TreeNodeId;
  children?: ReactNode | ((state: CheckboxState) => ReactNode);
  onChange?: (checked: boolean, state: CheckboxState) => void;
}

// ============================================================================
// Label (with inline editing)
// ============================================================================

export interface LabelState {
  node: TreeNode;
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface TreeLabelProps extends PolymorphicProps {
  nodeId: TreeNodeId;
  editable?: boolean;
  children?: ReactNode | ((state: LabelState) => ReactNode);
  onEditStart?: (node: TreeNode) => void;
  onEditComplete?: (node: TreeNode, newLabel: string) => void;
  onEditCancel?: (node: TreeNode) => void;
}

// ============================================================================
// Content (custom node content)
// ============================================================================

export interface TreeContentProps extends PolymorphicProps {
  nodeId: TreeNodeId;
  children: ReactNode | ((node: TreeNode, state: ItemRenderState) => ReactNode);
}

// ============================================================================
// Utility Types
// ============================================================================

export type DropPosition = 'before' | 'after' | 'inside';

export type CheckState = 'checked' | 'unchecked' | 'indeterminate';

export type FilterFn = (node: TreeNode) => boolean;

export interface DragDropEvent {
  draggedId: TreeNodeId;
  targetId: TreeNodeId;
  position: DropPosition;
}

export type TreeAction =
  | { type: 'copy'; items: TreeNode[] }
  | { type: 'cut'; items: TreeNode[] }
  | { type: 'paste'; items: TreeNode[]; targetId: TreeNodeId | null }
  | { type: 'move'; items: TreeNode[]; targetId: TreeNodeId; position: DropPosition }
  | { type: 'delete'; items: TreeNodeId[] }
  | { type: 'duplicate'; nodeId: TreeNodeId };
