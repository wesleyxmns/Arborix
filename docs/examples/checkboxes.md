# Checkboxes Example

Tree with multi-selection checkboxes.

## Live Demo

```tsx
import { Tree } from 'arborix';
import { useState } from 'react';

function CheckboxTree() {
  const [data, setData] = useState([
    {
      id: '1',
      label: 'Frontend',
      children: [
        { id: '1-1', label: 'React' },
        { id: '1-2', label: 'Vue' },
        { id: '1-3', label: 'Angular' }
      ]
    },
    {
      id: '2',
      label: 'Backend',
      children: [
        { id: '2-1', label: 'Node.js' },
        { id: '2-2', label: 'Python' }
      ]
    }
  ]);

  return (
    <Tree.Root data={data} onDataChange={setData}>
      <Tree.List>
        {({ visibleNodes }) =>
          visibleNodes.map(nodeId => (
            <Tree.StyledItem key={nodeId} nodeId={nodeId}>
              {() => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tree.Trigger nodeId={nodeId}>
                    {({ isOpen }) => <span>{isOpen ? '▼' : '▶'}</span>}
                  </Tree.Trigger>
                  
                  {/* Checkbox Component */}
                  <Tree.Checkbox nodeId={nodeId}>
                    {({ isChecked, isPartiallyChecked, toggle }) => (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        ref={el => el && (el.indeterminate = isPartiallyChecked)}
                        onChange={toggle}
                      />
                    )}
                  </Tree.Checkbox>
                  
                  <Tree.Label nodeId={nodeId} />
                </div>
              )}
            </Tree.StyledItem>
          ))
        }
      </Tree.List>
    </Tree.Root>
  );
}
```

## Logic

The `Tree.Checkbox` component handles the tri-state logic automatically:
- **Checked:** All children are checked.
- **Unchecked:** No children are checked.
- **Indeterminate:** Some children are checked.

Clicking a parent toggles all children. Clicking a child updates the parent's state.

## See Also

- [Tree.Checkbox API](/api/tree-checkbox)
