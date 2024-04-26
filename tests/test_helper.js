const User = require('../models/user')
const mongoose = require('mongoose')
mongoose.set("bufferTimeoutMS", 30000)

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  usersInDb
}