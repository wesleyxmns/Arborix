import { useCallback, useMemo, useState } from 'react';
import type { TreeNode, TreeNodeId } from '../types';

export interface SearchResult {
  nodeId: TreeNodeId;
  node: TreeNode;
  score: number;
  matchIndices: number[];
}

function fuzzyMatch(pattern: string, text: string): { score: number; indices: number[] } | null {
  pattern = pattern.toLowerCase();
  text = text.toLowerCase();

  let patternIdx = 0;
  let textIdx = 0;
  const indices: number[] = [];
  let score = 0;
  let consecutiveMatches = 0;

  while (patternIdx < pattern.length && textIdx < text.length) {
    if (pattern[patternIdx] === text[textIdx]) {
      indices.push(textIdx);
      consecutiveMatches++;
      score += 1 + consecutiveMatches * 0.5;
      patternIdx++;
    } else {
      consecutiveMatches = 0;
    }
    textIdx++;
  }

  if (patternIdx !== pattern.length) {
    return null;
  }

  const normalizedScore = score / (pattern.length * 2);

  return { score: normalizedScore, indices };
}

function searchTree(nodes: TreeNode[], pattern: string, parentPath: TreeNodeId[] = []): SearchResult[] {
  const results: SearchResult[] = [];

  for (const node of nodes) {
    const match = fuzzyMatch(pattern, node.label);

    if (match) {
      results.push({
        nodeId: node.id,
        node,
        score: match.score,
        matchIndices: match.indices,
      });
    }

    if (node.children && node.children.length > 0) {
      const childResults = searchTree(node.children, pattern, [...parentPath, node.id]);
      results.push(...childResults);
    }
  }

  return results;
}

function findParentIds(nodes: TreeNode[], targetId: TreeNodeId, currentPath: TreeNodeId[] = []): TreeNodeId[] | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return currentPath;
    }

    if (node.children && node.children.length > 0) {
      const result = findParentIds(node.children, targetId, [...currentPath, node.id]);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

export interface UseTreeSearchOptions {
  minSearchLength?: number;
  autoExpand?: boolean;
}

export function useTreeSearch(
  nodes: TreeNode[],
  options: UseTreeSearchOptions = {}
) {
  const { minSearchLength = 2, autoExpand = true } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < minSearchLength) {
      return [];
    }

    const results = searchTree(nodes, searchQuery);
    return results.sort((a, b) => b.score - a.score);
  }, [nodes, searchQuery, minSearchLength]);

  const matchedNodeIds = useMemo(
    () => new Set(searchResults.map(r => r.nodeId)),
    [searchResults]
  );

  const nodesToExpand = useMemo(() => {
    if (!autoExpand || searchResults.length === 0) {
      return new Set<TreeNodeId>();
    }

    const expandIds = new Set<TreeNodeId>();

    for (const result of searchResults) {
      const parentIds = findParentIds(nodes, result.nodeId);
      if (parentIds) {
        parentIds.forEach(id => expandIds.add(id));
      }
    }

    return expandIds;
  }, [nodes, searchResults, autoExpand]);

  const currentResult = searchResults[currentResultIndex] || null;

  const nextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) => (prev + 1) % searchResults.length);
  }, [searchResults.length]);

  const previousResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  }, [searchResults.length]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentResultIndex(0);
  }, []);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentResultIndex(0);
  }, []);

  const getHighlightIndices = useCallback(
    (nodeId: TreeNodeId): number[] => {
      const result = searchResults.find(r => r.nodeId === nodeId);
      return result?.matchIndices || [];
    },
    [searchResults]
  );

  return {
    searchQuery,
    search,
    clearSearch,
    searchResults,
    matchedNodeIds,
    nodesToExpand,
    currentResult,
    currentResultIndex,
    nextResult,
    previousResult,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length,
    getHighlightIndices,
  };
}