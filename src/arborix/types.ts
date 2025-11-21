import type EventEmitter from 'eventemitter3';
import { z } from 'zod';
import { VisibleNode } from './utils/flattenTree';
import { ContextMenuItem } from './components/ContextMenu/ContextMenu';

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
  showExpandButtons?: boolean;
  filterFn?: FilterFn;
  plugins?: TreePlugin[];
  renderNode?: (node: any) => React.ReactNode;
  onDataChange?: (data: TreeData) => void;
  onLoadData?: (node: TreeNode) => Promise<TreeNode[] | void>;

  // Context Menu Customization
  contextMenuOptions?: {
    rename?: boolean;
    duplicate?: boolean;
    cut?: boolean;
    copy?: boolean;
    paste?: boolean;
    addChild?: boolean;
    addSibling?: boolean;
    delete?: boolean;
  };
  customContextMenuItems?: (node: TreeNode) => ContextMenuItem[];
  nodeClassName?: string;
}

export type TreeNodeId = string | number;

export type FilterFn = (node: TreeNode) => boolean;

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

export type SelectionMode = 'none' | 'single' | 'multiple';
export type CheckMode = 'independent' | 'tri-state';

export type DropPosition = 'before' | 'after' | 'inside';

export interface DragDropEvent {
  draggedId: TreeNodeId;
  targetId: TreeNodeId;
  position: DropPosition;
}

export interface TreePlugin {
  name: string;
  setup: (tree: TreeInstance) => (() => void) | void;
}

export interface TreeInstance {
  emitter: EventEmitter;
  getState: () => TreeState;
  update: (updater: (draft: TreeState) => void) => void;
  undo: () => void;
  redo: () => void;
}

export type FlatNode = TreeNode & {
  parentId: TreeNodeId | null;
  depth: number;
  index: number;
};

export interface CalculatedNode extends VisibleNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseTreeLayoutProps {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  searchResults?: TreeNodeId[];
  rowHeight: number;
  containerWidth: number;
  containerHeight: number;
  indentation?: number;
  scrollTop: number;
}

export interface UseTreeLayoutResult {
  calculatedNodes: CalculatedNode[];
  totalWidth: number;
  totalHeight: number;
  isVertical: boolean;
}

export const NodeSchema: z.ZodType<TreeNode> = z.object({
  id: z.union([z.string(), z.number()]),
  label: z.string(),
  children: z.array(z.lazy(() => NodeSchema)).optional(),
  isOpen: z.boolean().optional(),
  isLoading: z.boolean().optional(),
  isLeaf: z.boolean().optional(),
  disabled: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
}).passthrough();

