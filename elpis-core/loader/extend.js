const glob = require("glob")
const path = require("path")

const { sep } = path
/*
 * 加载中间件
 * @param {object} app 应用实例
 *
 * 加载所有extend, 可通过 'app.extend.&{文件}' 访问
 * 
    例子：
      app/extend/
        |
        | -- custom-extend.js
            
    => app.extend.customExtend
 */
module.exports = (app) => {
  // 读取 app/extend/**.js 目录下的所有文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`)
  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}*.js`))

  // 遍历所有文件, 把内容加载到 app.middleware上
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)
    // 截取路径 app/extend/custom-extend.js =>custom-extend.js
    name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf("."))
    // 把 '-' 统一改为驼峰命名，例如：custom-extend.js => customExtend
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 过滤 app 已经存在的key
    for (const key in app.extend) {
      if (key === name) {
        console.warn(`[warning] extend ${name} is already exists`)
        continue
      }
    }
    // 挂载 控制器到 app.extend 上
    app[name] = require(path.resolve(file))(app)
  })
}
