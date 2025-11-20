import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Clipboard,
  Copy,
  Edit2,
  FolderPlus,
  Plus,
  Scissors,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  shortcutLabel?: string;
  icon?: React.ReactNode;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [submenuState, setSubmenuState] = React.useState<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
        setSubmenuState(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        setSubmenuState(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (rect.right > viewportWidth) adjustedX = viewportWidth - rect.width - 10;
    if (rect.bottom > viewportHeight) adjustedY = viewportHeight - rect.height - 10;

    menuRef.current.style.left = `${adjustedX}px`;
    menuRef.current.style.top = `${adjustedY}px`;
  }, [x, y]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.separator || item.disabled || item.submenu) return;
    item.action?.();
    onClose();
    setSubmenuState(null);
  };

  const renderItems = (menuItems: ContextMenuItem[]) => (
    <>
      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          {item.separator ? (
            <div className="h-px bg-gray-200 my-1" />
          ) : (
            <button
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                if (item.submenu) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setSubmenuState({
                    itemId: item.id,
                    x: rect.right + 4,
                    y: rect.top,
                  });
                } else {
                  setSubmenuState(null);
                }
              }}
              disabled={item.disabled}
              className={`
                w-full px-3 py-2 flex items-center gap-3 text-left text-sm rounded transition-colors
                hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-800'}
              `}
            >
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcutLabel && (
                <span className="text-xs text-gray-400 ml-3">{item.shortcutLabel}</span>
              )}
              {item.submenu && <ChevronRight size={14} className="text-gray-400" />}
            </button>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[220px] overflow-hidden"
        >
          {renderItems(items)}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {submenuState && (
          <>
            {items
              .filter((i) => i.id === submenuState.itemId && i.submenu)
              .map((item) => (
                <motion.div
                  key={`submenu-${item.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.1 }}
                  className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[220px]"
                  style={{ left: submenuState.x, top: submenuState.y }}
                  onMouseLeave={() => setSubmenuState(null)}
                >
                  {item.submenu && renderItems(item.submenu)}
                </motion.div>
              ))}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);

  const openContextMenu = (x: number, y: number, items: ContextMenuItem[]) => {
    setContextMenu({ x, y, items });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleContextMenu = (e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, items);
  };

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleContextMenu,
  };
};

export const ContextMenuIcons = {
  Edit: <Edit2 size={16} />,
  Delete: <Trash2 size={16} />,
  Copy: <Copy size={16} />,
  Add: <Plus size={16} />,
  AddFolder: <FolderPlus size={16} />,
  Cut: <Scissors size={16} />,
  Paste: <Clipboard size={16} />,
};