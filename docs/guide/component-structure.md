# Component Structure

Understanding the anatomy of the Arborix Tree component.

Arborix uses a **compound component pattern**. This means you assemble the tree using multiple smaller components that work together. This gives you maximum flexibility over the layout and rendering.

## The Parts

### `Tree.Root`
The main container. It initializes the tree state, handles data management, and provides the context for all child components.
- **Props:** `data`, `onDataChange`, `enableDragDrop`, etc.
- **Role:** State Provider.

### `Tree.List`
The container for the list of nodes. It handles **virtualization** (if enabled) and rendering the visible nodes.
- **Role:** Layout & Virtualization.
- **Render Prop:** Provides `visibleNodes` array.

### `Tree.Item` (Headless)
The basic unit of the tree. It represents a single node but renders *nothing* by default. You must provide the content.
- **Role:** Node Logic (selection, drag state, depth).
- **Render Prop:** Provides `isSelected`, `isDragging`, `depth`, etc.

### `Tree.StyledItem` (Pre-styled)
A convenience wrapper around `Tree.Item` that provides a standard structure (row layout, hover effects).
- **Role:** Quick Start & Standard Layout.
- **Props:** `showIcon`, `showGrip`, `showContextMenuButton`.

### `Tree.Trigger`
The expand/collapse button (chevron).
- **Role:** Toggling node expansion.

### `Tree.Label`
The text label of the node. Supports inline editing.
- **Role:** Display & Editing.

### `Tree.Checkbox`
The selection checkbox. Handles tri-state (checked, unchecked, indeterminate).
- **Role:** Multi-selection.

## Visualizing the Hierarchy

```tsx
<Tree.Root>                  <!-- 1. State Provider -->
  <Tree.List>                <!-- 2. Virtualizer/List -->
    {({ visibleNodes }) =>
      visibleNodes.map(nodeId => (
        <Tree.Item>          <!-- 3. Node Logic -->
          <Tree.Trigger />   <!-- 4. Expand Toggle -->
          <Tree.Checkbox />  <!-- 5. Selection -->
          <Tree.Label />     <!-- 6. Content -->
        </Tree.Item>
      ))
    }
  </Tree.List>
</Tree.Root>
```

## Why this structure?

Separating these concerns allows you to:
1.  **Reposition elements:** Put the checkbox after the label? Sure.
2.  **Custom rendering:** Use your own button instead of `Tree.Trigger`.
3.  **Performance:** Only the components that need to update will re-render.
