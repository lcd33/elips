// 引入 Koa 模块
const Koa = require("koa")

// 创建 Koa 应用实例
const app = new Koa()

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
