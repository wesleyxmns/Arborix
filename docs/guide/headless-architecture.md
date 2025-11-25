# Headless Architecture

Arborix follows a **headless architecture** pattern, giving you complete control over the UI while handling all the complex logic internally.

## What is Headless?

A headless component provides:
- ✅ **Logic & State** - All the complex behavior
- ✅ **Accessibility** - ARIA attributes and keyboard navigation
- ✅ **Data Management** - State, updates, history
- ❌ **No Styling** - You control 100% of the visual design

## Why Headless?

### 1. Complete Design Freedom

```tsx
// You decide EVERYTHING about the UI
<Tree.StyledItem nodeId={nodeId}>
  {() => (
    <div className="my-custom-design">
      <MyIcon />
      <MyLabel />
      <MyActions />
    </div>
  )}
</Tree.StyledItem>
```

### 2. Works with Any Design System

```tsx
// Material UI
<Tree.StyledItem>
  {() => <MuiTreeItem />}
</Tree.StyledItem>

// Chakra UI
<Tree.StyledItem>
  {() => <ChakraTreeItem />}
</Tree.StyledItem>

// Your custom design
<Tree.StyledItem>
  {() => <YourTreeItem />}
</Tree.StyledItem>
```

### 3. No CSS Conflicts

Since Arborix doesn't include any styles, you'll never have CSS conflicts or specificity issues.

## How It Works

### The Render Props Pattern

Arborix uses **render props** to give you access to state:

```tsx
<Tree.Trigger nodeId={nodeId}>
  {({ isOpen, hasChildren, toggle }) => (
    // You have full access to the state
    <button onClick={toggle}>
      {isOpen ? '▼' : '▶'}
    </button>
  )}
</Tree.Trigger>
```

### Component Composition

Build your tree by composing small, focused components:

```tsx
<Tree.Root data={data}>
  <Tree.List>
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.Item key={nodeId} nodeId={nodeId}>
          {/* Compose your UI */}
          <Tree.Trigger nodeId={nodeId}>
            {/* Expand/collapse button */}
          </Tree.Trigger>
          
          <Tree.Checkbox nodeId={nodeId}>
            {/* Checkbox */}
          </Tree.Checkbox>
          
          <Tree.Label nodeId={nodeId}>
            {/* Label with editing */}
          </Tree.Label>
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

## Styling Approaches

### 1. CSS Modules

```tsx
import styles from './Tree.module.css';

<Tree.StyledItem 
  nodeId={nodeId}
  className={styles.item}
>
  {() => (
    <div className={styles.content}>
      <Tree.Label nodeId={nodeId} />
    </div>
  )}
</Tree.StyledItem>
```

### 2. Styled Components

```tsx
import styled from 'styled-components';

const StyledTreeItem = styled.div`
  padding: 8px;
  &:hover {
    background: #f0f0f0;
  }
`;

<Tree.StyledItem nodeId={nodeId}>
  {() => (
    <StyledTreeItem>
      <Tree.Label nodeId={nodeId} />
    </StyledTreeItem>
  )}
</Tree.StyledItem>
```

### 3. Tailwind CSS

```tsx
<Tree.StyledItem 
  nodeId={nodeId}
  className="px-2 py-1 hover:bg-gray-100 rounded"
>
  {() => (
    <div className="flex items-center gap-2">
      <Tree.Label nodeId={nodeId} />
    </div>
  )}
</Tree.StyledItem>
```

### 4. Inline Styles

```tsx
<Tree.StyledItem 
  nodeId={nodeId}
  style={{
    padding: '8px',
    borderRadius: '4px'
  }}
>
  {() => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Tree.Label nodeId={nodeId} />
    </div>
  )}
</Tree.StyledItem>
```

## Benefits

### ✅ Flexibility
Use any styling solution: CSS, CSS-in-JS, Tailwind, etc.

### ✅ No Bundle Bloat
No unused CSS in your bundle.

### ✅ Framework Agnostic
Works with any React setup.

### ✅ Future Proof
Your styles won't break when Arborix updates.

### ✅ Design System Integration
Fits perfectly into your existing design system.

## Trade-offs

### ⚠️ More Setup Required
You need to style the components yourself.

**Solution:** Use `Tree.StyledItem` which provides basic structure, or copy examples from the docs.

### ⚠️ No Default Theme
No out-of-the-box visual design.

**Solution:** Check the [Examples](/examples/basic) for ready-to-use implementations.

## Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **Headless** (Arborix) | Complete control, no CSS conflicts, works with any design system | Requires styling |
| **Styled** (Material-UI) | Ready to use, consistent design | Limited customization, CSS conflicts, bundle bloat |
| **Hybrid** (Radix UI) | Good defaults, customizable | Still includes base styles |

## Next Steps

- Learn about [Component Structure](/guide/component-structure)
- See [Styling Examples](/examples/basic)
- Explore [API Reference](/api/tree-root)
