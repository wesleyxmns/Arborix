import { ContextMenuIcons, ContextMenuItem } from '../components/ContextMenu/ContextMenu';
import { TreeNodeId, TreeData, TreeNode, ArborixProps } from '../types';
import { UseTreeClipboardResult } from '../hooks/useTreeClipboard';

interface GetContextMenuItemsParams {
  nodeId: TreeNodeId;
  targetIds?: TreeNodeId[];
  data: TreeData;
  findNode: (data: TreeData, id: TreeNodeId) => TreeNode | null;
  findParent: (data: TreeData, id: TreeNodeId) => TreeNode | null;
  startEditing: (id: TreeNodeId) => void;
  duplicateNode: (id: TreeNodeId | TreeNodeId[]) => void;
  cutNode: (id: TreeNodeId | TreeNodeId[]) => void;
  copyNode: (id: TreeNodeId | TreeNodeId[]) => void;
  pasteNode: (targetId: TreeNodeId) => void;
  addNode: (parentId: TreeNodeId | null, label: string) => void;
  deleteNode: (id: TreeNodeId | TreeNodeId[]) => void;
  clipboard: UseTreeClipboardResult['clipboard'];
  options?: ArborixProps['contextMenuOptions'];
  customItems?: ArborixProps['customContextMenuItems'];
}

export const getContextMenuItems = ({
  nodeId,
  targetIds,
  data,
  findNode,
  findParent,
  startEditing,
  duplicateNode,
  cutNode,
  copyNode,
  pasteNode,
  addNode,
  deleteNode,
  clipboard,
  options = {
    rename: true,
    duplicate: true,
    cut: true,
    copy: true,
    paste: true,
    addChild: true,
    addSibling: true,
    delete: true,
  },
  customItems,
}: GetContextMenuItemsParams): ContextMenuItem[] => {
  const node = findNode(data, nodeId);
  if (!node) return [];

  const effectiveTargetIds = targetIds && targetIds.length > 0 ? targetIds : [nodeId];
  const isMultiSelection = effectiveTargetIds.length > 1;

  const parent = findParent(data, nodeId);
  const items: ContextMenuItem[] = [];

  const defaults = {
    rename: true,
    duplicate: true,
    cut: true,
    copy: true,
    paste: true,
    addChild: true,
    addSibling: true,
    delete: true,
    ...options,
  };

  if (defaults.rename && !isMultiSelection) {
    items.push({
      id: 'rename',
      label: 'Renomear',
      shortcutLabel: 'F2',
      icon: ContextMenuIcons.Edit,
      action: () => startEditing(nodeId),
    });
  }

  if (defaults.duplicate) {
    items.push({
      id: 'duplicate',
      label: isMultiSelection ? `Duplicar (${effectiveTargetIds.length})` : 'Duplicar',
      shortcutLabel: 'Ctrl+D',
      icon: ContextMenuIcons.Copy,
      action: () => duplicateNode(effectiveTargetIds),
    });
  }

  if (defaults.cut) {
    items.push({
      id: 'cut',
      label: isMultiSelection ? `Recortar (${effectiveTargetIds.length})` : 'Recortar',
      shortcutLabel: 'Ctrl+X',
      icon: ContextMenuIcons.Cut,
      action: () => cutNode(effectiveTargetIds),
    });
  }

  if (defaults.copy) {
    items.push({
      id: 'copy',
      label: isMultiSelection ? `Copiar (${effectiveTargetIds.length})` : 'Copiar',
      shortcutLabel: 'Ctrl+C',
      icon: ContextMenuIcons.Copy,
      action: () => copyNode(effectiveTargetIds),
    });
  }

  if (defaults.paste) {
    items.push({
      id: 'paste',
      label: 'Colar',
      shortcutLabel: 'Ctrl+V',
      icon: ContextMenuIcons.Paste,
      disabled: !clipboard,
      action: () => pasteNode(nodeId),
    });
  }

  if (items.length > 0 && (defaults.addChild || defaults.addSibling)) {
    items.push({ id: 'sep1', label: '', separator: true });
  }

  if (defaults.addChild) {
    items.push({
      id: 'add-child',
      label: 'Novo filho',
      icon: ContextMenuIcons.AddFolder,
      action: () => addNode(nodeId, 'Novo filho'),
    });
  }

  if (defaults.addSibling) {
    items.push({
      id: 'add-sibling',
      label: 'Novo irmão',
      icon: ContextMenuIcons.Add,
      action: () => {
        const parentId = parent?.id ?? null;
        addNode(parentId, 'Novo irmão');
      },
    });
  }

  if (customItems) {
    const custom = customItems(node);
    if (custom.length > 0) {
      if (items.length > 0) items.push({ id: 'sep-custom', label: '', separator: true });
      items.push(...custom);
    }
  }

  if (defaults.delete) {
    if (items.length > 0) items.push({ id: 'sep-delete', label: '', separator: true });
    items.push({
      id: 'delete',
      label: isMultiSelection ? `Excluir (${effectiveTargetIds.length})` : 'Excluir',
      shortcutLabel: 'Del',
      icon: ContextMenuIcons.Delete,
      danger: true,
      action: () => deleteNode(effectiveTargetIds),
    });
  }

  return items;
};
