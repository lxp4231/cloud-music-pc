module.exports = {
  configureWebpack: {
    resolve: {
      // 别名
      alias: {
        components: "@/components",
        content: "@/components/content",
        common: "@/components/common",
        assets: "@/assets",
        views: "@/views",
      },
    },
  },
  devServer: {
    open: "true",
    port: 8080
  },
  // outputDir:"/cloud-music",
  // publicPath:"/dist"
}
