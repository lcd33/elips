module.exports = (app) => {
  return class ProjectService {
    async getList() {
      return [
        {
          id: 1,
          name: "项目1",
          description: "这是一个项目",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: "项目2",
          description: "这是另一个项目",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  }
}
