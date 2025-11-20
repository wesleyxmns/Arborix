import { useState, useCallback } from 'react';
import { TreeNode, TreeNodeId, TreeData } from '../types';

export interface UseTreeClipboardProps {
  data: TreeData;
  addNode: (parentId: TreeNodeId | null, label: string) => TreeNodeId;
  deleteNode: (id: TreeNodeId) => void;
  findNode: (data: TreeData, id: TreeNodeId) => TreeNode | null;
  commit: () => void;
}

export interface UseTreeClipboardResult {
  clipboard: { node: TreeNode; mode: 'cut' | 'copy' } | null;
  cutNode: (id: TreeNodeId) => void;
  copyNode: (id: TreeNodeId) => void;
  pasteNode: (targetId: TreeNodeId | null) => void;
}

export const useTreeClipboard = ({
  data,
  addNode,
  deleteNode,
  findNode,
  commit,
}: UseTreeClipboardProps): UseTreeClipboardResult => {
  const [clipboard, setClipboard] = useState<{
    node: TreeNode;
    mode: 'cut' | 'copy';
  } | null>(null);

  const cutNode = useCallback((id: TreeNodeId) => {
    const node = findNode(data, id);
    if (node) {
      setClipboard({ node, mode: 'cut' });
    }
  }, [data, findNode]);

  const copyNode = useCallback((id: TreeNodeId) => {
    const node = findNode(data, id);
    if (node) {
      setClipboard({ node, mode: 'copy' });
    }
  }, [data, findNode]);

  const pasteNode = useCallback((targetId: TreeNodeId | null) => {
    if (!clipboard) return;

    if (clipboard.mode === 'cut') {
      deleteNode(clipboard.node.id);

      const newNode = { ...clipboard.node, id: Date.now().toString() };

      addNode(targetId, newNode.label);

      setClipboard(null);
    } else {
      const deepClone = (n: TreeNode): TreeNode => ({
        ...n,
        id: `${n.id}-paste-${Date.now()}`,
        children: n.children?.map(deepClone),
      });

      const clonedNode = deepClone(clipboard.node);
      addNode(targetId, clonedNode.label);
    }

    commit();
  }, [clipboard, deleteNode, addNode, commit]);

  return {
    clipboard,
    cutNode,
    copyNode,
    pasteNode,
  };
};
