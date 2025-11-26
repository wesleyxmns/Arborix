# Icons Example

Using custom icons with Arborix.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { Folder, File, Image, Music } from 'lucide-react';

function IconTree() {
  // ... data setup ...

  const getIcon = (node) => {
    if (node.children) return <Folder size={16} />;
    if (node.label.endsWith('.mp3')) return <Music size={16} />;
    if (node.label.endsWith('.png')) return <Image size={16} />;
    return <File size={16} />;
  };

  return (
    <Tree.Root data={data}>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map(nodeId => (
            <Tree.StyledItem key={nodeId} nodeId={nodeId}>
              {({ node }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tree.Trigger nodeId={nodeId} />
                  
                  {/* Render Icon */}
                  <span style={{ color: '#666' }}>
                    {getIcon(node)}
                  </span>
                  
                  <Tree.Label nodeId={nodeId} />
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

## Integration

Arborix is icon-agnostic. You can use:
- `lucide-react`
- `react-icons` (FontAwesome, Material, etc.)
- SVGs
- Emojis 📁 📄

Just render them inside your item component.
