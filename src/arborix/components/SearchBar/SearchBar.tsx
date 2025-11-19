// src/arborix/components/SearchBar/SearchBar.tsx
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalResults?: number;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onClear,
  onNext,
  onPrevious,
  currentIndex = 0,
  totalResults = 0,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + F para focar na busca
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Escape para limpar
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onClear();
        inputRef.current?.blur();
      }
      
      // Enter para próximo
      if (e.key === 'Enter' && document.activeElement === inputRef.current) {
        e.preventDefault();
        if (e.shiftKey) {
          onPrevious?.();
        } else {
          onNext?.();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClear, onNext, onPrevious]);
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}>
      {/* Ícone de busca */}
      <Search size={16} className="text-gray-400 flex-shrink-0" />
      
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm bg-transparent"
        aria-label="Search tree"
      />
      
      {/* Contador de resultados */}
      {value && totalResults > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-600 flex-shrink-0">
          <span>
            {currentIndex + 1} / {totalResults}
          </span>
          
          {/* Navegação */}
          <div className="flex gap-0.5">
            <button
              onClick={onPrevious}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous result"
              title="Previous (Shift+Enter)"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onNext}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next result"
              title="Next (Enter)"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      )}
      
      {/* Mensagem de "sem resultados" */}
      {value && totalResults === 0 && (
        <span className="text-xs text-gray-500 flex-shrink-0">No results</span>
      )}
      
      {/* Botão de limpar */}
      {value && (
        <button
          onClick={onClear}
          className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          aria-label="Clear search"
          title="Clear (Esc)"
        >
          <X size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  );
};