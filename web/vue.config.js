module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: "http://localhost:7071"
  },
  configureWebpack: config => {
    console.warn(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== "production") {
      config.devtool = "source-map";
    }
  },
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
};
