// src/arborix/components/HighlightText/HighlightText.tsx
import React from 'react';

export interface HighlightTextProps {
  text: string;
  indices: number[];
  highlightClassName?: string;
  isCurrentResult?: boolean;
}

export const HighlightText = ({
  text,
  indices,
  highlightClassName = 'bg-yellow-200',
  isCurrentResult = false,
}: HighlightTextProps) => {
  // Se não há índices para destacar, retorna o texto normal
  if (indices.length === 0) {
    return <span>{text}</span>;
  }
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Cria um Set para lookup rápido
  const highlightSet = new Set(indices);
  
  for (let i = 0; i < text.length; i++) {
    if (highlightSet.has(i)) {
      // Adiciona o texto antes do highlight
      if (i > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, i)}
          </span>
        );
      }
      
      // Encontra sequências consecutivas para agrupar
      let endIndex = i;
      while (endIndex < text.length && highlightSet.has(endIndex)) {
        endIndex++;
      }
      
      // Adiciona o texto destacado
      parts.push(
        <mark
          key={`highlight-${i}`}
          className={`${highlightClassName} ${
            isCurrentResult ? 'ring-2 ring-blue-500 ring-offset-1' : ''
          } rounded px-0.5`}
        >
          {text.slice(i, endIndex)}
        </mark>
      );
      
      lastIndex = endIndex;
      i = endIndex - 1; // -1 porque o loop vai incrementar
    }
  }
  
  // Adiciona o texto restante
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }
  
  return <span className="select-none">{parts}</span>;
};