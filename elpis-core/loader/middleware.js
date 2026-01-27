const glob = require("glob")
const path = require("path")

const { sep } = path
/*
 * 加载中间件
 * @param {object} app 应用实例
 *
 * 加载所有middleware, 可通过 'app.middleware.${目录}.&{文件}' 访问
 * 
    例子：
      app/middleware/
        |
        | -- custom-moudle
              |
              | -- custom-middleware.js
    => app.middleware.customModule.customMiddleware
 */
module.exports = (app) => {
  // 读取 app/middleware/**/**.js 目录下的所有文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
  const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}*.js`))

  // 遍历所有文件, 把内容加载到 app.middleware上
  const middlewares = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)
    // 截取路径 app/middleware/custom-module/custom-middleware.js =>custom-module/custom-middleware.js
    name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf("."))
    // 把 '-' 统一改为驼峰命名，例如：customMiddleware.js => customMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
    // 挂载 中间件到 app.middleware 上
    let tempMiddleware = middlewares
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      if (i === len - 1) {
        tempMiddleware[names[i]] = require(path.resolve(file))(app)
      } else {
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {}
        }
        // 递归到下一级
        tempMiddleware = tempMiddleware[names[i]]
      }
    }
  })
  // 把 middlewares 挂载 app.middleware
  app.middlewares = middlewares
}
