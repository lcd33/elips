// 引入 Koa 模块
const Koa = require("koa")
const path = require("path")
const { sep } = path // 路径分隔符 兼容不同操作系统

const env = require("./env")

const middlewareLoader = require("./loader/middleware")
const routerLoader = require("./loader/router")
const controllerLoader = require("./loader/controller")
const serviceLoader = require("./loader/service")
const extendLoader = require("./loader/extend")
const configLoader = require("./loader/config")
const routerSchemaLoader = require("./loader/router.schema")
// 创建 Koa 应用实例

module.exports = {
  /**
   * 启动 Koa 应用服务器
   * @param options 服务器配置选项
      name: "Elips", // 应用名称
      homePage: "/", // 应用首页路径
   */
  start: (options = {}) => {
    const app = new Koa()
    // 项目配置
    app.options = options

    // 基础路径
    app.baseDir = process.cwd() // 当前工作目录
    console.log(app.baseDir)
    // 业务路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`)
    console.log(app.businessPath)
    // 初始化环境配置
    app.env = env(app)
    console.log(`--[start] env: ${app.env.get()} --`)

    // 加载中间件
    middlewareLoader(app)
    console.log(app.middlewares)
    console.log(`--[start] middleware loaded --`)
    // 加载路由 schema
    routerSchemaLoader(app)
    console.log(app.routerSchema)
    console.log(`--[start] router schema loaded --`)
    // 加载控制器
    controllerLoader(app)
    console.log(app.controller)
    console.log(`--[start] controller loaded --`)
    // 加载配置
    configLoader(app)
    console.log(app.config)
    console.log(`--[start] config loaded --`)
    // 加载服务
    serviceLoader(app)
    console.log(app.service)
    console.log(`--[start] service loaded --`)
    // 加载扩展
    extendLoader(app)
    console.log(app)
    console.log(`--[start] extend loaded --`)
    // 注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app)
      console.log(`--[start] Appmiddleware loaded --`)
    } catch (error) {
      console.error("[exception] Error loading middleware:")
    }
    // 加载路由
    routerLoader(app)
    console.log(`--[start] router loaded --`)

    try {
      const port = process.env.PORT || 8080
      const host = process.env.HOST || "0.0.0.0"
      // 监听指定端口和主机
      app.listen(port, host, () => {
        console.log(`Server running at http://localhost:${port}`)
      })
    } catch (error) {
      console.error("Error starting server:", error)
    }
  }
}
