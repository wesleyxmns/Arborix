---
layout: home

hero:
  name: Arborix
  text: The most powerful tree component for React
  tagline: Headless. TypeScript-first. Performance-optimized. Build hierarchical UIs with complete control.
  image:
    src: /ARBORIX_LOGO.png
    alt: Arborix Logo
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/wesleyxmns/Arborix

features:
  - icon: ⚡
    title: Zero Config with v2.1
    details: New SimpleTree component gets you started in seconds. Perfect for prototypes and production apps alike.
  - icon: 🎨
    title: Headless Architecture
    details: Complete control over markup and styles. Integrate seamlessly with any design system or CSS framework.
  - icon: 🚀
    title: High Performance
    details: Built-in virtualization handles 10,000+ nodes smoothly. Only renders what's visible on screen.
  - icon: 🎯
    title: Drag & Drop Built-in
    details: Powered by @dnd-kit for smooth, accessible interactions. Works out of the box with zero configuration.
  - icon: ⌨️
    title: Keyboard Navigation
    details: Full WAI-ARIA support with comprehensive keyboard shortcuts. Accessibility-first design.
  - icon: 📦
    title: TypeScript First
    details: Fully typed API with excellent IntelliSense. Catch errors before runtime with complete type safety.
  - icon: 🧰
    title: TreeRecipes Utilities
    details: 18+ built-in utility functions for filtering, sorting, searching, and manipulating tree data.
  - icon: 🎣
    title: useTreeHelpers Hook
    details: 30+ convenience methods for common operations. Add folders, delete selections, expand all with one line.
  - icon: 🔧
    title: Highly Customizable
    details: Custom action buttons, context menus, icons, and complete behavior control for any use case.
---

## 🆕 What's New in v2.1

Version 2.1 introduces major usability improvements while maintaining 100% backward compatibility:

::: tip SIMPLER THAN EVER
v2.1 reduces boilerplate by 90% with automatic rendering components and helper utilities.
:::

### Three Ways to Use Arborix

<div class="language-tsx"><pre><code><span class="line"><span style="color:#6A737D;">// 1. Zero Config (NEW in v2.1) - Fastest way to get started</span></span>
<span class="line"><span style="color:#F97583;">import</span> <span style="color:#E1E4E8;">{ SimpleTree }</span> <span style="color:#F97583;">from</span> <span style="color:#9ECBFF;">'arborix'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">&lt;SimpleTree</span></span>
<span class="line">  <span style="color:#FFAB70;">data</span><span style="color:#E1E4E8;">={data}</span></span>
<span class="line">  <span style="color:#FFAB70;">onDataChange</span><span style="color:#E1E4E8;">={setData}</span></span>
<span class="line">  <span style="color:#FFAB70;">showCheckboxes</span></span>
<span class="line">  <span style="color:#FFAB70;">editable</span></span>
<span class="line">  <span style="color:#FFAB70;">enableDragDrop</span></span>
<span class="line"><span style="color:#B392F0;">/&gt;</span></span></code></pre></div>

<div class="language-tsx"><pre><code><span class="line"><span style="color:#6A737D;">// 2. Auto Rendering (NEW in v2.1) - No manual recursion needed</span></span>
<span class="line"><span style="color:#F97583;">import</span> <span style="color:#E1E4E8;">{ Tree }</span> <span style="color:#F97583;">from</span> <span style="color:#9ECBFF;">'arborix'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">&lt;Tree.Root</span> <span style="color:#FFAB70;">data</span><span style="color:#E1E4E8;">={data}</span> <span style="color:#FFAB70;">onDataChange</span><span style="color:#E1E4E8;">={setData}</span><span style="color:#B392F0;">&gt;</span></span>
<span class="line">  <span style="color:#B392F0;">&lt;Tree.Auto</span> <span style="color:#FFAB70;">showCheckbox</span> <span style="color:#FFAB70;">editable</span> <span style="color:#FFAB70;">showIcon</span> <span style="color:#B392F0;">/&gt;</span></span>
<span class="line"><span style="color:#B392F0;">&lt;/Tree.Root&gt;</span></span></code></pre></div>

<div class="language-tsx"><pre><code><span class="line"><span style="color:#6A737D;">// 3. Full Control - Traditional approach with complete customization</span></span>
<span class="line"><span style="color:#B392F0;">&lt;Tree.Root</span> <span style="color:#FFAB70;">data</span><span style="color:#E1E4E8;">={data}</span> <span style="color:#FFAB70;">onDataChange</span><span style="color:#E1E4E8;">={setData}</span><span style="color:#B392F0;">&gt;</span></span>
<span class="line">  <span style="color:#B392F0;">&lt;Tree.List&gt;</span></span>
<span class="line">    <span style="color:#E1E4E8;">{</span><span style="color:#F97583;">(</span><span style="color:#E1E4E8;">{ visibleNodes }</span><span style="color:#F97583;">)</span> <span style="color:#F97583;">=&gt;</span></span>
<span class="line">      <span style="color:#79B8FF;">visibleNodes</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">nodeId</span> <span style="color:#F97583;">=&gt;</span> <span style="color:#E1E4E8;">(</span></span>
<span class="line">        <span style="color:#B392F0;">&lt;Tree.Item</span> <span style="color:#FFAB70;">key</span><span style="color:#E1E4E8;">={nodeId}</span> <span style="color:#FFAB70;">nodeId</span><span style="color:#E1E4E8;">={nodeId}</span><span style="color:#B392F0;">&gt;</span></span>
<span class="line">          <span style="color:#B392F0;">&lt;Tree.Trigger</span> <span style="color:#B392F0;">/&gt;</span>  <span style="color:#6A737D;">{/* No nodeId needed! */}</span></span>
<span class="line">          <span style="color:#B392F0;">&lt;Tree.Label</span> <span style="color:#FFAB70;">editable</span> <span style="color:#B392F0;">/&gt;</span></span>
<span class="line">        <span style="color:#B392F0;">&lt;/Tree.Item&gt;</span></span>
<span class="line">      <span style="color:#E1E4E8;">))</span></span>
<span class="line">    <span style="color:#E1E4E8;">}</span></span>
<span class="line">  <span style="color:#B392F0;">&lt;/Tree.List&gt;</span></span>
<span class="line"><span style="color:#B392F0;">&lt;/Tree.Root&gt;</span></span></code></pre></div>

## Why Developers Love Arborix

### 🚀 Performance First

Virtualization renders only visible nodes. Handle massive datasets with ease:

```tsx
<Tree.Root
  data={largeDataset}
  enableVirtualization
  height={600}
  rowHeight={32}
>
  <Tree.Auto showCheckbox editable />
</Tree.Root>
```

### 🧰 Powerful Utilities

Stop writing the same tree manipulation code over and over:

```tsx
import { TreeRecipes, useTreeHelpers } from 'arborix';

// Built-in utilities
const filtered = TreeRecipes.filterTree(data, 'search term');
const sorted = TreeRecipes.sortByLabel(data);
const nodeCount = TreeRecipes.countNodes(data);

// Convenience helpers
function Toolbar() {
  const helpers = useTreeHelpers();

  return (
    <>
      <button onClick={() => helpers.addFolderAndEdit(null)}>
        Add Folder
      </button>
      <button onClick={() => helpers.deleteSelected()}>
        Delete Selected
      </button>
      <button onClick={() => helpers.expandAll()}>
        Expand All
      </button>
    </>
  );
}
```

### 🎯 Headless Design

Perfect for design systems. Works with any styling solution:

```tsx
<Tree.Item nodeId={id}>
  {(state) => (
    <div className={cn(
      'px-3 py-2 rounded-lg cursor-pointer',
      state.isSelected && 'bg-blue-100 text-blue-900',
      state.isDragging && 'opacity-50'
    )}>
      <Tree.Label />
    </div>
  )}
</Tree.Item>
```

### 💪 Feature Complete

Everything you need out of the box:

- ✅ Drag and drop reordering
- ✅ Multi-select with checkboxes
- ✅ Keyboard navigation (↑↓←→ Enter Space F2)
- ✅ Inline editing
- ✅ Context menus
- ✅ Undo/Redo
- ✅ Search and filtering
- ✅ Custom action buttons
- ✅ Lazy loading
- ✅ State persistence

## Real-World Use Cases

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">📁 File Explorers</h3>
  <p>Build VS Code-like file trees with drag & drop, context menus, and inline renaming.</p>
</div>

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">📧 Email Clients</h3>
  <p>Create nested folder structures for organizing emails with badges and custom icons.</p>
</div>

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">🏢 Organization Charts</h3>
  <p>Display company hierarchies with custom rendering and interactive navigation.</p>
</div>

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">✅ Task Managers</h3>
  <p>Build project management tools with subtasks, checkboxes, and drag to reorder.</p>
</div>

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">🗂️ Category Managers</h3>
  <p>Create product categories, tags, or any hierarchical taxonomy with ease.</p>
</div>

<div style="border: 1px solid var(--vp-c-border); border-radius: 12px; padding: 1.5rem; background: var(--vp-c-bg-soft);">
  <h3 style="margin-top: 0;">📊 Data Explorers</h3>
  <p>Visualize nested JSON, database schemas, or any tree-structured data.</p>
</div>

</div>

## Battle-Tested

Arborix is production-ready and used by teams worldwide:

- ⚡ **10,000+ nodes** - Smooth performance with virtualization
- 🎯 **Zero dependencies** - Besides peer dependencies (React, @dnd-kit for drag-drop)
- 📦 **Tree-shakeable** - Import only what you need
- ♿ **Accessible** - Full WAI-ARIA support, keyboard navigation
- 🔒 **Type-safe** - 100% TypeScript with strict mode
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 🌙 **Theme-friendly** - Dark mode ready
- ⚖️ **MIT Licensed** - Free for commercial use

## Get Started in 30 Seconds

```bash
npm install arborix
```

```tsx
import { SimpleTree } from 'arborix';
import { useState } from 'react';

function App() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Documents',
      children: [
        { id: '1-1', label: 'Resume.pdf' },
        { id: '1-2', label: 'Cover Letter.docx' }
      ]
    },
    { id: '2', label: 'Photos' }
  ]);

  return (
    <SimpleTree
      data={data}
      onDataChange={setData}
      showCheckboxes
      editable
      enableDragDrop
    />
  );
}
```

::: tip READY TO BUILD?
[Get Started →](/guide/getting-started) | [See Examples →](/examples/simple-tree) | [API Reference →](/api/simple-tree)
:::

## Community & Support

- 💬 [GitHub Discussions](https://github.com/wesleyxmns/Arborix/discussions) - Ask questions and share ideas
- 🐛 [GitHub Issues](https://github.com/wesleyxmns/Arborix/issues) - Report bugs and request features
- ⭐ [Star on GitHub](https://github.com/wesleyxmns/Arborix) - Show your support
- 📦 [npm Package](https://www.npmjs.com/package/arborix) - Latest releases

---

<div style="text-align: center; padding: 2rem 0;">
  <p style="color: var(--vp-c-text-3); font-size: 0.9rem;">
    Built with ❤️ by <a href="https://github.com/wesleyxmns" target="_blank">Wesley Ximenes</a>
  </p>
  <p style="color: var(--vp-c-text-3); font-size: 0.85rem;">
    MIT Licensed | Copyright © 2024
  </p>
</div>
