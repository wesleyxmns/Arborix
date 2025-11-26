# Installation

Get started with Arborix in your React project.

## Prerequisites

- React 16.8 or later
- Node.js 16 or later

## Install Package

Arborix is available as an npm package.

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

Arborix relies on a few powerful libraries for its core functionality. You usually don't need to install them separately as they are bundled, but if you run into issues, ensure you have:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0

## Setup

No global provider or complex setup is required. You can import and use the `Tree` component directly in any file.

```tsx
import { Tree } from 'arborix';

function App() {
  return (
    <Tree.Root data={[]}>
      {/* ... */}
    </Tree.Root>
  );
}
```

## Next Steps

- [What is Arborix?](/guide/what-is-arborix)
- [Getting Started](/guide/getting-started)
- [Component Structure](/guide/component-structure)
