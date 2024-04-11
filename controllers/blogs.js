const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

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
    // console.log(request.params.id) 
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  })

    module.exports = blogsRouter