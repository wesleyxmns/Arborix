# TreeData

Type definition for tree data structure.

## Definition

```tsx
type TreeData = TreeNode[];
```

## Description

`TreeData` is an array of root-level tree nodes. This is the main data structure passed to `Tree.Root`.

## Example

```tsx
import type { TreeData } from 'arborix';

const data: TreeData = [
  {
    id: '1',
    label: 'Documents',
    children: [
      { id: '1-1', label: 'Resume.pdf' },
      { id: '1-2', label: 'Cover Letter.docx' }
    ]
  },
  {
    id: '2',
    label: 'Photos',
    children: [
      { id: '2-1', label: 'Vacation.jpg' }
    ]
  },
  { id: '3', label: 'Notes.txt' }
];

function MyTree() {
  const [treeData, setTreeData] = useState<TreeData>(data);
  
  return (
    <Tree.Root data={treeData} onDataChange={setTreeData}>
      {/* ... */}
    </Tree.Root>
  );
}
```

## Usage with Tree.Root

```tsx
<Tree.Root 
  data={data}           // TreeData
  onDataChange={setData} // (data: TreeData) => void
>
  {/* tree content */}
</Tree.Root>
```

## See Also

- [TreeNode](/api/tree-node)
- [Tree.Root](/api/tree-root)
