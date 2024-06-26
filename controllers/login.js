const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const express = require('express');
const Blog = require('../models/blog')
const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

loginRouter.post('/', async (request, response) => {
  
  const { username, password } = request.body
  // console.log(request.body)
  const user = await User.findOne({ username })
  // console.log(user)
  
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  // console.log(passwordCorrect)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter