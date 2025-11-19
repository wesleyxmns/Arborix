// src/arborix/hooks/useTreeSearch.ts
import { useCallback, useMemo, useState } from 'react';
import type { TreeNode, TreeNodeId } from '../types';

interface SearchResult {
  nodeId: TreeNodeId;
  node: TreeNode;
  score: number;
  matchIndices: number[];
}

/**
 * Implementação de busca fuzzy simples
 * Retorna um score de 0-1 e os índices das letras que deram match
 */
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
      score += 1 + consecutiveMatches * 0.5; // Bonus por matches consecutivos
      patternIdx++;
    } else {
      consecutiveMatches = 0;
    }
    textIdx++;
  }

  // Se não encontrou todas as letras do pattern, não é match
  if (patternIdx !== pattern.length) {
    return null;
  }

  // Normaliza o score (0-1)
  const normalizedScore = score / (pattern.length * 2);

  return { score: normalizedScore, indices };
}

/**
 * Encontra todos os nós que dão match com o pattern
 */
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

    // Busca recursivamente nos filhos
    if (node.children && node.children.length > 0) {
      const childResults = searchTree(node.children, pattern, [...parentPath, node.id]);
      results.push(...childResults);
    }
  }

  return results;
}

/**
 * Encontra todos os IDs de nós pais que devem ser expandidos
 */
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

  // Resultados da busca ordenados por score
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < minSearchLength) {
      return [];
    }

    const results = searchTree(nodes, searchQuery);
    return results.sort((a, b) => b.score - a.score);
  }, [nodes, searchQuery, minSearchLength]);

  // IDs dos nós que deram match
  const matchedNodeIds = useMemo(
    () => new Set(searchResults.map(r => r.nodeId)),
    [searchResults]
  );

  // IDs dos nós que devem ser expandidos
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

  // Nó atual selecionado na navegação
  const currentResult = searchResults[currentResultIndex] || null;

  // Navega para o próximo resultado
  const nextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) => (prev + 1) % searchResults.length);
  }, [searchResults.length]);

  // Navega para o resultado anterior
  const previousResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  }, [searchResults.length]);

  // Limpa a busca
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentResultIndex(0);
  }, []);

  // Atualiza a query de busca
  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentResultIndex(0);
  }, []);

  // Pega os índices de highlight para um nó específico
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