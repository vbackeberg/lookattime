module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: {
      '^/api': {
        target: "http://127.0.0.1:7071",
        changeOrigin: true
      }
    },
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use "~@/colors.scss";
          @import "~@/styles/variables.scss";
        `
      }
    }
  }
};
