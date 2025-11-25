# What is Arborix?

Arborix is a modern, **headless tree component** for React that gives you complete control over styling and behavior while providing powerful features out of the box.

## The Problem

Building tree views in React is challenging:

- **Performance**: Large datasets cause lag and poor UX
- **Customization**: Most libraries force you into their design system
- **Features**: You need drag & drop, checkboxes, search, etc.
- **TypeScript**: Many libraries have poor or no type support

## The Solution

Arborix solves these problems with:

### 🎯 Headless Architecture

Unlike traditional tree components, Arborix is **completely headless**. It provides the logic, state management, and behavior - you provide the UI.

```tsx
// You control EVERYTHING about the rendering
<Tree.StyledItem nodeId={nodeId}>
  {() => (
    <div className="my-custom-node">
      {/* Your custom UI here */}
    </div>
  )}
</Tree.StyledItem>
```

### ⚡ Built-in Virtualization

Arborix uses `@tanstack/react-virtual` to render only visible nodes. This means:

- ✅ Smooth performance with 1,000,000+ nodes
- ✅ Constant memory usage regardless of tree size
- ✅ Instant scrolling and navigation

### 💪 Feature Complete

Everything you need is included:

- Drag and drop with visual feedback
- Checkboxes with indeterminate states
- Keyboard navigation with shortcuts
- Search and filtering
- Inline editing
- Undo/Redo
- Context menus
- Custom action buttons
- Lazy loading
- And more!

### 🔒 TypeScript First

Written in TypeScript with complete type definitions:

```tsx
import type { TreeData, TreeNode, CustomActionButton } from 'arborix';

const data: TreeData = [/* ... */];
const buttons: CustomActionButton[] = [/* ... */];
```

## When to Use Arborix

Arborix is perfect for:

- ✅ File explorers
- ✅ Organization charts
- ✅ Category browsers
- ✅ Navigation menus
- ✅ Hierarchical data visualization
- ✅ Any tree-structured data

## When NOT to Use Arborix

Arborix might be overkill if:

- ❌ You have a simple, static tree (< 50 nodes)
- ❌ You don't need any advanced features
- ❌ You want a pre-styled component (use a UI library instead)

## Comparison

| Feature | Arborix | react-arborist | react-complex-tree |
|---------|---------|----------------|-------------------|
| Headless | ✅ | ❌ | ❌ |
| Virtualization | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ⚠️ | ✅ |
| Custom Buttons | ✅ | ❌ | ❌ |
| Undo/Redo | ✅ | ❌ | ❌ |
| Bundle Size | Small | Medium | Large |

## Philosophy

Arborix follows these principles:

1. **Headless First**: You control the UI completely
2. **Performance**: Virtualization is not optional, it's built-in
3. **Developer Experience**: TypeScript, great docs, intuitive API
4. **Feature Rich**: Everything you need, nothing you don't
5. **Composable**: Use only what you need

## Next Steps

Ready to get started?

::: tip
- [Installation & Setup](/guide/getting-started)
- [Learn the Architecture](/guide/headless-architecture)
- [See Examples](/examples/basic)
:::
