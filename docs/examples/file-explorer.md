# File Explorer Example

Complete file explorer with all features.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { 
  Folder, 
  File, 
  Image, 
  FileText, 
  Code,
  Star,
  Trash2,
  Download,
  Share
} from 'lucide-react';
import { useState } from 'react';

function FileExplorer() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Documents',
      type: 'folder',
      children: [
        { id: '1-1', label: 'Resume.pdf', type: 'pdf' },
        { id: '1-2', label: 'Cover Letter.docx', type: 'doc' }
      ]
    },
    {
      id: '2',
      label: 'Photos',
      type: 'folder',
      children: [
        { id: '2-1', label: 'Vacation.jpg', type: 'image' },
        { id: '2-2', label: 'Family.png', type: 'image' }
      ]
    },
    {
      id: '3',
      label: 'Projects',
      type: 'folder',
      children: [
        { id: '3-1', label: 'index.tsx', type: 'code' },
        { id: '3-2', label: 'styles.css', type: 'code' }
      ]
    }
  ]);

  const getIcon = (node) => {
    if (node.children) return <Folder size={16} />;
    
    switch (node.type) {
      case 'image': return <Image size={16} />;
      case 'pdf':
      case 'doc': return <FileText size={16} />;
      case 'code': return <Code size={16} />;
      default: return <File size={16} />;
    }
  };

  const customButtons = [
    {
      id: 'favorite',
      icon: <Star size={14} />,
      tooltip: 'Add to favorites',
      action: (node) => {
        console.log('Favorited:', node.label);
      }
    },
    {
      id: 'download',
      icon: <Download size={14} />,
      tooltip: 'Download',
      visible: (node) => !node.children,
      action: (node) => {
        console.log('Download:', node.label);
      }
    },
    {
      id: 'share',
      icon: <Share size={14} />,
      tooltip: 'Share',
      visible: (node) => !node.children,
      action: (node) => {
        console.log('Share:', node.label);
      }
    },
    {
      id: 'delete',
      icon: <Trash2 size={14} />,
      tooltip: 'Delete',
      danger: true,
      action: (node) => {
        if (confirm(`Delete "${node.label}"?`)) {
          tree.deleteNode(node.id);
        }
      }
    }
  ];

  const contextMenuItems = (node) => [
    {
      id: 'open',
      label: 'Open',
      action: (node) => console.log('Open:', node.label)
    },
    {
      id: 'rename',
      label: 'Rename',
      action: (node) => tree.startEditing(node.id),
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      action: (node) => tree.deleteNode(node.id)
    }
  ];

  return (
    <div style={{ 
      fontFamily: 'system-ui',
      fontSize: '14px',
      maxWidth: '600px'
    }}>
      <Tree.Root 
        data={data} 
        onDataChange={setData}
        enableDragDrop
        customActionButtons={customButtons}
        customContextMenuItems={contextMenuItems}
      >
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map(nodeId => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                showGrip
                showContextMenuButton
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}
              >
                {({ node, isSelected }) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isSelected ? '#e0e0ff' : 'transparent'
                  }}>
                    {getIcon(node)}
                    
                    <Tree.Trigger nodeId={nodeId}>
                      {({ isOpen, hasChildren }) =>
                        hasChildren && (
                          <span style={{ fontSize: '12px' }}>
                            {isOpen ? '▼' : '▶'}
                          </span>
                        )
                      }
                    </Tree.Trigger>
                    
                    <Tree.Label nodeId={nodeId} editable />
                  </div>
                )}
              </Tree.StyledItem>
            ))
          }
        </Tree.List>
      </Tree.Root>
    </div>
  );
}
```

## Features

- ✅ Custom icons per file type
- ✅ Drag and drop
- ✅ Custom action buttons
- ✅ Context menus
- ✅ Inline editing
- ✅ Keyboard navigation

## File Type Icons

```tsx
const getIcon = (node) => {
  if (node.children) return <Folder />;
  
  const ext = node.label.split('.').pop();
  
  switch (ext) {
    case 'jpg':
    case 'png': return <Image />;
    case 'pdf': return <FileText />;
    case 'tsx':
    case 'jsx': return <Code />;
    default: return <File />;
  }
};
```

## See Also

- [Custom Buttons](/examples/custom-buttons)
- [Context Menus](/examples/context-menus)
- [Drag and Drop](/examples/drag-drop)
