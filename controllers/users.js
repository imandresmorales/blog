const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  if (!password || password.length < 3) {
    return response.status(400).json({ error: `password validation failed: password: ${password} is shorter than the minimum allowed length (3).` })
  }
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async(req, res) => {
    const users = await User.find({})
    res.json(users)
})

module.exports = usersRouter