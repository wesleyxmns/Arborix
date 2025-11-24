import { cloneDeep, get } from 'lodash-es';
import { z } from 'zod';
import type { TreeNode, TreeNodeId } from '../types';
import { NodeSchema } from '../types';
import { generateId } from '../utils/idGenerator';

interface Mapper {
  id?: string | ((item: any) => TreeNodeId);
  label?: string | ((item: any) => string);
  children?: string | ((item: any) => any[] | undefined);
  metadata?: string[];
  transform?: (item: any) => Partial<Omit<TreeNode, 'id' | 'label' | 'children'>>;
}

const DefaultMapper: Required<Mapper> = {
  id: 'id',
  label: 'name',
  children: 'children',
  metadata: [],
  transform: () => ({}),
};

export class TreeDataBuilder {
  private cache = new Map<string, TreeNode[]>();

  private static getCacheKey(data: any[], mapper: Partial<Mapper>) {
    return JSON.stringify({
      length: data.length,
      firstId: data[0]?.id ?? null,
      mapperKeys: Object.keys(mapper),
    });
  }

  static fromNested(data: any[], mapper: Partial<Mapper> = {}): TreeNode[] {
    const m = { ...DefaultMapper, ...mapper } as Required<Mapper>;
    const key = this.getCacheKey(data, mapper);

    const builder = new TreeDataBuilder();
    if (builder.cache.has(key)) {
      return cloneDeep(builder.cache.get(key)!);
    }

    const convert = (item: any): TreeNode => {
      const id = typeof m.id === 'function' ? m.id(item) : get(item, m.id);
      const label = typeof m.label === 'function' ? m.label(item) : get(item, m.label);
      const rawChildren = typeof m.children === 'function' ? m.children(item) : get(item, m.children);

      const custom = m.transform(item);

      const metadata: Record<string, any> = {};
      m.metadata.forEach(path => {
        const value = get(item, path);
        if (value !== undefined) {
          metadata[path] = value;
        }
      });

      const node: TreeNode = {
        id: id ?? generateId(),
        label: label ?? 'Sem título',
        metadata: { ...metadata, ...custom },
        ...custom,
      };

      if (Array.isArray(rawChildren) && rawChildren.length > 0) {
        node.children = rawChildren.map(child => convert(child));
      }

      return node;
    };

    const result = data.map(convert);

    try {
      z.array(NodeSchema).parse(result);
    } catch (e) {
      // Validation failed - proceed with generated data
    }

    builder.cache.set(key, cloneDeep(result));
    return result;
  }

  static fromFlat(
    data: any[],
    options: {
      idKey?: string;
      parentIdKey?: string;
      rootParentValue?: any;
    } & Partial<Mapper> = {}
  ): TreeNode[] {
    const { idKey = 'id', parentIdKey = 'parentId', rootParentValue = null } = options;
    const mapper = { ...options };

    const nodes = this.fromNested(data, mapper);

    const map = new Map<TreeNodeId, TreeNode>();
    nodes.forEach(node => {
      map.set(node.id, { ...node, children: [] });
    });

    const roots: TreeNode[] = [];

    nodes.forEach(node => {
      const rawItem = data.find(d => get(d, idKey) === node.id);
      const parentRawId = rawItem?.[parentIdKey];

      if (parentRawId === rootParentValue || parentRawId === undefined || parentRawId === null) {
        roots.push(node);
      } else {
        const parent = map.get(parentRawId);
        if (parent) {
          parent.children ??= [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    const hasCycle = (node: TreeNode, path = new Set<TreeNodeId>()): boolean => {
      if (path.has(node.id)) return true;
      path.add(node.id);
      return node.children?.some(child => hasCycle(child, new Set(path))) ?? false;
    };

    if (roots.some(root => hasCycle(root))) {
      throw new Error('Ciclo detectado na estrutura flat-to-nested');
    }

    return roots;
  }
}