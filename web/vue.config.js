module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: "http://localhost:7071"
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.devtool = "false";
    } else {
      config.devtool = "source-map";
    }
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"]
};
