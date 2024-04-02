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
  
  module.exports = {
    dummy, totalLikes, favoriteBlog
  }