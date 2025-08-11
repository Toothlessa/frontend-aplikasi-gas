const path = require('path');

module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {},
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "My Poing of Sales";
        return args;
      });
  }
};