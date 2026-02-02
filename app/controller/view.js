module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染模板
     * @param {*} ctx 上下文

     */

    async renderPage(ctx) {
      await ctx.render(`output/entry.${ctx.params.page}`, {
        name: app.name,
        env: app.env.get(),
        options: JSON.stringify(app.options)
      })
    }
  }
}
