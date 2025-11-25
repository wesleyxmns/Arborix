# Getting Started

Welcome to Arborix! This guide will help you get up and running in minutes.

## Installation

::: code-group

```bash [npm]
npm install arborix
```

```bash [pnpm]
pnpm add arborix
```

```bash [yarn]
yarn add arborix
```

:::

## Peer Dependencies

Arborix requires React 18.2.0 or higher:

```json
{
  "peerDependencies": {
    "react": ">=18.2.0",
    "react-dom": ">=18.2.0"
  }
}
```

## Your First Tree

Let's create a simple file explorer:

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function FileExplorer() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'src',
      children: [
        { id: '1-1', label: 'App.tsx' },
        { id: '1-2', label: 'index.tsx' },
      ],
    },
    {
      id: '2',
      label: 'public',
      children: [
        { id: '2-1', label: 'index.html' },
      ],
    },
    { id: '3', label: 'package.json' },
  ]);

  return (
    <Tree.Root data={data} onDataChange={setData}>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map((nodeId) => (
            <Tree.StyledItem key={nodeId} nodeId={nodeId} showIcon>
              {() => (
                <>
                  <Tree.Trigger nodeId={nodeId}>
                    {({ isOpen }) => (
                      <span style={{ marginRight: 8 }}>
                        {isOpen ? '📂' : '📁'}
                      </span>
                    )}
                  </Tree.Trigger>
                  <Tree.Label nodeId={nodeId} />
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

## Adding Styles

Arborix is headless, so you need to add your own styles. Here's a basic example:

```css
.tree-root {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.tree-item:hover {
  background: #f0f0f0;
}

.tree-item[aria-selected="true"] {
  background: #e0e0ff;
  font-weight: 500;
}
```

## Next Steps

::: tip What's Next?
- Learn about [Headless Architecture](/guide/headless-architecture)
- Explore [Component Structure](/guide/component-structure)
- Check out [Examples](/examples/basic)
- Read the [API Reference](/api/tree-root)
:::

## Need Help?

- 📖 [Full Documentation](/)
- 💬 [GitHub Discussions](https://github.com/wesleyxmns/Arborix/discussions)
- 🐛 [Report Issues](https://github.com/wesleyxmns/Arborix/issues)
- 📦 [npm Package](https://www.npmjs.com/package/arborix)
