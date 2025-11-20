import { debounce } from 'lodash-es';
import * as R from 'ramda';
import { FilterFn, FlatNode, TreeNode, TreeNodeId } from '../types';

export const flattenTree = (nodes: TreeNode[], parentId: TreeNodeId | null = null, depth = 0): FlatNode[] => {
  return nodes.reduce<FlatNode[]>((acc, node, index) => {
    const flat: FlatNode = {
      ...node,
      parentId,
      depth,
      index,
    };
    acc.push(flat);
    if (node.children && node.isOpen) {
      acc.push(...flattenTree(node.children, node.id, depth + 1));
    }
    return acc;
  }, []);
};

export const findNodeById = (nodes: TreeNode[], id: TreeNodeId): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const searchTree = (nodes: TreeNode[], query: string, fields: string[] = ['label']): TreeNodeId[] => {
  const lowerQuery = query.toLowerCase();
  const result: TreeNodeId[] = [];

  const walk = (node: TreeNode) => {
    const matches = fields.some(field => {
      const value = R.path(field.split('.'), node);
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
    });

    if (matches) {
      result.push(node.id);
      let parent = node.parentId ?? null;
      while (parent !== null) {
        result.push(parent);
      }
    }

    node.children?.forEach(walk);
  };

  nodes.forEach(walk);
  return [...new Set(result)];
};

export const filterTreeData = (nodes: TreeNode[], predicate: FilterFn): TreeNode[] => {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    const children = node.children ? filterTreeData(node.children, predicate) : [];

    if (predicate(node) || children.length > 0) {
      acc.push({
        ...node,
        children: node.children ? children : undefined,
      });
    }

    return acc;
  }, []);
};

export const debounceSearch = debounce((fn: Function) => fn(), 300);