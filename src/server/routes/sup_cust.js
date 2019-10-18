"use strict"
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const auth = require('../middleware/auth')
const upsert = require('./UpdateInsert')
const models = require('../config/database')

router.get('/:type',  async (req, res) => {
  try {
    const type = req.params.type
    console.log(type)
    const where = (type !== 'All')? {where: { type } } : {}
    res.send(await models.SupCust.findAll({ ...where,  order: [['createdAt', 'DESC']] }))
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.delete('/:id', async (req, res) => {
  try { 
    await models.SupCust.destroy({ where: { id: req.params.id } })
    res.send('Ok')
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.post('/',  async (req, res) => {
  try{
    const { id, firstName, lastName, old_firstName, old_lastName } = req.body
    
    if (id !== -1)
      await validate(firstName + ' ' + lastName, { name: 'update',  wholeName: old_firstName + ' ' + old_lastName  });
    else
      await validate(firstName + ' ' + lastName, { name: 'create' });

    const data = await upsert(models.SupCust, req.body)
    // const data = await models.User.update(req.fields, { where: { id: req.fields.id }})

    res.send(data)

  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

function validate (name, type) {
  return new Promise(async (resolve, reject) => {

     /* Name Validation */
     async function validateName () {
      try {
        if(name) {
          if (await models.SupCust.findOne({ where: { firstName: name.split(' ')[0], lastName: name.split(' ')[1] }}) !== null){
            if (type.name === 'update')
              if (type.wholeName === name)
                return true;
            
            throw('Name already in use!');
          }
    
          return true;
        }
        throw('Name is undefined');
      } catch (error) {
        throw(error)
      }
    }

    /* Run both validation in parallel */
    try {
      resolve(await Promise.all([validateName()]))
    } catch (error) {
      reject(error)
    }
  })   
}

module.exports = router