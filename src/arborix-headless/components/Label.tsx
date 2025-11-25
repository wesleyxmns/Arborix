import { useMemo, useState, useEffect, useRef } from 'react';
import { useTreeContext } from '../context/TreeContext';
import type { TreeLabelProps, LabelState } from '../types';

// ============================================================================
// Label Component - Node label with inline editing
// ============================================================================

export function Label({
  nodeId,
  editable = false,
  children,
  as: Component = 'span',
  className,
  style,
  onEditStart,
  onEditComplete,
  onEditCancel,
}: TreeLabelProps) {
  const tree = useTreeContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  const isEditing = tree.editingNodeId === nodeId;
  const [localValue, setLocalValue] = useState(node.label);

  // Sync local value with node label
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(node.label);
    }
  }, [isEditing, node.label]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Compute label state
  const state: LabelState = useMemo(() => ({
    node,
    isEditing,
    value: localValue,
    onChange: setLocalValue,
    onSave: () => {
      if (localValue.trim()) {
        tree.saveEdit(nodeId, localValue.trim());
        onEditComplete?.(node, localValue.trim());
      } else {
        tree.cancelEditing();
        onEditCancel?.(node);
      }
    },
    onCancel: () => {
      tree.cancelEditing();
      onEditCancel?.(node);
    },
  }), [node, isEditing, localValue, nodeId, tree, onEditComplete, onEditCancel]);

  // Handle double-click to start editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (editable && !isEditing) {
      e.stopPropagation();
      tree.startEditing(nodeId);
      onEditStart?.(node);
    }
  };

  // Handle keyboard in edit mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      state.onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      state.onCancel();
    }
  };

  // If editing and no custom children, render default input
  if (isEditing && !children) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={state.onSave}
        onClick={(e) => e.stopPropagation()}
        className={className}
        style={style}
      />
    );
  }

  // Render with custom children or default span
  return (
    <Component
      onDoubleClick={handleDoubleClick}
      className={className}
      style={style}
    >
      {typeof children === 'function' ? children(state) : (children || node.label)}
    </Component>
  );
}

Label.displayName = 'Tree.Label';
