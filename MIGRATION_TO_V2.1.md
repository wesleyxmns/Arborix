# Migration Guide: v2.0 → v2.1

## ✅ Good News: No Breaking Changes!

Arborix v2.1 is **100% backward compatible** with v2.0. Your existing code will continue to work without any changes.

However, v2.1 introduces several improvements that can **dramatically simplify** your code if you choose to adopt them.

---

## 🚀 Quick Wins - Simple Migrations

### 1. Replace Manual Recursion with Tree.Auto

**Difficulty:** ⭐ Easy
**Time:** 2 minutes
**Impact:** 🌟🌟🌟🌟🌟 Huge code reduction

#### Before (v2.0):
```tsx
// 30+ lines of recursive component
function RenderNode({ nodeId }: { nodeId: TreeNodeId }) {
  const tree = useTree();
  const node = tree.findNode(tree.state.data, nodeId);
  if (!node) return null;

  const isOpen = tree.state.openIds.has(nodeId);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <Tree.Item nodeId={nodeId}>
      {(state) => (
        <div style={{ paddingLeft: `${state.depth * 20}px` }}>
          {hasChildren && (
            <Tree.Trigger nodeId={nodeId}>
              {({ isOpen }) => <span>{isOpen ? '▼' : '▶'}</span>}
            </Tree.Trigger>
          )}
          <Tree.Checkbox nodeId={nodeId}>
            {({ isChecked, isPartiallyChecked }) => (
              <input type="checkbox" checked={isChecked} readOnly />
            )}
          </Tree.Checkbox>
          <Tree.Label nodeId={nodeId} editable />
        </div>
      )}
    </Tree.Item>

    {/* RECURSION */}
    {isOpen && hasChildren && (
      <>
        {node.children.map(child => (
          <RenderNode key={child.id} nodeId={child.id} />
        ))}
      </>
    )}
  );
}

// Usage
<Tree.Root data={data} onDataChange={setData}>
  <Tree.List>
    {data.map(node => (
      <RenderNode key={node.id} nodeId={node.id} />
    ))}
  </Tree.List>
</Tree.Root>
```

#### After (v2.1):
```tsx
// 3 lines!
<Tree.Root data={data} onDataChange={setData}>
  <Tree.Auto showCheckbox editable />
</Tree.Root>
```

**Savings:** ~30 lines → 3 lines (90% reduction)

---

### 2. Remove Repeated nodeId with ItemContext

**Difficulty:** ⭐ Easy
**Time:** 1 minute
**Impact:** 🌟🌟🌟 Less code, cleaner API

#### Before (v2.0):
```tsx
<Tree.Item nodeId={nodeId}>
  <Tree.Trigger nodeId={nodeId} />      {/* Repeated */}
  <Tree.Checkbox nodeId={nodeId} />     {/* Repeated */}
  <Tree.Label nodeId={nodeId} />        {/* Repeated */}
  <Tree.Content nodeId={nodeId} />      {/* Repeated */}
</Tree.Item>
```

#### After (v2.1):
```tsx
<Tree.Item nodeId={nodeId}>
  <Tree.Trigger />      {/* Gets from context */}
  <Tree.Checkbox />     {/* Gets from context */}
  <Tree.Label />        {/* Gets from context */}
  <Tree.Content />      {/* Gets from context */}
</Tree.Item>
```

**Savings:** 4 less props to pass per item

---

### 3. Use TreeRecipes Instead of Custom Utils

**Difficulty:** ⭐ Easy
**Time:** 5 minutes
**Impact:** 🌟🌟🌟🌟 Delete custom utility code

#### Before (v2.0):
```tsx
// You probably wrote something like this:
function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  // 20+ lines of recursive filtering logic
  // ...
}

function countNodes(nodes: TreeNode[]): number {
  // 10+ lines of counting logic
  // ...
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  // 15+ lines of sorting logic
  // ...
}
```

#### After (v2.1):
```tsx
import { TreeRecipes } from 'arborix';

// Just use the built-in utilities!
const filtered = TreeRecipes.filterTree(data, query);
const count = TreeRecipes.countNodes(data);
const sorted = TreeRecipes.sortByLabel(data);
```

**Savings:** Delete 50+ lines of custom utility code

---

### 4. Use useTreeHelpers for Common Operations

**Difficulty:** ⭐ Easy
**Time:** 3 minutes
**Impact:** 🌟🌟🌟 Simpler component logic

#### Before (v2.0):
```tsx
function Toolbar() {
  const tree = useTree();

  const handleAddFolder = () => {
    const id = tree.addNode(null, 'New Folder');
    tree.updateNode(id, { children: [] });
    setTimeout(() => tree.startEditing(id), 0);
  };

  const handleDeleteSelected = () => {
    const ids = Array.from(tree.state.selectedIds);
    ids.forEach(id => tree.deleteNode(id));
    tree.clearSelection();
    tree.commit();
  };

  // More complex operations...
}
```

#### After (v2.1):
```tsx
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
    </>
  );
}
```

**Savings:** 50% less code in toolbar/action components

---

### 5. Use SimpleTree for Quick Setups

**Difficulty:** ⭐ Easiest!
**Time:** 30 seconds
**Impact:** 🌟🌟🌟🌟🌟 Perfect for demos/prototypes

#### Before (v2.0):
```tsx
<Tree.Root
  data={data}
  onDataChange={setData}
  enableDragDrop
  enableVirtualization
  rowHeight={32}
  persistenceKey="my-tree"
>
  <Tree.List>
    {data.map(node => (
      <RenderNode key={node.id} nodeId={node.id} />
    ))}
  </Tree.List>
</Tree.Root>
```

#### After (v2.1):
```tsx
import { SimpleTree } from 'arborix';

<SimpleTree
  data={data}
  onDataChange={setData}
  showCheckboxes
  editable
  enableDragDrop
/>
```

**Savings:** Perfect for quick starts and demos

---

## 🎯 Migration Strategy

### Option 1: Gradual (Recommended)

1. **Install v2.1** (no code changes needed)
2. **New components:** Use `Tree.Auto` or `SimpleTree`
3. **Existing components:** Keep as-is, migrate when you touch them
4. **Add helpers:** Start using `useTreeHelpers` and `TreeRecipes` for new features

### Option 2: All-in

1. Replace all recursive components with `Tree.Auto`
2. Remove all redundant `nodeId` props
3. Replace custom utils with `TreeRecipes`
4. Use `useTreeHelpers` everywhere

---

## 📋 Checklist

Use this checklist to track your migration:

### Components
- [ ] Replace manual recursion with `Tree.Auto` (or `SimpleTree`)
- [ ] Remove redundant `nodeId` props from child components
- [ ] Update `Tree.List` to use `visibleNodes` render prop

### Utils & Helpers
- [ ] Replace custom filter logic with `TreeRecipes.filterTree()`
- [ ] Replace custom sort logic with `TreeRecipes.sortByLabel()`
- [ ] Replace custom utilities with `TreeRecipes` equivalents
- [ ] Use `useTreeHelpers()` for common operations

### Code Cleanup
- [ ] Delete unused recursive component code
- [ ] Delete custom utility functions (now in TreeRecipes)
- [ ] Simplify toolbar/action components with helpers

---

## ❓ FAQs

### Q: Will my v2.0 code break?
**A:** No! v2.1 is 100% backward compatible.

### Q: Do I need to migrate?
**A:** No, but it's recommended for cleaner code and better DX.

### Q: Can I mix v2.0 and v2.1 patterns?
**A:** Yes! They work together seamlessly.

### Q: What if I have custom rendering?
**A:** Use `Tree.Auto` with custom `renderItem` prop:

```tsx
<Tree.Auto
  renderItem={(nodeId, state) => (
    // Your custom rendering here
    <div className={state.isSelected ? 'selected' : ''}>
      {state.node.label}
    </div>
  )}
/>
```

### Q: What if ItemContext doesn't work for my use case?
**A:** Just pass `nodeId` explicitly - it takes priority over context:

```tsx
<Tree.Item nodeId={itemId}>
  <Tree.Trigger nodeId={customId} />  {/* Explicit nodeId */}
</Tree.Item>
```

---

## 🆘 Need Help?

- Check examples in `examples/v2-simplified/`
- Read full documentation: [Link to docs]
- Open an issue: https://github.com/wesleyxmns/arborix/issues

---

## 🎉 Benefits Summary

After migrating to v2.1 patterns:

✅ **90% less boilerplate** code
✅ **Easier to understand** for new developers
✅ **Fewer bugs** (less code = less bugs)
✅ **Faster development** (helpers do the work)
✅ **Better DX** (Developer Experience)

**Estimated migration time for typical project:** 30 minutes - 2 hours

**ROI:** Significant long-term code maintainability improvement
