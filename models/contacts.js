const { Schema, model, isValidObjectId } = require('mongoose')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
      },
    },
  },
)

const Contact = model('contact', contactSchema)

const listContacts = async () => {
  return Contact.find()
}

const getContactById = async contactId => {
  if (!isValidObjectId(contactId)) {
    return null
  }

  return Contact.findById(contactId)
}

const removeContact = async contactId => {
  if (!isValidObjectId(contactId)) {
    return null
  }

  return Contact.findByIdAndDelete(contactId)
}

const addContact = async body => {
  return Contact.create(body)
}

const updateContact = async (contactId, body) => {
  if (!isValidObjectId(contactId)) {
    return null
  }

  // Return the updated document to keep route handlers simple.
  return Contact.findByIdAndUpdate(contactId, body, { new: true })
}

const updateStatusContact = async (contactId, body) => {
  if (!isValidObjectId(contactId)) {
    return null
  }

  // Keep status update logic separate from full-contact updates.
  return Contact.findByIdAndUpdate(contactId, body, { new: true })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
