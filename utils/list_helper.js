const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    const suma = (sum, blog) => {
      return sum + blog.likes
    }
    return blogs.reduce(suma, 0)
  }
  
  const favoriteBlog = (blogs) => {
    const mayor = (mayr, blog) => {
      return blog.likes >= mayr.likes 
                ? {"author": blog.author, "likes": blog.likes, "title": blog.title}
                : mayr
    }
    return blogs.reduce(mayor, {"likes": 0})
  }

  const mostBlogs  = (blogs) => {
    const lodash = require('lodash')
    const autores = blogs.map(blog => blog.author)
    const autoresUnicos = lodash.uniq(autores)
    const autoresFiltrados = lodash.countBy(autores)
    let maximo =-1
    let objeto = {}
    for(autor of autoresUnicos){
      console.log(autoresFiltrados[autor] )
      if(autoresFiltrados[autor] > maximo){
        maximo = autoresFiltrados[autor]
        objeto = {"author": autor, "blogs": maximo}
      }
    }
    return  objeto
  }
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
  }