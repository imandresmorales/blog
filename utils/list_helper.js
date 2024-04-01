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
    let mayor = 0
    let objeto ={}
    for(let i=0; i<blogs.length; i++){
      if(blogs[i].likes >= mayor){
        mayor = blogs[i].likes
        objeto = {"title": blogs[i].title, "author":blogs[i].author, "likes":blogs[i].likes}
      }
    }
    return objeto
  }
  
  module.exports = {
    dummy, totalLikes, favoriteBlog
  }