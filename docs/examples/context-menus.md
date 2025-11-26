# Context Menus Example

Add context menus with custom actions to tree nodes.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { Edit, Copy, Trash2, FolderPlus, FilePlus } from 'lucide-react';
import { useState } from 'react';

function ContextMenuTree() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Projects',
      children: [
        { id: '1-1', label: 'Website' },
        { id: '1-2', label: 'Mobile App' }
      ]
    },
    { id: '2', label: 'Archive' }
  ]);

  const customMenuItems = (node) => [
    {
      id: 'rename',
      label: 'Rename',
      icon: <Edit size={14} />,
      action: (node) => {
        tree.startEditing(node.id);
      }
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy size={14} />,
      action: (node) => {
        tree.duplicateNode(node.id);
      },
      separator: true
    },
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: <FolderPlus size={14} />,
      visible: (node) => !!node.children,
      action: (node) => {
        const id = tree.addNode(node.id, 'New Folder');
        tree.updateNode(id, { children: [] });
      }
    },
    {
      id: 'new-file',
      label: 'New File',
      icon: <FilePlus size={14} />,
      visible: (node) => !!node.children,
      action: (node) => {
        tree.addNode(node.id, 'New File');
      },
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={14} />,
      danger: true,
      action: (node) => {
        if (confirm(`Delete "${node.label}"?`)) {
          tree.deleteNode(node.id);
        }
      }
    }
  ];

  return (
    <Tree.Root 
      data={data} 
      onDataChange={setData}
      customContextMenuItems={customMenuItems}
      contextMenuOptions={{
        rename: true,
        duplicate: true,
        delete: true
      }}
    >
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map(nodeId => (
            <Tree.StyledItem 
              key={nodeId} 
              nodeId={nodeId}
              showIcon
              showContextMenuButton
            >
              {() => (
                <>
                  <Tree.Trigger nodeId={nodeId}>
                    {({ isOpen }) => (
                      <span>{isOpen ? '▼' : '▶'}</span>
                    )}
                  </Tree.Trigger>
                  <Tree.Label nodeId={nodeId} editable />
                </>
              )}
            </Tree.StyledItem>
          ))
        }
      </Tree.List>
    </Tree.Root>
  );
}
```

## Features

- ✅ Right-click context menu
- ✅ Custom menu items
- ✅ Built-in actions (rename, duplicate, delete)
- ✅ Conditional visibility
- ✅ Danger styling
- ✅ Separators
- ✅ Icons

## Configuration

### Built-in Options

```tsx
<Tree.Root
  contextMenuOptions={{
    rename: true,
    duplicate: true,
    delete: true,
    cut: true,
    copy: true,
    paste: true
  }}
>
```

### Custom Items

```tsx
const customItems = (node) => [
  {
    id: 'share',
    label: 'Share',
    icon: <Share size={14} />,
    action: async (node) => {
      const url = await generateShareLink(node);
      navigator.clipboard.writeText(url);
    }
  }
];

<Tree.Root customContextMenuItems={customItems}>
```

## See Also

- [ContextMenuItem Type](/api/context-menu-item)
- [Tree.Root](/api/tree-root)
