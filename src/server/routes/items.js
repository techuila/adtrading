"use strict"
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const upsert = require('./UpdateInsert')
const models = require('../config/database')

router.get('/',  async (req, res) => {
  try {
    res.send(await models.ItemList.findAll({ 
      include: [
        { association: models.ItemList.Category }, 
        { association: models.ItemList.UnitMeasure },
        { association: models.ItemList.Creator }
      ], 
      order: [['createdAt', 'DESC']] 
    }))
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.post('/',  async (req, res) => {
  try{
    const { id, itemCode, old_itemCode } = req.body

    if (id !== -1)
      await validate(itemCode, { name: 'update',  itemCode: old_itemCode });
    else
      await validate(itemCode, { name: 'create' });

    const data = await upsert(models.ItemList, req.body)
    data.setDataValue('Category', await data.getCategory())
    data.setDataValue('UnitMeasure', await data.getUnitMeasure())
    data.setDataValue('Creator', await data.getCreator())

    res.send(data)
  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

router.delete('/:id', async (req, res) => {
  try { 
    await models.ItemList.destroy({ where: { id: req.params.id } })
    res.send('Ok')
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

function validate (itemCode, type) {
  return new Promise(async (resolve, reject) => {

    /* Item Code Validation */
    async function validateItemCode () {
      try {
        if(itemCode) {
          if (await models.ItemList.findOne({ where: { itemCode }}) !== null) {
            if (type.name === 'update')
              if (type.itemCode === itemCode)
                return true;
            
            throw('Item code already in use!');
          }
    
          return true;
        }
        throw('Item code is undefined');
      } catch (error) {
        throw(error)
      }
    }

    /* Run both validation in parallel */
    try {
      resolve(await Promise.all([validateItemCode()]))
    } catch (error) {
      reject(error)
    }
  })   
}

module.exports = router