// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Use Resource Hook",
  tagline: "Easiest way to do API requests.",
  url: "https://use-resource-hook.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "favicon.ico",
  organizationName: "justinekizhak", // Usually your GitHub org/user name.
  projectName: "use-resource-hook", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/justinekizhak/use-resource-hook"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/justinekizhak/use-resource-hook"
        },
        theme: {
          customCss: require.resolve("./src/doc-src/css/docs.css")
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Use Resource Hook",
        // logo: {
        //   alt: "logo",
        //   src: "img/logo.svg"
        // },
        items: [
          {
            type: "doc",
            docId: "index",
            position: "left",
            label: "Docs"
          },
          {
            href: "pathname:///api/index.html",
            label: "API",
            position: "left"
          },
          {
            href: "pathname:///examples/index.html",
            label: "Examples",
            position: "left"
          },
          {
            href: "https://github.com/justinekizhak/use-resource-hook",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Justine Kizhakkinedath`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
