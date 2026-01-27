const glob = require("glob")
const path = require("path")

const { sep } = path

/**
 * 加载路由
 * @param {object} app 应用实例
 *
 * 通过 'json-schema & ajv' 对API规则进行约束, 配合 api-params-verify 中间件进行使用
 * 
 * app/router-schema/**js
      输出：
      app.routerSchema = {
        '${api1}':${jsonScheme},
        '${api2}':${jsonScheme},
        '${api3}':${jsonScheme},
        '${api4}':${jsonScheme}
      }
 */

module.exports = (app) => {
  // 读取 app/router-schema/**/**.js 目录下的所有文件
  const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`)
  const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}*.js`))

  // 注册所有 routerSchema, 使得app.routerSchema 这样访问
  let routerSchema = {}
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file))
    }
  })
  app.routerSchema = routerSchema
}
