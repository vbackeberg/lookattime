module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: "http://localhost:7071"
  },
  configureWebpack: {
    devtool: "source-map"
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  productionSourceMap: false
};
