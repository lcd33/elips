const path = require("path")
const { sep } = path
/**
 *
 * @param {*} app 应用实例
 *
 * 配置区分 本地/测试/生产 通过env 环境读取不同文件配置 env.config.js
 * 通过 env.config 覆盖 default.config 加载到 app.config 上
 *
 * 目录对应下的 config 配置
 * 例如：
 *  config/
 *    |
 *    | -- config.default.js 默认配置
 *    | -- config.beta.js 测试环境配置
 *    | -- config.prod.js 生产环境配置
 *    | -- config.local.js 本地环境配置
 */

module.exports = (app) => {
  // 找到 config /目录
  const configPath = path.resolve(app.businessPath, `.${sep}config`)
  // 获取 default.config.js 路径
  let defaultConfig = {}
  try {
    defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`))
  } catch (error) {
    console.error("default.config.js 加载失败")
  }

  // 获取 env.config.js 路径
  let envConfig = {}
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`))
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`))
    } else if (app.env.isProduction()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`))
    }
  } catch (error) {
    console.error(`[exception] there is no config file `)
  }
  // 覆盖并且加载
  app.config = Object.assign({}, defaultConfig, envConfig)
}
