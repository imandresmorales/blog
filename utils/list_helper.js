const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    const suma = (sum, blog) => {
      return sum + blog.likes
    }
    return blogs.reduce(suma, 0)
  }
  
  module.exports = {
    dummy, totalLikes
  }