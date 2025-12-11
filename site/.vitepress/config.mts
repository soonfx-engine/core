import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SoonFx",
  description: "The TypeScript-first numeric engine for games.",
  appearance: 'dark', // Force dark mode to match examples style
  outDir: '../docs',
  
  vite: {
    build: { 
    }
  },

  themeConfig: {
    logo: '/logo.svg', // Assuming we'll have one
    socialLinks: [
      { icon: 'github', link: 'https://github.com/soonfx-engine/core' }
    ],
    
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025-present SoonFx Team'
    }
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'SoonFx',
      description: 'The TypeScript-first numeric engine for games.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API', link: '/api/core' },
          { text: 'Examples', link: 'https://soonfx.dev/examples' }
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'What is SoonFx?', link: '/guide/what-is-soonfx' },
              { text: 'Getting Started', link: '/guide/getting-started' }
            ]
          },
          {
            text: 'Core Concepts',
            items: [
              { text: 'Visual Editor', link: '/guide/visual-editor' }
            ]
          }
        ]
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'SoonFx',
      description: 'TypeScript 优先的游戏数值引擎',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: 'API', link: '/zh/api/core' },
          { text: '示例', link: 'https://soonfx.dev/examples' }
        ],
        sidebar: [
          {
            text: '介绍',
            items: [
              { text: '什么是 SoonFx?', link: '/zh/guide/what-is-soonfx' },
              { text: '快速开始', link: '/zh/guide/getting-started' }
            ]
          },
          {
            text: '核心概念',
            items: [
              { text: '可视化编辑器', link: '/zh/guide/visual-editor' }
            ]
          }
        ],
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '页面导航'
        },
        lastUpdated: {
          text: '最后更新于'
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '深色模式'
      }
    }
  }
})

