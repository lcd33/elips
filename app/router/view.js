module.exports = (app, router) => {
  const { view: ViewController } = app.controller

  // 用户输入 /view/page1 就能渲染 对应的页面
  router.get("/view/:page", ViewController.renderPage.bind(ViewController))
}
