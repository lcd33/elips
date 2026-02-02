const path = require("path")

module.exports = (app) => {
  //配置静态根目录
  const koaStatic = require("koa-static")
  app.use(koaStatic(path.resolve(process.cwd(), "./app/public")))
  // 模板引擎渲染
  const koaNunjucks = require("koa-nunjucks-2")
  app.use(
    koaNunjucks({
      ext: "html",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        trimBlocks: true, // 开启自动删除模板中多余的空格
        noCache: true // 禁用缓存
      }
    })
  )
}
