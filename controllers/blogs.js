const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blog)
})

  blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log(decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if(!body.title || !body.url){
      return response.status(400).end()
    }
       
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const saveBlog = await blog.save()
    // user.blogs = []
    user.blogs =  user.blogs.concat(saveBlog._id)
    await user.save()
    response.status(201).json(saveBlog)
  })

  // blogsRouter.delete('/:id', async (request, response) => {
  //   await Blog.findByIdAndDelete(request.params.id)
  //   response.status(204).end()
  // })
  blogsRouter.delete('/:id', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(401).json({ error: 'blog invalid' })
    }
    if ( blog.user.toString() === user.id.toString() ) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
    else{
      response.status(401).json({ error: 'invalid operation' })
    }
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }
 
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
  })

    module.exports = blogsRouter