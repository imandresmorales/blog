const supertest = require("supertest");
const mongoose = require('mongoose')
const app = require('../app');
const Blog = require('../models/blog');
mongoose.set("bufferTimeoutMS", 30000)
const User = require('../models/user')
const Login = require('../controllers/login')
const { agent } = require("supertest");
const api = supertest(app)

const initialUsers = [
    {
        user: "user1",
        username: "user1",
        password: "user1"
    },
    {
        user: "user2",
        username: "user2",
        password: "user2"
    }
]

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
    await User.deleteMany({})
    await Blog.deleteMany({})

    const user = await api
        .post('/api/users')
        .send(initialUsers[0])

    const loginResponse = await api
        .post('/api/login')
        .send({username: initialUsers[0].username, password: initialUsers[0].password })
        
    const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send(initialBlogs[0])
    
    const user2 = await api
                .post('/api/users')
                .send(initialUsers[1])
            
    const loginResponse2 = await api
                .post('/api/login')
                .send({username: initialUsers[1].username, password: initialUsers[1].password })
                
    const response2 = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${loginResponse2.body.token}`)
                .send(initialBlogs[1])
},10000)

test("delete a single blog post resource", async () => {
    const user = await User.find({username: initialUsers[0].username})
    const blogs = await Blog.find({})
    const blog = blogs[0]

    const loginResponse = await api
    .post('/api/login')
    .send({username: "user1", password: "user1" })
    
    const response = await api
        .delete(`/api/blogs/${blog.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
  
    expect(204).toEqual(response.status)
    
},40000)

test("solicitud HTTP GET a la URL /api/blogs", async () => {
      const response = await api
        .get('/api/blogs/')
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
    const loginResponse = await api
    .post('/api/login')
    .send({username: "user1", password: "user1" })

    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 2
      }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const autores = response.body.map(blog => blog.author)
    expect(autores).toContain("Author 3")
})

test("4.23 adición de un blog falla con el código de estado adecuado 401 Unauthorized si no se proporciona un token", async () => {
    
    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
        likes: 2
      }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
    // const autores = response.body.map(blog => blog.author)
    // expect(autores).toContain("Author 3")
},30000)

test("propiedad likes falta en la solicitud", async () => {
    const loginResponse = await api
    .post('/api/login')
    .send({username: "user1", password: "user1" })

    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
        url: "http://blog3.com",
      }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length +1)
},30000)

test("faltan las propiedades title o url ", async () => {
    const loginResponse = await api
    .post('/api/login')
    .send({username: "user1", password: "user1" })

    const newBlog = {
        title: "Blog 3",
        author: "Author 3",
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(400)
})

test("actualizar la información de una publicación de blog", async () => {
    const blogsx = await Blog.find({})
    // console.log(blogsx)
    const user2 = await User.find({})
    // console.log(user2[1].id)
    const initialStatus = await api.get('/api/blogs')
    const blogs =  initialStatus.body
    const blog ={
        title: "Blog 2",
        author: "Author 2",
        url: "http://blog2.com",
        likes: 0
      }
    const id = blogs.filter(b => b.title === "Blog 2")[0].id
    // console.log(id)
    const update = await api
        .put(`/api/blogs/${id}`)
        .send(blog)
    expect(update.body).toEqual({...blog, id: id, user: user2[1].id})
},200000)

afterAll(() => {
    mongoose.connection.close()
})