const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require("supertest");
const mongoose = require('mongoose')
const app = require('../app');
const helper = require('./test_helper')
mongoose.set("bufferTimeoutMS", 30000)

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length );

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username);
  })
})
afterAll(() => {
    mongoose.connection.close()
})