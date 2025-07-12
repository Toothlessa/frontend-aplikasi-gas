const path = require('path');

module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {},
  },
  devServer: {
    watchFiles: [path.resolve(__dirname, 'src')],
  },
};