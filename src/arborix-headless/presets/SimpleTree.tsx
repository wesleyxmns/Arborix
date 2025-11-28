import { Root } from '../components/Root';
import { Auto } from '../components/Auto';
import type { TreeData } from '../types';

// ============================================================================
// SimpleTree Preset - Zero-config tree component
// ============================================================================

export interface SimpleTreeProps {
  /**
   * Tree data
   */
  data: TreeData;

  /**
   * Callback when data changes
   */
  onDataChange?: (data: TreeData) => void;

  /**
   * Show checkboxes for selection
   * @default false
   */
  showCheckboxes?: boolean;

  /**
   * Enable inline editing of labels
   * @default false
   */
  editable?: boolean;

  /**
   * Show folder/file icons
   * @default false
   */
  showIcons?: boolean;

  /**
   * Enable drag and drop
   * @default false
   */
  enableDragDrop?: boolean;

  /**
   * Enable virtualization for large trees
   * @default true
   */
  enableVirtualization?: boolean;

  /**
   * Row height for virtualization
   * @default 32
   */
  rowHeight?: number;

  /**
   * Persist state to localStorage
   */
  persistenceKey?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * Custom className for the root container
   */
  className?: string;

  /**
   * Custom className for the list
   */
  listClassName?: string;

  /**
   * Height for virtualized list
   */
  height?: number;
}

/**
 * SimpleTree - Pre-configured tree component with sensible defaults
 *
 * Perfect for getting started quickly without configuration complexity.
 *
 * @example
 * ```tsx
 * import { SimpleTree } from 'arborix';
 *
 * function App() {
 *   const [data, setData] = useState(myTreeData);
 *
 *   return (
 *     <SimpleTree
 *       data={data}
 *       onDataChange={setData}
 *       showCheckboxes
 *       editable
 *     />
 *   );
 * }
 * ```
 */
export function SimpleTree({
  data,
  onDataChange,
  showCheckboxes = false,
  editable = false,
  showIcons = false,
  enableDragDrop = false,
  enableVirtualization = true,
  rowHeight = 32,
  persistenceKey,
  className,
  listClassName,
  height,
  'aria-label': ariaLabel = 'Tree',
}: SimpleTreeProps) {
  return (
    <Root
      data={data}
      onDataChange={onDataChange}
      enableDragDrop={enableDragDrop}
      enableVirtualization={enableVirtualization}
      rowHeight={rowHeight}
      height={height}
      persistenceKey={persistenceKey}
      aria-label={ariaLabel}
      className={className}
    >
      <Auto
        showCheckbox={showCheckboxes}
        editable={editable}
        showIcon={showIcons}
        listClassName={listClassName}
      />
    </Root>
  );
}

SimpleTree.displayName = 'SimpleTree';
