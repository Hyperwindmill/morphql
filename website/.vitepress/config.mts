import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "MorphQL",
  description: "A high-performance engine that compiles transformation queries into optimized JavaScript functions.",
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/guide/language-reference' },
      { text: 'Playground', link: '/playground/', target: '_blank' },
      { text: 'GitHub', link: 'https://github.com/Hyperwindmill/morphql' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Why MorphQL?', link: '/guide/why-morphql' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Library (Core)', link: '/guide/library' },
          { text: 'Language Reference', link: '/guide/language-reference' }
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: 'CLI', link: '/guide/cli' },
          { text: 'Server', link: '/guide/server' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hyperwindmill/morphql' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026'
    }
  }
})
