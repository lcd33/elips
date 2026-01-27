const KoaRouter = require("koa-router")
const glob = require("glob")
const path = require("path")
const { sep } = path
/**
 *
 * @param {Object} app 应用实例
 *
 * 解析所有 app/router/**.js 目录下的所有文件 加载到KoaRouter 上
 */
module.exports = (app) => {
  // 找到路由文件路径
  const routerPath = path.resolve(app.businessPath, `.${sep}router`)

  // 实例化KoaRouter
  const router = new KoaRouter()
  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}*.js`))
  fileList.forEach((file) => {
    // module.exports = (router, app) => {
    //  router.get("/", (ctx, next) => {
    //    ctx.body = "hello router"
    //  })
    //}
    require(path.resolve(file))(router, app)
  })
  // 路由兜底(健壮性)
  router.get("*", async (ctx, next) => {
    ctx.status = 302 //临时重定向
    ctx.redirect(`${app?.options?.homePage ?? "/"}`)
  })
  // 路由注册到app上
  app.use(router.routes())
  app.use(router.allowedMethods()) // 响应头添加允许的请求方法
}
