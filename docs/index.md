---
layout: home

hero:
  name: Modern Tree Component
  text: Build powerful hierarchical UIs with React
  tagline: Headless, TypeScript-first, with virtualization and drag & drop. Complete control over your design.
  image:
    src: /ARBORIX_LOGO.png
    alt: Arborix
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/wesleyxmns/Arborix

features:
  - icon: 🎨
    title: Headless Architecture
    details: Full control over markup and styles. Integrate seamlessly with any design system.
  - icon: ⚡
    title: High Performance
    details: Built-in virtualization handles 10,000+ nodes smoothly. Only renders what's visible.
  - icon: 🎯
    title: Drag & Drop
    details: Powered by @dnd-kit for smooth, accessible interactions. Works out of the box.
  - icon: ⌨️
    title: Keyboard Navigation
    details: Full WAI-ARIA support with comprehensive keyboard shortcuts. Accessibility first.
  - icon: 📦
    title: TypeScript First
    details: Fully typed API with excellent IntelliSense. Catch errors before runtime.
  - icon: 🔧
    title: Customizable
    details: Custom action buttons, context menus, and complete behavior control.
---

## Quick Example

Build a file explorer in minutes:

```tsx
import { Tree } from 'arborix';

function FileExplorer() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Documents',
      children: [
        { id: '1-1', label: 'Resume.pdf' },
        { id: '1-2', label: 'Cover Letter.docx' }
      ]
    }
  ]);

  return (
    <Tree.Root data={data} onDataChange={setData} enableDragDrop>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map(nodeId => (
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

### 🚀 Performance First
Virtualization renders only visible nodes. Handle 10,000+ items smoothly.

### 🎯 Headless Design
Complete control over styling and behavior. Perfect for design systems.

### 💪 Feature Complete
Drag & drop, checkboxes, keyboard navigation, undo/redo, and more.

### 🔧 Developer Experience
TypeScript-first with excellent IntelliSense and type safety.
