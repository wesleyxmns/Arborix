import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Arborix',
  description: 'Modern, Headless Tree Component for React',
  base: '/Arborix/',

  themeConfig: {
    logo: '/assets/ARBORIX_LOGO.png',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/tree-root' },
      { text: 'Examples', link: '/examples/basic' },
      {
        text: 'v2.0.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/wesleyxmns/Arborix/releases' },
          { text: 'Migration Guide', link: '/migration' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Arborix?', link: '/guide/what-is-arborix' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Headless Architecture', link: '/guide/headless-architecture' },
            { text: 'Component Structure', link: '/guide/component-structure' },
            { text: 'State Management', link: '/guide/state-management' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Drag and Drop', link: '/guide/drag-and-drop' },
            { text: 'Keyboard Navigation', link: '/guide/keyboard-navigation' },
            { text: 'Custom Action Buttons', link: '/guide/custom-action-buttons' },
            { text: 'Context Menus', link: '/guide/context-menus' },
            { text: 'Virtualization', link: '/guide/virtualization' },
            { text: 'Undo/Redo', link: '/guide/undo-redo' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Components',
          items: [
            { text: 'Tree.Root', link: '/api/tree-root' },
            { text: 'Tree.List', link: '/api/tree-list' },
            { text: 'Tree.Item', link: '/api/tree-item' },
            { text: 'Tree.StyledItem', link: '/api/tree-styled-item' },
            { text: 'Tree.Trigger', link: '/api/tree-trigger' },
            { text: 'Tree.Checkbox', link: '/api/tree-checkbox' },
            { text: 'Tree.Label', link: '/api/tree-label' },
            { text: 'Tree.Content', link: '/api/tree-content' }
          ]
        },
        {
          text: 'Hooks',
          items: [
            { text: 'useTree', link: '/api/use-tree' },
            { text: 'useTreeKeyboardNavigation', link: '/api/use-tree-keyboard-navigation' },
            { text: 'useContextMenu', link: '/api/use-context-menu' }
          ]
        },
        {
          text: 'Types',
          items: [
            { text: 'TreeData', link: '/api/tree-data' },
            { text: 'TreeNode', link: '/api/tree-node' },
            { text: 'CustomActionButton', link: '/api/custom-action-button' },
            { text: 'ContextMenuItem', link: '/api/context-menu-item' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Basic Examples',
          items: [
            { text: 'Basic Tree', link: '/examples/basic' },
            { text: 'With Checkboxes', link: '/examples/checkboxes' },
            { text: 'With Icons', link: '/examples/icons' }
          ]
        },
        {
          text: 'Advanced Examples',
          items: [
            { text: 'Drag and Drop', link: '/examples/drag-drop' },
            { text: 'Custom Buttons', link: '/examples/custom-buttons' },
            { text: 'Context Menus', link: '/examples/context-menus' },
            { text: 'Virtualization', link: '/examples/virtualization' },
            { text: 'File Explorer', link: '/examples/file-explorer' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wesleyxmns/Arborix' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/arborix' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Wesley Ximenes'
    },

    search: {
      provider: 'local'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/Arborix/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Arborix' }],
    ['meta', { name: 'og:image', content: 'https://wesleyxmns.github.io/Arborix/assets/ARBORIX_LOGO.png' }]
  ]
})
