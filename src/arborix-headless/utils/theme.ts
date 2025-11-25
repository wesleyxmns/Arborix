import { cn } from './cn';

/**
 * Utility function to merge class names
 * Re-exported from v1.x for consistency
 */
export { cn };

/**
 * Default theme classes from v1.x
 * These are used as default styles but can be overridden
 */
export const defaultTheme = {
  // Tree container
  treeRoot: 'flex flex-col gap-2',
  treeList: 'relative overflow-auto',

  // Node states
  nodeBase: 'relative flex items-center gap-1 min-h-[36px] py-1 pr-2 rounded select-none transition-all duration-75 outline-none',
  nodeSelected: 'bg-blue-50',
  nodeHover: 'hover:bg-gray-50',
  nodeDragging: 'opacity-40 scale-[0.98] cursor-grabbing',
  nodeDropTarget: 'bg-blue-100 ring-2 ring-blue-500 ring-inset',
  nodeCut: 'opacity-50',
  nodeCursor: 'cursor-grab',

  // Drag indicators
  dropIndicatorBase: 'absolute left-0 right-2 h-0.5 rounded-full pointer-events-none z-20 transition-opacity duration-75',
  dropIndicatorActive: 'bg-blue-500 opacity-100',
  dropIndicatorInactive: 'opacity-0',

  // Icons
  gripIcon: 'w-4 h-4 flex-shrink-0 transition-colors text-gray-300 hover:text-gray-500',
  gripIconActive: 'text-blue-500',
  folderIcon: 'w-4 h-4 text-amber-500 flex-shrink-0',
  fileIcon: 'w-4 h-4 text-slate-400 flex-shrink-0',
  expandButton: 'w-5 h-5 flex items-center justify-center flex-shrink-0 rounded hover:bg-gray-200 focus:outline-none',
  expandButtonHidden: 'invisible',
  chevronIcon: 'w-4 h-4',
  loadingIcon: 'h-3 w-3 animate-spin text-blue-500',
  moreIcon: 'h-4 w-4 text-gray-500',

  // Checkbox
  checkbox: 'form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mr-1',

  // Label
  label: 'flex-1 ml-1 truncate text-sm',

  // Edit input
  editInput: 'flex-1 ml-1 px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm',

  // Context menu button
  contextMenuButton: 'ml-auto p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 opacity-0 group-hover:opacity-100 transition-opacity',

  // Highlight
  highlightMatch: 'bg-yellow-200',
  highlightCurrent: 'bg-orange-300',
} as const;

/**
 * Merge default theme classes with custom classes
 */
export function mergeThemeClasses(
  defaultClass: string,
  customClass?: string | ((state: any) => string),
  state?: any
): string {
  const custom = typeof customClass === 'function' ? customClass(state) : customClass;
  return cn(defaultClass, custom);
}
