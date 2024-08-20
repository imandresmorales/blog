const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.info('Error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/', blogsRouter)//la agregue para que se pueda acceder a la pagina principal sin /api/blogs
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app