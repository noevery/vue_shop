module.exports = {
  //配置别名
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views"
      }
    }
  },
//  配置不同打包入口
//   chainWebpack: config => {
//     //发布模式
//     config.when(process.env.NODE_ENV === 'production', config => {
//       config
//               .entry('app')
//               .clear()
//               .add('./src/main.js')
//     })
//     //开发模式
//     config.when(process.env.NODE_ENV === 'development', config => {
//       config
//               .entry('app')
//               .clear()
//               .add('./src/main-dev.js')
//     })
//   }
}