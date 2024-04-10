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
    const prueba = autoresUnicos.map(author => {
      if(autoresFiltrados[author] > maximo){
        maximo = autoresFiltrados[author]
        return {"author": author, "blogs": maximo}
      }
    })
    return  prueba.find(objeto => objeto.blogs === maximo)    
  }

    const mostLikes = (blogs) => {
      const lodash = require('lodash')
      const authorsWithLikes = blogs.map(blog => {return {"author":blog.author, "likes": blog.likes}})
      const unicos = lodash.uniqBy(authorsWithLikes,'author').map(objeto => {return {"author":objeto.author,"likes":0}})
      for(autor of unicos){
        for(object of authorsWithLikes){
          if(autor.author.localeCompare(object.author) ===0){
            autor.likes+=object.likes
          }
        }
      }
      return lodash(unicos).maxBy('likes')
    }

  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }