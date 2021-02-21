module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: "http://localhost:7071"
  },
  configureWebpack: {
    devtool: "source-map"
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  productionSourceMap: true
};
