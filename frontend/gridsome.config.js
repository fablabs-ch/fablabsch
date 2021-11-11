// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const path = require("path");

module.exports = {
  siteName: 'Swiss FabLabs',
  templates: {
    Space: '/space/:id'
  },
  chainWebpack: config => {
    config.resolve.alias.set('@content', path.resolve('./content/'))
  },
  plugins: [
    {
      use: '@gridsome/vue-remark',
      options: {
        typeName: 'MdPage',
        baseDir: './content/pages',
        template: './src/templates/MdPage.vue',
      }
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-XXXXXXXXX-X'
      }
    }
  ]
}
