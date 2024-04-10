const supertest = require("supertest");
const mongoose = require('mongoose')
const app = require('../app');
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
      title: "Blog 1",
      author: "Author 1",
      url: "http://blog1.com",
      likes: 10
    },
    {
      title: "Blog 2",
      author: "Author 2",
      url: "http://blog2.com",
      likes: 20
    }
  ]
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})
test("solicitud HTTP GET a la URL /api/blogs", async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
})

test("verifique que la propiedad de identificador único", async () => {
    const response = await api
        .get('/api/blogs')
        
    expect(response.body[0].id).toBeDefined()
})

afterAll(() => {
    mongoose.connection.close()
})