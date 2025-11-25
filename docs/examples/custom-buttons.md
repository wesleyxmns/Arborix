# Custom Action Buttons Example

Add custom buttons to tree nodes with conditional visibility and tooltips.

## Live Demo

```tsx
import { Tree, CustomActionButton } from 'arborix';
import { Star, Info, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

function CustomButtonsTree() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Documents',
      children: [
        { id: '1-1', label: 'Report.pdf' },
        { id: '1-2', label: 'Presentation.pptx' }
      ]
    },
    { id: '2', label: 'Image.png' }
  ]);

  const customActionButtons: CustomActionButton[] = [
    {
      id: 'star',
      icon: <Star size={14} />,
      tooltip: 'Mark as favorite',
      action: (node) => {
        console.log('Starred:', node.label);
      }
    },
    {
      id: 'info',
      icon: <Info size={14} />,
      tooltip: 'Show info',
      action: (node) => {
        alert(`Info for: ${node.label}`);
      }
    },
    {
      id: 'download',
      icon: <Download size={14} />,
      tooltip: 'Download',
      visible: (node) => !node.children, // Only for files
      action: (node) => {
        console.log('Download:', node.label);
      }
    },
    {
      id: 'delete',
      icon: <Trash2 size={14} />,
      tooltip: 'Delete',
      danger: true,
      action: (node) => {
        if (confirm(`Delete ${node.label}?`)) {
          console.log('Deleted:', node.label);
        }
      }
    }
  ];

  return (
    <div style={{ fontFamily: 'system-ui', fontSize: '14px' }}>
      <Tree.Root 
        data={data} 
        onDataChange={setData}
        customActionButtons={customActionButtons}
      >
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map((nodeId) => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                showIcon
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}
              >
                {() => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Tree.Trigger nodeId={nodeId}>
                      {({ isOpen, hasChildren }) =>
                        hasChildren && (
                          <span>{isOpen ? '▼' : '▶'}</span>
                        )
                      }
                    </Tree.Trigger>
                    <Tree.Label nodeId={nodeId} />
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

- ✅ Custom action buttons
- ✅ Hover-based visibility
- ✅ Tooltips
- ✅ Conditional visibility
- ✅ Danger styling
- ✅ Icon support

## Button Configuration

### Basic Button

```tsx
{
  id: 'star',
  icon: <Star size={14} />,
  tooltip: 'Mark as favorite',
  action: (node) => {
    console.log('Starred:', node.label);
  }
}
```

### Conditional Visibility

```tsx
{
  id: 'download',
  icon: <Download size={14} />,
  tooltip: 'Download',
  visible: (node) => !node.children, // Only show for files
  action: (node) => {
    downloadFile(node);
  }
}
```

### Danger Button

```tsx
{
  id: 'delete',
  icon: <Trash2 size={14} />,
  tooltip: 'Delete',
  danger: true, // Red styling
  action: (node) => {
    deleteNode(node);
  }
}
```

## CustomActionButton Type

```tsx
interface CustomActionButton {
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
  action: (node: TreeNode) => void;
  visible?: (node: TreeNode) => boolean;
  danger?: boolean;
}
```

## Advanced Example

```tsx
const customButtons: CustomActionButton[] = [
  {
    id: 'edit',
    icon: <Edit size={14} />,
    tooltip: 'Edit',
    action: (node) => {
      tree.startEditing(node.id);
    }
  },
  {
    id: 'duplicate',
    icon: <Copy size={14} />,
    tooltip: 'Duplicate',
    action: (node) => {
      tree.duplicateNode(node.id);
    }
  },
  {
    id: 'share',
    icon: <Share size={14} />,
    tooltip: 'Share',
    visible: (node) => {
      // Only show for specific types
      return node.label.endsWith('.pdf') || 
             node.label.endsWith('.docx');
    },
    action: async (node) => {
      const url = await generateShareLink(node);
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  },
  {
    id: 'archive',
    icon: <Archive size={14} />,
    tooltip: 'Archive',
    visible: (node) => !node.archived,
    action: (node) => {
      tree.updateNode(node.id, { archived: true });
    }
  }
];
```

## Styling

### Default Styles

Buttons appear on hover with smooth transitions:

```css
.action-buttons {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-item:hover .action-buttons {
  opacity: 1;
}

.action-button {
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #f0f0f0;
}

.action-button.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}
```

## With Icons

Using Lucide React icons:

```bash
npm install lucide-react
```

```tsx
import { 
  Star, 
  Info, 
  Trash2, 
  Download,
  Edit,
  Copy,
  Share,
  Archive 
} from 'lucide-react';
```

## Real-World Example

```tsx
function FileManager() {
  const tree = Tree.useTree();
  
  const buttons: CustomActionButton[] = [
    {
      id: 'favorite',
      icon: <Star size={14} />,
      tooltip: 'Add to favorites',
      action: (node) => {
        tree.updateNode(node.id, { 
          favorite: !node.favorite 
        });
      }
    },
    {
      id: 'rename',
      icon: <Edit size={14} />,
      tooltip: 'Rename (F2)',
      action: (node) => {
        tree.startEditing(node.id);
      }
    },
    {
      id: 'download',
      icon: <Download size={14} />,
      tooltip: 'Download',
      visible: (node) => !node.children,
      action: async (node) => {
        await downloadFile(node.id);
      }
    },
    {
      id: 'delete',
      icon: <Trash2 size={14} />,
      tooltip: 'Delete (Del)',
      danger: true,
      action: (node) => {
        if (confirm(`Delete "${node.label}"?`)) {
          tree.deleteNode(node.id);
        }
      }
    }
  ];

  return (
    <Tree.Root customActionButtons={buttons}>
      {/* ... */}
    </Tree.Root>
  );
}
```

## Next Steps

- Add [Context Menus](/examples/context-menus)
- Implement [Keyboard Shortcuts](/guide/keyboard-navigation)
- Learn about [State Management](/guide/state-management)
