require('dotenv').config()

const app = require('./app')
const connectMongo = require('./config/db')

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await connectMongo()
    console.log('Database connection successful')

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed', error.message)
    process.exit(1)
  }
}

startServer()
