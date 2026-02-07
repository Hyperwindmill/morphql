import { defineConfig } from "vitepress";
import morphqlGrammar from "../../packages/vscode-extension/syntaxes/morphql.tmLanguage.json";

export default defineConfig({
  base: "/morphql/",
  title: "MorphQL",
  description:
    "A high-performance engine that compiles transformation queries into optimized JavaScript functions.",
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  sitemap: {
    hostname: "https://hyperwindmill.github.io/morphql/",
  },
  markdown: {
    languages: [
      {
        ...morphqlGrammar,
        id: "MorphQL",
        name: "MorphQL",
        aliases: ["morphql"],
      } as any,
    ],
  },
  themeConfig: {
    logo: "/logo.png",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/guide/language-reference" },
      { text: "Playground", link: "/playground/", target: "_blank" },
      { text: "GitHub", link: "https://github.com/Hyperwindmill/morphql" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Why MorphQL?", link: "/guide/why-morphql" },
        ],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Library (Core)", link: "/guide/library" },
          { text: "Language Reference", link: "/guide/language-reference" },
          { text: "Adapters", link: "/guide/adapters" },
          { text: "EDIFACT Adapter", link: "/guide/edifact" },
          { text: "TypeScript Support", link: "/guide/typescript" },
        ],
      },
      {
        text: "Guides",
        items: [
          {
            text: "Working with Positional Text",
            link: "/guide/positional-text",
          },
          {
            text: "EDIFACT Mapping",
            link: "/guide/edifact-mapping",
          },
        ],
      },

      {
        text: "Tools",
        items: [
          { text: "CLI", link: "/guide/cli" },
          { text: "Server", link: "/guide/server" },
          { text: "IDE Extensions", link: "/guide/ide-extensions" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Hyperwindmill/morphql" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026",
    },
  },
});
