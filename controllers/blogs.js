const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => {
        console.log(error)
      })
  })
  
  blogsRouter.post('/', (request, response) => {
    const body = request.body
    if(!body.title || !body.url){
      return response.status(400).end()
    }
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      }).catch(error => {
        console.log(error)
      })
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