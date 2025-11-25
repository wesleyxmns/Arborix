# Basic Tree Example

A simple file explorer with folders and files.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function BasicTree() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'src',
      children: [
        {
          id: '1-1',
          label: 'components',
          children: [
            { id: '1-1-1', label: 'Button.tsx' },
            { id: '1-1-2', label: 'Input.tsx' }
          ]
        },
        {
          id: '1-2',
          label: 'hooks',
          children: [
            { id: '1-2-1', label: 'useAuth.ts' },
            { id: '1-2-2', label: 'useData.ts' }
          ]
        },
        { id: '1-3', label: 'App.tsx' },
        { id: '1-4', label: 'index.tsx' }
      ]
    },
    {
      id: '2',
      label: 'public',
      children: [
        { id: '2-1', label: 'index.html' },
        { id: '2-2', label: 'favicon.ico' }
      ]
    },
    { id: '3', label: 'package.json' },
    { id: '4', label: 'tsconfig.json' },
    { id: '5', label: 'README.md' }
  ]);

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      maxWidth: '400px'
    }}>
      <Tree.Root data={data} onDataChange={setData}>
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map((nodeId) => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                style={{
                  padding: '4px 8px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {({ isSelected }) => (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isSelected ? '#e0e0ff' : 'transparent'
                    }}
                  >
                    <Tree.Trigger nodeId={nodeId}>
                      {({ isOpen, hasChildren }) =>
                        hasChildren ? (
                          <span style={{ 
                            fontSize: '12px',
                            transition: 'transform 0.2s'
                          }}>
                            {isOpen ? '📂' : '📁'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px' }}>📄</span>
                        )
                      }
                    </Tree.Trigger>
                    
                    <Tree.Label nodeId={nodeId}>
                      {({ value }) => (
                        <span style={{ 
                          flex: 1,
                          userSelect: 'none'
                        }}>
                          {value}
                        </span>
                      )}
                    </Tree.Label>
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

## Features Demonstrated

- ✅ Basic tree structure
- ✅ Folders and files
- ✅ Expand/collapse functionality
- ✅ Icons for folders and files
- ✅ Selection highlighting
- ✅ Click to select

## Styling

This example uses inline styles for simplicity. In a real application, you would use:

- CSS Modules
- Styled Components
- Tailwind CSS
- Your preferred styling solution

## Code Breakdown

### 1. Data Structure

```tsx
const data = [
  {
    id: '1',
    label: 'src',
    children: [/* nested items */]
  }
];
```

Each node has:
- `id` - Unique identifier
- `label` - Display text
- `children` - Optional array of child nodes

### 2. Tree.Root

```tsx
<Tree.Root data={data} onDataChange={setData}>
```

Manages the tree state and provides context.

### 3. Tree.List

```tsx
<Tree.List>
  {({ visibleNodes }) => /* render nodes */}
</Tree.List>
```

Provides the list of visible nodes (respects expand/collapse state).

### 4. Tree.StyledItem

```tsx
<Tree.StyledItem nodeId={nodeId}>
  {({ isSelected }) => /* render UI */}
</Tree.StyledItem>
```

Wrapper for each tree item with built-in functionality.

### 5. Tree.Trigger

```tsx
<Tree.Trigger nodeId={nodeId}>
  {({ isOpen, hasChildren }) => /* render expand/collapse */}
</Tree.Trigger>
```

Handles expand/collapse logic.

### 6. Tree.Label

```tsx
<Tree.Label nodeId={nodeId}>
  {({ value }) => <span>{value}</span>}
</Tree.Label>
```

Displays the node label.

## Next Steps

- Add [Checkboxes](/examples/checkboxes)
- Enable [Drag and Drop](/examples/drag-drop)
- Add [Custom Buttons](/examples/custom-buttons)
- Implement [Context Menus](/examples/context-menus)

## Try It Yourself

Copy this code and:
1. Change the icons
2. Modify the styling
3. Add more nodes
4. Customize the behavior
