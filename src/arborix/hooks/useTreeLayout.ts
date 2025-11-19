import { useMemo } from 'react';
import type { CalculatedNode, TreeNodeId, UseTreeLayoutProps, UseTreeLayoutResult } from '../types';
import { flattenVisibleTree, type VisibleNode } from '../utils/flattenTree';

// ====================================================================
// 1. DEFINIÇÕES DE TIPOS E TYPE GUARD
// ====================================================================


const isCalculatedNode = (node: CalculatedNode | undefined): node is CalculatedNode => node !== undefined;


// ====================================================================
// 2. FUNÇÕES DE CÁLCULO DE LAYOUT ESPECÍFICAS
// ====================================================================

/**
 * Layout Vertical (Com Virtualização Manual)
 * Y é linear baseado no index plano. X é baseado na profundidade.
 */
const calculateVerticalLayout = (
  visibleNodes: VisibleNode[],
  props: UseTreeLayoutProps
): { calculatedNodes: CalculatedNode[]; totalHeight: number; totalWidth: number } => {
  const { rowHeight, containerWidth, indentation = 20, scrollTop, containerHeight } = props;
  
  const OVERSCAN_ROWS = 15; // Linhas de buffer para evitar flicker
  
  // 1. CÁLCULO BRUTO (Coordenadas de TODOS os nós)
  const allCalculatedNodes: CalculatedNode[] = visibleNodes.map((item, index) => {
    const y = index * rowHeight;
    const x = item.depth * indentation; 
    const width = containerWidth - x; 
    const height = rowHeight;
    
    return { ...item, x, y, width, height };
  });
  
  // 2. VIRTUALIZAÇÃO (Filtro por Viewport)
  
  // Determina o intervalo de índices visíveis
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS);
  const endIndex = Math.min(
    allCalculatedNodes.length - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + OVERSCAN_ROWS
  );

  // Retorna apenas os nós no viewport + overscan
  const calculatedNodes = allCalculatedNodes.slice(startIndex, endIndex + 1);

  // 3. DIMENSÕES TOTAIS
  const totalHeight = allCalculatedNodes.length * rowHeight;
  const totalWidth = containerWidth; 

  return { calculatedNodes, totalHeight, totalWidth };
};

/**
 * Layout Horizontal (Sem Virtualização por Viewport)
 */
const calculateHorizontalLayout = (
  visibleNodes: VisibleNode[],
  props: UseTreeLayoutProps
): { calculatedNodes: CalculatedNode[]; totalHeight: number; totalWidth: number } => {
  const { rowHeight, indentation = 20 } = props;
  
  const NODE_WIDTH = 200; 
  const NODE_PADDING_Y = 10;
  
  let totalWidth = 0; 
  
  const calculatedNodes: CalculatedNode[] = visibleNodes.map((item, index) => {
    const x = item.depth * (NODE_WIDTH + indentation); 
    const y = index * (rowHeight + NODE_PADDING_Y); 

    const width = NODE_WIDTH;
    const height = rowHeight;

    if (x + width > totalWidth) {
      totalWidth = x + width;
    }

    return { ...item, x, y, width, height };
  });
  
  const totalHeight = calculatedNodes.length * (rowHeight + NODE_PADDING_Y); 
  totalWidth = Math.max(totalWidth, props.containerWidth);
  
  return { calculatedNodes, totalHeight, totalWidth };
};

/**
 * Layout OrgChart (Sem Virtualização por Viewport)
 */
const calculateOrgChartLayout = (
  visibleNodes: VisibleNode[],
  props: UseTreeLayoutProps
): { calculatedNodes: CalculatedNode[]; totalHeight: number; totalWidth: number } => {
  const { rowHeight, indentation = 40, openIds } = props;
  
  const NODE_WIDTH = 150;
  const NODE_HEIGHT = rowHeight * 1.5;
  const V_SPACE = 50; 
  const H_SPACE = indentation; 

  const nodeMap = new Map<TreeNodeId, CalculatedNode>();
  
  visibleNodes.forEach(item => {
    const y = item.depth * (NODE_HEIGHT + V_SPACE);
    const width = NODE_WIDTH;
    const height = NODE_HEIGHT;
    nodeMap.set(item.node.id, { ...item, x: 0, y, width, height }); 
  });
  
  let nextFreeX = 0; 

  const calculateX = (nodeId: TreeNodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;
      
      const isExpanded = openIds.has(nodeId);
      
      const potentialChildren = isExpanded 
        ? node.node.children?.map(c => nodeMap.get(c.id)) 
        : [];
      
      const children = (potentialChildren || []).filter(isCalculatedNode);
      
      if (children.length === 0) {
          node.x = nextFreeX;
          nextFreeX += NODE_WIDTH + H_SPACE;
      } else {
          children.forEach(c => calculateX(c.node.id));
          
          const firstChild = children[0]; 
          const lastChild = children[children.length - 1];
          
          const childrenCenter = (firstChild.x + (lastChild.x + lastChild.width)) / 2;
          node.x = childrenCenter - (node.width / 2);

          nextFreeX = Math.max(nextFreeX, lastChild.x + lastChild.width + H_SPACE);
      }
  };
  
  props.data.map(rootNode => calculateX(rootNode.id));


  const finalNodes = Array.from(nodeMap.values());
  const totalWidth = finalNodes.reduce((max, node) => Math.max(max, node.x + node.width), 0) + H_SPACE;
  const totalHeight = finalNodes.reduce((max, node) => Math.max(max, node.y + node.height), 0) + V_SPACE;
  
  return {
    calculatedNodes: finalNodes,
    totalHeight,
    totalWidth,
  };
};


// ====================================================================
// 3. HOOK PRINCIPAL (ROUTER)
// ====================================================================

export const useTreeLayout = (props: UseTreeLayoutProps): UseTreeLayoutResult => {
  const { data, openIds, searchResults, layout } = props;
  
  const result = useMemo(() => {
    const visibleNodes = flattenVisibleTree(
      data, 
      openIds, 
      new Set(searchResults || [])
    );

    let layoutResult: { calculatedNodes: CalculatedNode[]; totalHeight: number; totalWidth: number };

    // Usa calculateVerticalLayout para layouts baseados em lista
    switch (layout) {
      case 'vertical':
      case 'vscode':
        layoutResult = calculateVerticalLayout(visibleNodes, props);
        break;
      case 'horizontal':
        layoutResult = calculateHorizontalLayout(visibleNodes, props);
        break;
      case 'orgchart':
        layoutResult = calculateOrgChartLayout(visibleNodes, props);
        break;
      default:
        layoutResult = calculateVerticalLayout(visibleNodes, props);
    }
    
    const isVertical = layout === 'vertical' || layout === 'vscode';

    return {
      ...layoutResult,
      isVertical,
    };
  }, [data, openIds, searchResults, layout, props.rowHeight, props.containerWidth, props.containerHeight, props.indentation, props.scrollTop]); // ⬅️ props.scrollTop é uma nova dependência

  return result;
};