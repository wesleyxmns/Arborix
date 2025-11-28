import { useMemo, useEffect, useRef } from 'react';
import { useTreeContext } from '../context/TreeContext';
import { useOptionalItemContext } from '../context/ItemContext';
import type { TreeCheckboxProps, CheckboxState } from '../types';

// ============================================================================
// Checkbox Component - Tri-state checkbox
// ============================================================================

export function Checkbox({
  nodeId: nodeIdProp,
  children,
  as: Component = 'input',
  className,
  style,
  onChange,
}: TreeCheckboxProps) {
  const tree = useTreeContext();
  const itemContext = useOptionalItemContext();
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Use explicit nodeId if provided, otherwise get from ItemContext
  const nodeId = nodeIdProp ?? itemContext?.nodeId;

  if (!nodeId) {
    throw new Error(
      'Tree.Checkbox requires a nodeId prop or must be used within Tree.Item'
    );
  }

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  // Compute checkbox state
  const state: CheckboxState = useMemo(() => {
    const isChecked = tree.state.checkedIds.has(nodeId);
    const isPartiallyChecked = tree.state.partialCheckedIds.has(nodeId);
    const isDisabled = Boolean(node.disabled);

    return {
      isChecked,
      isPartiallyChecked,
      isDisabled,
    };
  }, [nodeId, tree.state.checkedIds, tree.state.partialCheckedIds, node.disabled]);

  // Set indeterminate state on native checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state.isPartiallyChecked;
    }
  }, [state.isPartiallyChecked]);

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (onChange) {
      onChange(e.target.checked, state);
    } else {
      // Default behavior: toggle check
      tree.toggleCheck(nodeId);
    }
  };

  // If using default input element
  if (Component === 'input') {
    return (
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={state.isChecked}
        disabled={state.isDisabled}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        className={className}
        style={style}
        aria-checked={state.isPartiallyChecked ? 'mixed' : state.isChecked}
      />
    );
  }

  // Custom component with render props
  return (
    <Component
      className={className}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.isDisabled) {
          tree.toggleCheck(nodeId);
        }
      }}
    >
      {typeof children === 'function' ? children(state) : children}
    </Component>
  );
}

Checkbox.displayName = 'Tree.Checkbox';
