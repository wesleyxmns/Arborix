export interface HighlightTextProps {
  text: string;
  indices: number[][];
  isCurrentResult?: boolean;
}

export const HighlightText = ({ text, indices, isCurrentResult = false }: HighlightTextProps) => {
  if (!indices || indices.length === 0) {
    return <>{text}</>;
  }

  const parts: JSX.Element[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end], idx) => {
    // Add text before highlight
    if (start > lastIndex) {
      parts.push(<span key={`text-${idx}`}>{text.slice(lastIndex, start)}</span>);
    }

    // Add highlighted text
    parts.push(
      <span
        key={`highlight-${idx}`}
        className={isCurrentResult ? 'bg-orange-300' : 'bg-yellow-200'}
      >
        {text.slice(start, end + 1)}
      </span>
    );

    lastIndex = end + 1;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
};
