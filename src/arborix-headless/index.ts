// ============================================================================
// Arborix v2.0.0 - Headless UI
// ============================================================================

// Compound Components
import { Root } from './components/Root';
import { List } from './components/List';
import { Item } from './components/Item';
import { Trigger } from './components/Trigger';
import { Checkbox } from './components/Checkbox';
import { Label } from './components/Label';
import { Content } from './components/Content';
import { StyledItem } from './components/StyledItem';
import { RootDropZone } from './components/RootDropZone';
import { Auto } from './components/Auto';

// Import hooks for namespace
import { useTree } from './context/TreeContext';
import { useTreeItem } from './hooks/useTreeItem';
import { useTreeHelpers } from './hooks/useTreeHelpers';


// Namespace export for <Tree.Root> syntax
export const Tree = {
  Root,
  List,
  Item,
  StyledItem, // Item with v1.x default styling
  RootDropZone,
  Trigger,
  Checkbox,
  Label,
  Content,
  Auto, // NEW: Automatic rendering without recursion
  // Also expose hooks in the namespace
  useTree,
  useTreeItem,
  useTreeHelpers, // NEW: Helper functions
};

// Individual exports
export { Root, List, Item, StyledItem, RootDropZone, Trigger, Checkbox, Label, Content, Auto };

// UI Components (from v1.x)
export { ContextMenu, useContextMenu, ContextMenuIcons } from './components/ContextMenu';
export type { ContextMenuItem, ContextMenuProps } from './components/ContextMenu';
export { TreeToolbar } from './components/TreeToolbar';
export type { TreeToolbarProps } from './components/TreeToolbar';
export { SearchBar } from './components/SearchBar';
export type { SearchBarProps } from './components/SearchBar';
export { HighlightText } from './components/HighlightText';
export type { HighlightTextProps } from './components/HighlightText';

// ============================================================================
// Hooks
// ============================================================================

export {
  useTree,
  useTreeContext,
  useTreeItem,
  useVirtualization,
  useVirtualizationContext,
  useDragDrop,
  useDragDropContext,
  useTreeKeyboardNavigation,
  useItemContext, // NEW: Access Item context
  useOptionalItemContext, // NEW: Optional Item context
  useTreeHelpers, // NEW: Helper functions
} from './hooks';

// ============================================================================
// Types
// ============================================================================

export type {
  // Core types
  TreeNode,
  TreeData,
  TreeNodeId,
  TreeState,
  FlatNode,
  TreeAction,
  ContextMenuOptions,
  CustomActionButton,

  // Context types
  TreeContextValue,
  VirtualizationContextValue,
  DragDropContextValue,

  // Component props
  TreeRootProps,
  TreeListProps,
  TreeItemProps,
  TreeTriggerProps,
  TreeCheckboxProps,
  TreeLabelProps,
  TreeContentProps,

  // Render state types
  ItemRenderState,
  TriggerState,
  CheckboxState,
  LabelState,

  // Utility types
  DropPosition,
  CheckState,
  FilterFn,
  DragDropEvent,
  PolymorphicProps,
} from './types';

// ============================================================================
// Utilities
// ============================================================================

export { TreeDataBuilder } from '../arborix/builder';
export { TreeRecipes } from './utils/TreeRecipes'; // NEW: Utility functions
export { getVisibleNodes, getVisibleNodesWithDepth } from './utils/getVisibleNodes'; // NEW: Helper utilities

// ============================================================================
// Presets
// ============================================================================

export { SimpleTree } from './presets/SimpleTree'; // NEW: Zero-config preset
export type { SimpleTreeProps } from './presets/SimpleTree';
