import type { EventEmitter } from 'eventemitter3';
import { z } from 'zod';
import { VisibleNode } from './utils/flattenTree';

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

// Estado interno completo
export interface TreeState {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  selectedIds: Set<TreeNodeId>;
  checkedIds: Set<TreeNodeId>;
  partialCheckedIds: Set<TreeNodeId>;
  history: TreeData[];
  historyIndex: number;
}

export type SelectionMode = 'none' | 'single' | 'multiple';
export type CheckMode = 'independent' | 'tri-state';

// Drag & Drop types
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


// O nó com as propriedades geométricas calculadas
export interface CalculatedNode extends VisibleNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Props do novo Hook de Layout
export interface UseTreeLayoutProps {
  data: TreeData;
  openIds: Set<TreeNodeId>;
  searchResults?: TreeNodeId[];
  rowHeight: number;
  containerWidth: number;
  containerHeight: number;
  indentation?: number; // Ex: 20px
  scrollTop: number;
}

// Resultado do Hook
export interface UseTreeLayoutResult {
  calculatedNodes: CalculatedNode[];
  totalWidth: number;
  totalHeight: number;
  isVertical: boolean; // Para o Arborix.tsx tomar decisões D&D/Sortable
}

// Schema com lazy correto (sem erro circular)
export const NodeSchema: z.ZodType<TreeNode> = z.object({
  id: z.union([z.string(), z.number()]),
  label: z.string(),
  children: z.array(z.lazy(() => NodeSchema)).optional(),
  isOpen: z.boolean().optional(),
  isLoading: z.boolean().optional(),
  isLeaf: z.boolean().optional(), // <--- NOVO
  disabled: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
}).passthrough();