const mongoose = require('mongoose')

const connectMongo = async () => {
  const { DB_HOST } = process.env

  if (!DB_HOST) {
    throw new Error('DB_HOST environment variable is not set')
  }

  // Use Mongoose as the single entry point for MongoDB connectivity.
  await mongoose.connect(DB_HOST)
}

module.exports = connectMongo
