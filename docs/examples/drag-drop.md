# Drag and Drop Example

Enable smooth drag and drop with visual feedback and animations.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function DragDropTree() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Projects',
      children: [
        { id: '1-1', label: 'Website Redesign' },
        { id: '1-2', label: 'Mobile App' }
      ]
    },
    {
      id: '2',
      label: 'Tasks',
      children: [
        { id: '2-1', label: 'Review PRs' },
        { id: '2-2', label: 'Update Docs' }
      ]
    },
    { id: '3', label: 'Archive' }
  ]);

  return (
    <div style={{ fontFamily: 'system-ui', fontSize: '14px' }}>
      <Tree.Root 
        data={data} 
        onDataChange={setData}
        enableDragDrop
      >
        <Tree.List>
          {({ visibleNodes }) =>
            visibleNodes.map((nodeId) => (
              <Tree.StyledItem 
                key={nodeId} 
                nodeId={nodeId}
                showGrip
                showIcon
                style={{
                  padding: '8px',
                  margin: '2px 0',
                  borderRadius: '6px',
                  cursor: 'grab',
                  transition: 'all 0.2s'
                }}
              >
                {({ isDragging, isOver }) => (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: isDragging ? 0.5 : 1,
                      background: isOver ? '#e0f2fe' : 'transparent'
                    }}
                  >
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

- ✅ Drag and drop nodes
- ✅ Reorder siblings
- ✅ Move to different parents
- ✅ Visual feedback (opacity, background)
- ✅ Drag handle (grip icon)
- ✅ Smooth animations

## How It Works

### 1. Enable Drag and Drop

```tsx
<Tree.Root 
  data={data} 
  onDataChange={setData}
  enableDragDrop  // ← Enable drag and drop
>
```

### 2. Show Drag Handle

```tsx
<Tree.StyledItem 
  nodeId={nodeId}
  showGrip  // ← Show drag handle
>
```

### 3. Visual Feedback

```tsx
<Tree.StyledItem nodeId={nodeId}>
  {({ isDragging, isOver }) => (
    <div style={{
      opacity: isDragging ? 0.5 : 1,
      background: isOver ? '#e0f2fe' : 'transparent'
    }}>
      {/* ... */}
    </div>
  )}
</Tree.StyledItem>
```

## Drag States

| State | Description |
|-------|-------------|
| `isDragging` | This node is being dragged |
| `isOver` | Mouse is over this node (drop target) |
| `canDrop` | This node can accept the drop |

## Customization

### Custom Drag Handle

```tsx
<Tree.StyledItem nodeId={nodeId}>
  {() => (
    <div>
      <span className="drag-handle">⋮⋮</span>
      <Tree.Label nodeId={nodeId} />
    </div>
  )}
</Tree.StyledItem>
```

### Drop Indicators

```tsx
{({ isOver, dropPosition }) => (
  <div>
    {isOver && dropPosition === 'before' && (
      <div className="drop-indicator-top" />
    )}
    <Tree.Label nodeId={nodeId} />
    {isOver && dropPosition === 'after' && (
      <div className="drop-indicator-bottom" />
    )}
  </div>
)}
```

### Prevent Drops

```tsx
<Tree.Root
  data={data}
  enableDragDrop
  onAction={(action) => {
    if (action.type === 'move') {
      // Validate the move
      if (!canMove(action.nodeId, action.targetId)) {
        return; // Prevent the move
      }
    }
  }}
>
```

## Advanced Example

```tsx
function AdvancedDragDrop() {
  const [data, setData] = useState(initialData);

  return (
    <Tree.Root 
      data={data} 
      onDataChange={setData}
      enableDragDrop
      onAction={(action) => {
        if (action.type === 'move') {
          console.log('Moved:', action.nodeId, 'to', action.targetId);
        }
      }}
    >
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map((nodeId) => (
            <Tree.StyledItem 
              key={nodeId} 
              nodeId={nodeId}
              showGrip
              className="tree-item"
            >
              {({ isDragging, isOver, dropPosition }) => (
                <div 
                  className={`
                    item-content
                    ${isDragging ? 'dragging' : ''}
                    ${isOver ? 'drop-target' : ''}
                    ${isOver && dropPosition === 'inside' ? 'drop-inside' : ''}
                  `}
                >
                  <Tree.Trigger nodeId={nodeId}>
                    {({ isOpen }) => (
                      <span>{isOpen ? '📂' : '📁'}</span>
                    )}
                  </Tree.Trigger>
                  <Tree.Label nodeId={nodeId} editable />
                </div>
              )}
            </Tree.StyledItem>
          ))
        }
      </Tree.List>
    </Tree.Root>
  );
}
```

## CSS Example

```css
.tree-item {
  padding: 8px;
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.2s;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.drop-target {
  background: #e0f2fe;
  border: 2px dashed #0ea5e9;
}

.drop-inside {
  background: #dbeafe;
}
```

## Next Steps

- Add [Checkboxes](/examples/checkboxes)
- Implement [Custom Buttons](/examples/custom-buttons)
- Learn about [Keyboard Navigation](/guide/keyboard-navigation)
