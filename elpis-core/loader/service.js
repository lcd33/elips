const glob = require("glob")
const path = require("path")

const { sep } = path
/*
 * 加载中间件
 * @param {object} app 应用实例
 *
 * 加载所有service, 可通过 'app.service.${目录}.&{文件}' 访问
 * 
    例子：
      app/service/
        |
        | -- custom-moudle
              |
              | -- custom-service.js
    => app.service.customModule.customService
 */
module.exports = (app) => {
  // 读取 app/controller/**/**.js 目录下的所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`)
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}*.js`))

  // 遍历所有文件, 把内容加载到 app.service上
  const service = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)
    // 截取路径 app/service/custom-module/custom-service.js =>custom-module/custom-service.js
    name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf("."))
    // 把 '-' 统一改为驼峰命名，例如：customService.js => customService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())
    // 挂载 服务到 app.service 上
    let tempService = service
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; i++) {
      if (i === len - 1) {
        const ServiceModule = require(path.resolve(file))(app)
        tempService[names[i]] = new ServiceModule()
      } else {
        if (!tempService[names[i]]) {
          tempService[names[i]] = {}
        }
        // 递归到下一级
        tempService = tempService[names[i]]
      }
    }
  })
  // 把 controllers 挂载 app.controllers
  app.service = service
}
