import { useState, useCallback } from 'react';
import { TreeNode, TreeNodeId, TreeData } from '../types';

export interface UseTreeClipboardProps {
  data: TreeData;
  insertNode: (parentId: TreeNodeId | null, node: TreeNode) => void;
  deleteNode: (id: TreeNodeId | TreeNodeId[]) => void;
  findNode: (data: TreeData, id: TreeNodeId) => TreeNode | null;
  commit: () => void;
  setCutNodes: (ids: Set<TreeNodeId>) => void;
  clearCutNodes: () => void;
}

export interface UseTreeClipboardResult {
  clipboard: { nodes: TreeNode[]; mode: 'cut' | 'copy' } | null;
  cutNode: (id: TreeNodeId | TreeNodeId[]) => void;
  copyNode: (id: TreeNodeId | TreeNodeId[]) => void;
  pasteNode: (targetId: TreeNodeId | null) => void;
}

export const useTreeClipboard = ({
  data,
  insertNode,
  deleteNode,
  findNode,
  commit,
  setCutNodes,
  clearCutNodes,
}: UseTreeClipboardProps): UseTreeClipboardResult => {
  const [clipboard, setClipboard] = useState<{
    nodes: TreeNode[];
    mode: 'cut' | 'copy';
  } | null>(null);

  const cutNode = useCallback((ids: TreeNodeId | TreeNodeId[]) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    const nodes: TreeNode[] = [];
    const idsToCut = new Set<TreeNodeId>();

    idList.forEach(id => {
      const node = findNode(data, id);
      if (node) {
        nodes.push(node);
        const collectIds = (n: TreeNode) => {
          idsToCut.add(n.id);
          n.children?.forEach(collectIds);
        };
        collectIds(node);
      }
    });

    if (nodes.length > 0) {
      setClipboard({ nodes, mode: 'cut' });
      setCutNodes(idsToCut);
    }
  }, [data, findNode, setCutNodes]);

  const copyNode = useCallback((ids: TreeNodeId | TreeNodeId[]) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    const nodes: TreeNode[] = [];

    const deepClone = (n: TreeNode): TreeNode => ({
      ...n,
      children: n.children?.map(deepClone),
    });

    idList.forEach(id => {
      const node = findNode(data, id);
      if (node) {
        nodes.push(deepClone(node));
      }
    });

    if (nodes.length > 0) {
      setClipboard({ nodes, mode: 'copy' });
      clearCutNodes();
    }
  }, [data, findNode, clearCutNodes]);

  const pasteNode = useCallback((targetId: TreeNodeId | null) => {
    if (!clipboard) return;

    const deepClone = (n: TreeNode): TreeNode => ({
      ...n,
      id: `${n.id}-paste-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: n.children?.map(deepClone),
    });

    if (clipboard.mode === 'cut') {
      // Delete original nodes
      const idsToDelete = clipboard.nodes.map(n => n.id);
      deleteNode(idsToDelete);

      // Insert new nodes
      clipboard.nodes.forEach(node => {
        const newNode = deepClone(node);
        insertNode(targetId, newNode);
      });
    } else {
      clipboard.nodes.forEach(node => {
        const clonedNode = deepClone(node);
        insertNode(targetId, clonedNode);
      });
    }

    commit();
    if (clipboard.mode === 'cut') {
      setClipboard(null);
      clearCutNodes();
    }
  }, [clipboard, deleteNode, insertNode, commit, clearCutNodes]);

  return {
    clipboard,
    cutNode,
    copyNode,
    pasteNode,
  };
};
