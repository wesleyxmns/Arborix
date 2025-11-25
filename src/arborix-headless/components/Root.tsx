import { useRef, useEffect, type ElementType } from 'react';
import { TreeProvider } from '../context/TreeContext';
import { VirtualizationProvider } from '../context/VirtualizationContext';
import { DragDropProvider } from '../context/DragDropContext';
import type { TreeRootProps, ContextMenuItem, TreeNodeId, TreeNode } from '../types';
import { ContextMenuIcons } from './ContextMenu';

// ============================================================================
// Root Component - Main tree wrapper
// ============================================================================

export function Root({
  data,
  onDataChange,
  enableDragDrop = false,
  enableVirtualization = true,
  rowHeight = 32,
  overscan = 5,
  persistenceKey,
  onLoadData,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  as: Component = 'div',
  className,
  style,
  children,
  contextMenuOptions,
  customContextMenuItems,
  onAction,
  onContextMenu,
  customActionButtons,
  folderIcon,
  fileIcon,
}: TreeRootProps) {
  return (
    <TreeProvider
      data={data}
      onDataChange={onDataChange}
      persistenceKey={persistenceKey}
      onLoadData={onLoadData}
      contextMenuOptions={contextMenuOptions}
      customContextMenuItems={customContextMenuItems}
      onAction={onAction}
      customActionButtons={customActionButtons}
      folderIcon={folderIcon}
      fileIcon={fileIcon}
    >
      <TreeProviderContent
        enableDragDrop={enableDragDrop}
        enableVirtualization={enableVirtualization}
        rowHeight={rowHeight}
        overscan={overscan}
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        Component={Component}
        className={className}
        style={style}
        onContextMenu={onContextMenu}
      >
        {children}
      </TreeProviderContent>
    </TreeProvider>
  );
}

// ============================================================================
// Internal component to access TreeContext
// ============================================================================

interface TreeProviderContentProps {
  enableDragDrop: boolean;
  enableVirtualization: boolean;
  rowHeight: number;
  overscan: number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  Component: ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onContextMenu?: (e: React.MouseEvent, items: ContextMenuItem[]) => void;
}

function TreeProviderContent({
  enableDragDrop,
  enableVirtualization,
  rowHeight,
  overscan,
  ariaLabel,
  ariaLabelledBy,
  Component,
  className,
  style,
  children,
  onContextMenu,
}: TreeProviderContentProps) {
  const tree = useTreeContext();
  const rootRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation will be handled by individual Item components
  // or users can add their own onKeyDown handler to Tree.Root

  // Notify parent of data changes
  useEffect(() => {
    if (tree.onDataChange) {
      tree.onDataChange(tree.state.data);
    }
  }, [tree.state.data, tree.onDataChange]);

  // Click outside logic to clear selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        tree.clearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tree]);

  // Root Context Menu Handler
  const handleRootContextMenu = (e: React.MouseEvent) => {
    if (!onContextMenu) return;

    e.preventDefault();
    e.stopPropagation();

    const items: ContextMenuItem[] = [
      {
        id: 'root-new-folder',
        label: 'Nova Pasta',
        icon: ContextMenuIcons.AddFolder,
        action: () => {
          const id = tree.addNode(null, 'Nova Pasta');
          tree.updateNode(id, { children: [] });
          setTimeout(() => tree.startEditing(id), 0);
        },
      },
      {
        id: 'root-new-file',
        label: 'Novo Arquivo',
        icon: ContextMenuIcons.Add,
        action: () => {
          const id = tree.addNode(null, 'Novo Arquivo');
          tree.startEditing(id);
        },
      },
      {
        id: 'root-paste',
        label: 'Colar',
        icon: ContextMenuIcons.Paste,
        disabled: !tree.clipboard,
        action: () => tree.pasteNode(null),
      },
      { id: 'sep-root', label: '', separator: true },
      {
        id: 'root-expand-all',
        label: 'Expandir Tudo',
        action: () => tree.expandAll(),
      },
      {
        id: 'root-collapse-all',
        label: 'Colher Tudo',
        action: () => tree.collapseAll(),
      },
      { id: 'sep-selection', label: '', separator: true },
      {
        id: 'root-select-all',
        label: 'Selecionar Tudo',
        action: () => {
          const allIds: TreeNodeId[] = [];
          const collectIds = (nodes: TreeNode[]) => {
            nodes.forEach(n => {
              allIds.push(n.id);
              if (n.children) collectIds(n.children);
            });
          };
          collectIds(tree.state.data);
          tree.selectAllNodes(allIds);
        },
      },
      {
        id: 'root-clear-selection',
        label: 'Limpar Seleção',
        disabled: tree.state.selectedIds.size === 0,
        action: () => tree.clearSelection(),
      },
    ];

    onContextMenu(e, items);
  };

  // Wrap with optional providers
  let content = children;

  // Virtualization provider (optional)
  if (enableVirtualization) {
    content = (
      <VirtualizationProvider
        data={tree.state.data}
        openIds={tree.state.openIds}
        rowHeight={rowHeight}
        overscan={overscan}
      >
        {content}
      </VirtualizationProvider>
    );
  }

  // Drag & drop provider (optional)
  if (enableDragDrop) {
    const handleDragDropUpdate = (newData: typeof tree.state.data) => { // Assuming TreeData is the type of tree.state.data

      // Update internal state
      tree.setData(newData);
      tree.commit();


      // Notify parent if callback provided
      if (tree.onDataChange) {
        tree.onDataChange(newData);
      }
    };

    content = (
      <DragDropProvider data={tree.state.data} onDataChange={handleDragDropUpdate}>
        {content}
      </DragDropProvider>
    );
  }

  return (
    <Component
      ref={rootRef}
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={true}
      className={className}
      style={style}
      onContextMenu={handleRootContextMenu}
    >
      {content}
    </Component>
  );
}

// Need to import useTreeContext
import { useTreeContext } from '../context/TreeContext';

Root.displayName = 'Tree.Root';
