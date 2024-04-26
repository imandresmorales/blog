const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')
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
    if(!body.title || !body.url){
      return response.status(400).end()
    }
    const users = await helper.usersInDb()
    const userID = users[0].id
    const user = await User.findById(userID)
    
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

  blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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