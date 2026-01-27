const glob = require("glob")
const path = require("path")

const { sep } = path
/*
 * 加载中间件
 * @param {object} app 应用实例
 *
 * 加载所有controller, 可通过 'app.controller.${目录}.&{文件}' 访问
 * 
    例子：
      app/controller/
        |
        | -- custom-moudle
              |
              | -- custom-controller.js
    => app.controller.customModule.customMiddleware
 */
module.exports = (app) => {
  // 读取 app/controller/**/**.js 目录下的所有文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`)
  const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}*.js`))

  // 遍历所有文件, 把内容加载到 app.middleware上
  const controller = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)
    // 截取路径 app/controller/custom-module/custom-controller.js =>custom-module/custom-controller.js
    name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf("."))
    // 把 '-' 统一改为驼峰命名，例如：customController.js => customController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
    // 挂载 控制器到 app.controller 上
    let tempController = controller
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app)
        tempController[names[i]] = new ControllerModule()
      } else {
        if (!tempController[names[i]]) {
          tempController[names[i]] = {}
        }
        // 递归到下一级
        tempController = tempController[names[i]]
      }
    }
  })
  // 把 controllers 挂载 app.controllers

  app.controller = controller
}
