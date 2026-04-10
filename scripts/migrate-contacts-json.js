require('dotenv').config()

const fs = require('fs/promises')
const path = require('path')
const mongoose = require('mongoose')

const connectMongo = require('../config/db')
const contactsOperations = require('../models/contacts')

const contactsJsonPath = path.join(__dirname, '..', 'models', 'contacts.json')

const migrateContacts = async () => {
  try {
    await connectMongo()
    console.log('Database connection successful')

    const rawContacts = await fs.readFile(contactsJsonPath, 'utf8')
    const contacts = JSON.parse(rawContacts)

    if (!Array.isArray(contacts) || contacts.length === 0) {
      console.log('No contacts found in JSON file to migrate')
      return
    }

    const existingContacts = await contactsOperations.listContacts()
    const existingKeys = new Set(
      existingContacts.map(contact => `${contact.email}|${contact.phone}`),
    )

    let insertedCount = 0
    let skippedCount = 0

    for (const contact of contacts) {
      const contactKey = `${contact.email}|${contact.phone}`

      if (existingKeys.has(contactKey)) {
        skippedCount += 1
        continue
      }

      await contactsOperations.addContact({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        favorite: contact.favorite || false,
      })

      existingKeys.add(contactKey)
      insertedCount += 1
    }

    console.log(`Migration complete: inserted ${insertedCount}, skipped ${skippedCount}`)
  } catch (error) {
    console.error(`Migration failed: ${error.message}`)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

migrateContacts()
