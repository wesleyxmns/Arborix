import { useMemo } from 'react';
import { useTreeContext } from '../context/TreeContext';
import type { TreeTriggerProps, TriggerState } from '../types';

// ============================================================================
// Trigger Component - Expand/collapse button
// ============================================================================

export function Trigger({
  nodeId,
  children,
  as: Component = 'button',
  className,
  style,
  onClick,
}: TreeTriggerProps) {
  const tree = useTreeContext();

  // Find the node
  const node = tree.findNode(tree.state.data, nodeId);

  if (!node) return null;

  // Compute trigger state
  const state: TriggerState = useMemo(() => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isOpen = tree.state.openIds.has(nodeId);
    const isDisabled = Boolean(node.disabled);
    const isLoading = Boolean(node.isLoading);

    return {
      isOpen,
      hasChildren,
      isDisabled,
      isLoading,
    };
  }, [node, nodeId, tree.state.openIds]);

  // Don't render if node has no children and can't load data
  if (!state.hasChildren && !tree.onLoadData) {
    return null;
  }

  // Resolve className
  const resolvedClassName = typeof className === 'function'
    ? className(state)
    : className;

  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onClick) {
      onClick(e, state);
    } else {
      // Default behavior: toggle open
      tree.toggleOpen(nodeId);
    }
  };

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      onClick={handleClick}
      disabled={state.isDisabled}
      aria-expanded={state.isOpen}
      className={resolvedClassName}
      style={style}
    >
      {typeof children === 'function' ? children(state) : children}
    </Component>
  );
}

Trigger.displayName = 'Tree.Trigger';
