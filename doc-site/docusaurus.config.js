const prismReactRenderer = require('prism-react-renderer');
const lightCodeTheme = prismReactRenderer.themes.nightOwlLight;
const darkCodeTheme = prismReactRenderer.themes.nightOwl;

/**
 * @type {@import('@docusaurus/types').PluginModule}
 */
const addWebpackFallbacks = (context, options) => {
  return {
    name: 'custom-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            url: require.resolve('url/'),
          },
        },
      };
    },
  };
};

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Intercode',
  tagline: 'A one-stop web app for conventions',
  url: 'https://intercode.interactiveliterature.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/neilSquare.png',
  organizationName: 'neinteractiveliterature', // Usually your GitHub org/user name.
  projectName: 'intercode', // Usually your repo name.
  plugins: [
    addWebpackFallbacks,
    require.resolve('@docusaurus/plugin-ideal-image'),
    [
      require.resolve('@graphql-markdown/docusaurus'),
      {
        schema: '../schema.graphql',
        rootPath: './docs', // docs will be generated under './docs/graphql' (rootPath/baseURL)
        baseURL: 'graphql',
        linkRoot: '/docs',
        homepage: './graphql-homepage.md',
        loaders: {
          GraphQLFileLoader: require.resolve('@graphql-tools/graphql-file-loader'),
        },
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/neinteractiveliterature/intercode/edit/main/doc-site/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Intercode',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'doc',
            docId: 'graphql/schema',
            position: 'left',
            label: 'GraphQL Reference',
          },
          {
            type: 'doc',
            docId: 'liquid/intro',
            position: 'left',
            label: 'Liquid Reference',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/neinteractiveliterature/intercode',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'GraphQL Schema Reference',
                to: '/docs/graphql',
              },
              {
                label: 'Liquid Reference',
                to: '/docs/liquid',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'NEIL Hosting',
                href: 'https://www.neilhosting.net',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/neinteractiveliterature/intercode',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} New England Interactive Literature. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        // I tried a lot to get this to work and I still can't :'(
        // additionalLanguages: ['ruby', 'liquid', 'erb'],
      },
      algolia: {
        appId: 'S6GLWS6G10',
        apiKey: '721c7470499a967fdab9cdd803e6713c',
        indexName: 'intercode',
      },
    }),
};
