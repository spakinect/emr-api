// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'EMR API Documentation',
  favicon: 'img/favicon.ico',

  // This is the domain your site will be deployed to
  url: 'https://spakinect.github.io',
  // This is the base path for your site, typically the repository name
  baseUrl: '/emr-api',
  // GitHub pages deployment configuration
  organizationName: 'spakinect',
  projectName: 'emr',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Docusaurus presets bundle plugins and themes
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // This makes the docs folder the root of your website
          routeBasePath: '/',
          // The sidebar file for your docs
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
    [
      // The Redocusaurus preset to handle OpenAPI specs
      'redocusaurus',
      {
        specs: [{
          // The path to your OpenAPI JSON file
          spec: 'api/emr-openapi.json',
          // The URL where your API docs will be displayed
          route: '/docs',
        },
        {
          spec: 'docs/webhook.md',
          route: '/webhook',
        }
      ],
        theme: {
          // You can customize the color scheme here
          primaryColor: '#4A90E2',
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Overview',
        items: [
          {
            // This is a direct link to the Redocusaurus page
            href: '/docs',
            label: 'API Reference',
            position: 'left',
          },
          {
            // href: '/docs',
            href: '/webhook',
            label: 'Webhook',
            // position: 'left',
          }
        ],
      },
    }),
};

export default config;