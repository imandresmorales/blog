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

test("solitud HTTP POST a la URL /api/blogs", async () => {
    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 2
      }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const autores = response.body.map(blog => blog.author)
    expect(autores).toContain("Author 3")
})

test("propiedad likes falta en la solicitud", async () => {
    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
      }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length +1)
})

test("faltan las propiedades title o url ", async () => {
    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})