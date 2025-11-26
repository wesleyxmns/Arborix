---
layout: home

hero:
  name: Arborix
  text: Modern Tree Component for React
  tagline: Headless, TypeScript-first, with virtualization, drag & drop, and complete customization
  image:
    src: /ARBORIX_LOGO.png
    alt: Arborix Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/wesleyxmns/Arborix
    - theme: alt
      text: API Reference
      link: /api/tree-root

features:
  - icon: 🎯
    title: Headless Architecture
    details: Complete control over styling and rendering. Bring your own design system and components.
  
  - icon: ⚡
    title: Blazing Fast
    details: Built-in virtualization handles trees with millions of nodes without breaking a sweat.
  
  - icon: 🎨
    title: Fully Customizable
    details: Every aspect is customizable - from icons to animations to behavior.
  
  - icon: ⌨️
    title: Keyboard Navigation
    details: Full keyboard support with shortcuts for power users. Navigate, edit, copy, paste, undo/redo.
  
  - icon: 🖱️
    title: Drag and Drop
    details: Smooth drag and drop powered by @dnd-kit with visual feedback and animations.
  
  - icon: ✅
    title: Checkboxes
    details: Multi-select with indeterminate states and cascading selection.
  
  - icon: 📝
    title: Inline Editing
    details: Edit node labels inline with keyboard shortcuts and validation.
  
  - icon: 🎭
    title: Custom Action Buttons
    details: Add custom buttons to nodes with conditional visibility and tooltips.
  
  - icon: 📋
    title: Context Menus
    details: Flexible context menu system with built-in actions and custom items.
  
  - icon: ↩️
    title: Undo/Redo
    details: Full history management with Ctrl+Z/Ctrl+Y support.
  
  - icon: 🔍
    title: Search & Filter
    details: Built-in search with highlighting and filtering capabilities.
  
  - icon: 🔒
    title: TypeScript
    details: Written in TypeScript with complete type definitions and IntelliSense support.
---

## Quick Example

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function App() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'src',
      children: [
        { id: '1-1', label: 'components' },
        { id: '1-2', label: 'hooks' },
      ],
    },
    { id: '2', label: 'package.json' },
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
                    {({ isOpen }) => <span>{isOpen ? '▼' : '▶'}</span>}
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

## Why Arborix?

<div class="why-arborix">

### 🚀 Performance First
Arborix uses virtualization to render only visible nodes, making it perfect for large datasets. Whether you have 100 or 1,000,000 nodes, performance stays smooth.

### 🎯 Headless Design
Unlike traditional tree components, Arborix is completely headless. You have full control over styling, behavior, and rendering. Perfect for design systems.

### 💪 Feature Complete
Everything you need out of the box: drag & drop, checkboxes, keyboard navigation, search, undo/redo, context menus, and more.

### 🔧 Developer Experience
Written in TypeScript with complete type definitions. IntelliSense, autocomplete, and type checking work perfectly.

</div>

<style>
.why-arborix {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.why-arborix h3 {
  margin-top: 0;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
