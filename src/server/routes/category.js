"use strict"
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const upsert = require('./UpdateInsert')
const models = require('../config/database')

router.get('/',  async (req, res) => {
  try {
    res.send(await models.Category.findAll())
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.delete('/:id', async (req, res) => {
  try { 
    await models.Category.destroy({ where: { id: req.params.id } })
    res.send('Ok')
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.post('/',  async (req, res) => {
  try{
    const { id, descr, old_descr } = req.body
    
    if (id)
      await validate(descr, { name: 'update',  descr: old_descr });
    else
      await validate(descr, { name: 'create' });

    const data = await upsert(models.Category, req.body)
    // const data = await models.User.update(req.fields, { where: { id: req.fields.id }})

    res.send(data)

  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

function validate (descr, type) {
  return new Promise(async (resolve, reject) => {

    /* Category Validation */
    async function validateDescr () {
      try {
        if(descr) {
          if (await models.Category.findOne({ where: { descr }}) !== null){
            if (type.name === 'update')
              if (type.descr === descr)
                return true;
            
            throw('Category already in use!');
          }
    
          return true;
        }
        throw('Category is undefined');
      } catch (error) {
        throw(error)
      }
    }

    /* Run both validation in parallel */
    try {
      resolve(await Promise.all([validateDescr()]))
    } catch (error) {
      reject(error)
    }
  })   
}

module.exports = router