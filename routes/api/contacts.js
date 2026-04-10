const express = require('express')
const Joi = require('joi')
const contactsOperations = require('../../models/contacts')

const router = express.Router()
const postContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
})
const putContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1)
const patchFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts()
    return res.status(200).json(contacts)
  } catch (error) {
    return next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await contactsOperations.getContactById(contactId)

    if (!contact) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json(contact)
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = postContactSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ message: 'missing required name field' })
    }

    const newContact = await contactsOperations.addContact(value)
    return res.status(201).json(newContact)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const deletedContact = await contactsOperations.removeContact(contactId)

    if (!deletedContact) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ message: 'contact deleted' })
  } catch (error) {
    return next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { error, value } = putContactSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ message: 'missing fields' })
    }

    const updatedContact = await contactsOperations.updateContact(contactId, value)

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json(updatedContact)
  } catch (error) {
    return next(error)
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { error, value } = patchFavoriteSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ message: 'missing field favorite' })
    }

    const updatedContact = await contactsOperations.updateStatusContact(
      contactId,
      value
    )

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json(updatedContact)
  } catch (error) {
    return next(error)
  }
})

module.exports = router
