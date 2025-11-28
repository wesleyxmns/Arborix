import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Arborix',
  description: 'Modern, Headless Tree Component for React',
  base: '/Arborix/',
  ignoreDeadLinks: true, // Ignore dead links for now (pages will be added later)

  appearance: true, // Enable light mode - premium white interface

  themeConfig: {
    logo: {
      light: '/ARBORIX_LOGO.png',
      dark: '/ARBORIX_LOGO.png',
      alt: 'Arborix Logo'
    },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/tree-root' },
      { text: 'Examples', link: '/examples/basic' },
      {
        text: 'v2.1.1',
        items: [
          { text: "What's New in v2.1", link: '/guide/whats-new-v21' },
          { text: 'Changelog', link: 'https://github.com/wesleyxmns/Arborix/releases' },
          { text: 'Migration from v2.0', link: '/migration' }
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
            { text: 'Installation', link: '/guide/installation' },
            { text: "What's New in v2.1 🆕", link: '/guide/whats-new-v21' }
          ]
        },
        {
          text: 'Quick Start (v2.1)',
          items: [
            { text: 'SimpleTree - Zero Config', link: '/guide/simple-tree' },
            { text: 'Tree.Auto - Auto Rendering', link: '/guide/tree-auto' },
            { text: 'Traditional Approach', link: '/guide/traditional-approach' }
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
          text: 'v2.1 Features',
          items: [
            { text: 'TreeRecipes Utilities', link: '/guide/tree-recipes' },
            { text: 'useTreeHelpers Hook', link: '/guide/use-tree-helpers' },
            { text: 'ItemContext', link: '/guide/item-context' }
          ]
        },
        {
          text: 'Advanced Features',
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
          text: 'Presets (v2.1)',
          items: [
            { text: 'SimpleTree', link: '/api/simple-tree' },
            { text: 'Tree.Auto', link: '/api/tree-auto' }
          ]
        },
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
            { text: 'useTreeHelpers (v2.1)', link: '/api/use-tree-helpers' },
            { text: 'useTreeKeyboardNavigation', link: '/api/use-tree-keyboard-navigation' },
            { text: 'useContextMenu', link: '/api/use-context-menu' },
            { text: 'useItemContext (v2.1)', link: '/api/use-item-context' }
          ]
        },
        {
          text: 'Utilities (v2.1)',
          items: [
            { text: 'TreeRecipes', link: '/api/tree-recipes' }
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
          text: 'Quick Start (v2.1)',
          items: [
            { text: 'SimpleTree Example', link: '/examples/simple-tree' },
            { text: 'Tree.Auto Example', link: '/examples/tree-auto-example' }
          ]
        },
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
            { text: 'Virtualization', link: '/examples/virtualization' }
          ]
        },
        {
          text: 'Real-World Examples',
          items: [
            { text: 'File Explorer', link: '/examples/file-explorer' },
            { text: 'Email Client Sidebar', link: '/examples/email-client' },
            { text: 'Organization Chart', link: '/examples/organization-chart' },
            { text: 'Task Manager', link: '/examples/task-manager' }
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
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Arborix' }],
    ['meta', { name: 'og:image', content: 'https://wesleyxmns.github.io/Arborix/assets/ARBORIX_LOGO.png' }]
  ]
})
