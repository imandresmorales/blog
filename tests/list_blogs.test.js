const supertest = require("supertest");
const mongoose = require('mongoose')
const app = require('../app');
const Blog = require('../models/blog');
const { update } = require("lodash");
mongoose.set("bufferTimeoutMS", 30000)

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

test("delete a single blog post resource", async () => {
    const initialStatus = await api.get('/api/blogs')
    const blog =  initialStatus.body[0]
    await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204)

    const finalStatus = await api.get('/api/blogs')
    expect(finalStatus.body).toHaveLength(initialStatus.body.length - 1)

    const titles =finalStatus.body.map(b => b.title)
    expect(titles).not.toContain(blog.title)
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

test("actualizar la información de una publicación de blog", async () => {
    const initialStatus = await api.get('/api/blogs')
    const blogs =  initialStatus.body
    const blog ={
        title: "Blog 2",
        author: "Author 2",
        url: "http://blog2.com",
        likes: 0
      }
    const id = blogs.filter(b => b.title === "Blog 2")[0].id
    const update = await api
        .put(`/api/blogs/${id}`)
        .send(blog)
    expect(update.body).toEqual({...blog, id: id})
})

afterAll(() => {
    mongoose.connection.close()
})