module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: "http://localhost:7071"
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "~@/colors.scss";`
      }
    }
  }
};
