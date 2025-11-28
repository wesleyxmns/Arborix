import type { ReactNode } from 'react';
import { List } from './List';
import { Item } from './Item';
import { Trigger } from './Trigger';
import { Checkbox } from './Checkbox';
import { Label } from './Label';
import type { TreeNodeId, ItemRenderState } from '../types';

// ============================================================================
// Auto Component - Automatic tree rendering without manual recursion
// ============================================================================

export interface AutoProps {
  /**
   * Custom render function for each item
   * If not provided, uses default rendering
   */
  renderItem?: (nodeId: TreeNodeId, state: ItemRenderState) => ReactNode;

  /**
   * Show checkboxes for each node
   * @default false
   */
  showCheckbox?: boolean;

  /**
   * Show expand/collapse triggers for parent nodes
   * @default true
   */
  showTrigger?: boolean;

  /**
   * Enable inline editing on labels
   * @default false
   */
  editable?: boolean;

  /**
   * Show icons (folder/file icons from tree context)
   * @default false
   */
  showIcon?: boolean;

  /**
   * Custom className for each item
   */
  itemClassName?: string | ((state: ItemRenderState) => string);

  /**
   * Custom style for each item
   */
  itemStyle?: React.CSSProperties | ((state: ItemRenderState) => React.CSSProperties);

  /**
   * Custom className for the list container
   */
  listClassName?: string;

  /**
   * Custom style for the list container
   */
  listStyle?: React.CSSProperties;
}

/**
 * Tree.Auto - Automatically renders tree without manual recursion
 *
 * This component handles the complexity of rendering a tree structure,
 * eliminating the need for manual recursion and reducing boilerplate.
 *
 * @example
 * ```tsx
 * // Zero configuration - just works!
 * <Tree.Root data={data} onDataChange={setData}>
 *   <Tree.Auto />
 * </Tree.Root>
 *
 * // With options
 * <Tree.Root data={data} onDataChange={setData}>
 *   <Tree.Auto
 *     showCheckbox
 *     editable
 *     showIcon
 *   />
 * </Tree.Root>
 *
 * // With custom rendering
 * <Tree.Root data={data} onDataChange={setData}>
 *   <Tree.Auto
 *     renderItem={(nodeId, state) => (
 *       <div className={state.isSelected ? 'selected' : ''}>
 *         {state.hasChildren && <span>{state.isOpen ? '▼' : '▶'}</span>}
 *         <span>{state.node.label}</span>
 *       </div>
 *     )}
 *   />
 * </Tree.Root>
 * ```
 */
export function Auto({
  renderItem,
  showCheckbox = false,
  showTrigger = true,
  editable = false,
  showIcon = false,
  itemClassName,
  itemStyle,
  listClassName,
  listStyle,
}: AutoProps = {}) {
  return (
    <List className={listClassName} style={listStyle}>
      {({ visibleNodes }) =>
        visibleNodes.map((nodeId) => (
          <Item
            key={nodeId}
            nodeId={nodeId}
            className={itemClassName}
            style={itemStyle}
          >
            {(state) => {
              // If custom render provided, use it
              if (renderItem) {
                return renderItem(nodeId, state);
              }

              // Otherwise, use default rendering
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingLeft: `${state.depth * 20}px`,
                    padding: '4px 8px',
                  }}
                >
                  {/* Trigger for expand/collapse */}
                  {showTrigger && state.hasChildren && (
                    <Trigger>
                      {({ isOpen }) => (
                        <span style={{ fontSize: '12px', cursor: 'pointer' }}>
                          {isOpen ? '▼' : '▶'}
                        </span>
                      )}
                    </Trigger>
                  )}

                  {/* Spacer if no children */}
                  {showTrigger && !state.hasChildren && (
                    <span style={{ width: '12px', display: 'inline-block' }} />
                  )}

                  {/* Checkbox */}
                  {showCheckbox && (
                    <Checkbox>
                      {({ isChecked, isPartiallyChecked }) => (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = isPartiallyChecked;
                          }}
                          readOnly
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </Checkbox>
                  )}

                  {/* Icon */}
                  {showIcon && (
                    <span>{state.hasChildren ? '📁' : '📄'}</span>
                  )}

                  {/* Label */}
                  <Label editable={editable}>
                    {({ node, isEditing, value, onChange, onSave, onCancel }) =>
                      isEditing ? (
                        <input
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSave();
                            if (e.key === 'Escape') onCancel();
                          }}
                          onBlur={onSave}
                          autoFocus
                          style={{
                            border: '1px solid #2196f3',
                            borderRadius: '2px',
                            padding: '2px 4px',
                            outline: 'none',
                          }}
                        />
                      ) : (
                        <span>{node.label}</span>
                      )
                    }
                  </Label>
                </div>
              );
            }}
          </Item>
        ))
      }
    </List>
  );
}

Auto.displayName = 'Tree.Auto';
