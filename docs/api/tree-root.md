# Tree.Root

The root container component that manages all tree state and provides context to child components.

## Import

```tsx
import { Tree } from 'arborix';

<Tree.Root>
  {/* children */}
</Tree.Root>
```

## Props

### data

- **Type:** `TreeData`
- **Required:** Yes

The tree data structure. An array of tree nodes.

```tsx
const data: TreeData = [
  {
    id: '1',
    label: 'Folder',
    children: [
      { id: '1-1', label: 'File 1' },
      { id: '1-2', label: 'File 2' }
    ]
  },
  { id: '2', label: 'File 3' }
];

<Tree.Root data={data}>
  {/* ... */}
</Tree.Root>
```

### onDataChange

- **Type:** `(data: TreeData) => void`
- **Optional**

Callback fired when the tree data changes (drag & drop, add, delete, etc.).

```tsx
const [data, setData] = useState(initialData);

<Tree.Root 
  data={data} 
  onDataChange={setData}
>
  {/* ... */}
</Tree.Root>
```

### enableDragDrop

- **Type:** `boolean`
- **Default:** `false`

Enable drag and drop functionality.

```tsx
<Tree.Root 
  data={data} 
  enableDragDrop
>
  {/* ... */}
</Tree.Root>
```

### enableVirtualization

- **Type:** `boolean`
- **Default:** `false`

Enable virtualization for large trees.

```tsx
<Tree.Root 
  data={data} 
  enableVirtualization
  height={600}
  rowHeight={32}
>
  {/* ... */}
</Tree.Root>
```

### height

- **Type:** `number`
- **Default:** `600`

Height of the virtualized container (only used when `enableVirtualization` is true).

### rowHeight

- **Type:** `number`
- **Default:** `32`

Height of each row (only used when `enableVirtualization` is true).

### overscan

- **Type:** `number`
- **Default:** `5`

Number of items to render outside the visible area for smooth scrolling.

### persistenceKey

- **Type:** `string`
- **Optional**

Key for persisting tree state to localStorage.

```tsx
<Tree.Root 
  data={data} 
  persistenceKey="my-tree-state"
>
  {/* Tree state (open nodes, selected nodes) will be saved */}
</Tree.Root>
```

### onLoadData

- **Type:** `(node: TreeNode) => Promise<TreeNode[] | void>`
- **Optional**

Async function for lazy loading child nodes.

```tsx
const handleLoadData = async (node: TreeNode) => {
  const children = await fetchChildren(node.id);
  return children;
};

<Tree.Root 
  data={data} 
  onLoadData={handleLoadData}
>
  {/* ... */}
</Tree.Root>
```

### contextMenuOptions

- **Type:** `ContextMenuOptions`
- **Optional**

Configure which built-in context menu items to show.

```tsx
<Tree.Root 
  data={data}
  contextMenuOptions={{
    rename: true,
    duplicate: true,
    delete: true,
    cut: true,
    copy: true,
    paste: true
  }}
>
  {/* ... */}
</Tree.Root>
```

### customContextMenuItems

- **Type:** `(node: TreeNode) => ContextMenuItem[]`
- **Optional**

Add custom items to the context menu.

```tsx
const getCustomItems = (node: TreeNode) => [
  {
    id: 'share',
    label: 'Share',
    icon: <ShareIcon />,
    action: () => shareNode(node)
  }
];

<Tree.Root 
  data={data}
  customContextMenuItems={getCustomItems}
>
  {/* ... */}
</Tree.Root>
```

### onContextMenu

- **Type:** `(e: React.MouseEvent, items: ContextMenuItem[]) => void`
- **Optional**

Callback fired when context menu is triggered.

### customActionButtons

- **Type:** `CustomActionButton[]`
- **Optional**

Add custom action buttons to nodes.

```tsx
const customButtons: CustomActionButton[] = [
  {
    id: 'star',
    icon: <Star size={14} />,
    tooltip: 'Favorite',
    action: (node) => toggleFavorite(node),
    visible: (node) => !node.children
  }
];

<Tree.Root 
  data={data}
  customActionButtons={customButtons}
>
  {/* ... */}
</Tree.Root>
```

### folderIcon

- **Type:** `React.ReactNode`
- **Optional**

Custom icon for folder nodes.

```tsx
<Tree.Root 
  data={data}
  folderIcon={<FolderIcon />}
>
  {/* ... */}
</Tree.Root>
```

### fileIcon

- **Type:** `React.ReactNode`
- **Optional**

Custom icon for file nodes.

```tsx
<Tree.Root 
  data={data}
  fileIcon={<FileIcon />}
>
  {/* ... */}
</Tree.Root>
```

### onAction

- **Type:** `(action: TreeAction) => void`
- **Optional**

Callback fired for all tree actions.

```tsx
const handleAction = (action: TreeAction) => {
  console.log('Action:', action.type, action.nodeId);
};

<Tree.Root 
  data={data}
  onAction={handleAction}
>
  {/* ... */}
</Tree.Root>
```

### aria-label

- **Type:** `string`
- **Optional**

Accessible label for the tree.

```tsx
<Tree.Root 
  data={data}
  aria-label="File explorer"
>
  {/* ... */}
</Tree.Root>
```

## Example

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

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
    <Tree.Root
      data={data}
      onDataChange={setData}
      enableDragDrop
      enableVirtualization
      height={400}
      persistenceKey="file-explorer"
      contextMenuOptions={{
        rename: true,
        delete: true,
        duplicate: true
      }}
      aria-label="File explorer tree"
    >
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map(nodeId => (
            <Tree.StyledItem 
              key={nodeId} 
              nodeId={nodeId}
              showIcon
              showGrip
            >
              {() => (
                <>
                  <Tree.Trigger nodeId={nodeId}>
                    {({ isOpen }) => (
                      <span>{isOpen ? '▼' : '▶'}</span>
                    )}
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

## See Also

- [Tree.List](/api/tree-list)
- [Tree.Item](/api/tree-item)
- [useTree Hook](/api/use-tree)
