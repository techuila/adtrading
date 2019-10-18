"use strict"
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const upsert = require('./UpdateInsert')
const models = require('../config/database')

router.get('/:type',  async (req, res) => {
  try {
    const type = req.params.type
    const result = await models.Transaction.findAll({ 
      include: [
        { 
          association: models.Transaction.Order,
          include: [{ association: models.Order.Item }]
        }, 
        { association: models.Transaction.SupCust },
        { association: models.Transaction.Payment },
      ], 
      where: { type },
      order: [['createdAt', 'DESC']] 
    })

    res.send(result)
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.delete('/:id', async (req, res) => {
  try { 
    await models.Transaction.destroy({ where: { id: req.params.id }, include:[{ association: models.Transaction.Order }] })
    res.send('Ok')
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.post('/',  async (req, res) => {
  try{
    const { id, receiptNumber, old_receiptNumber, type, Orders, status, payment } = req.body

    if (!payment) {
      if (id !== -1)
        await validate(receiptNumber, { name: 'update',  receiptNumber: old_receiptNumber });
      else
        await validate(receiptNumber, { name: 'create' });
    }

    const data = await upsert(models.Transaction, req.body, {
      include: [{ 
        model: models.Order,
        as: 'Orders'
      }, { 
        model: models.Payment,
        as: 'Payments'
      }], 
    })

    if (payment) {
      await models.Payment.create(req.body.Payments[0])
    }

    if (type === 'OUT' && status === 'Fully Paid') {
      Orders.forEach(async e => {
        await models.sequelize.query(`
          UPDATE item_list 
          SET qtyIn = qtyIn - ${e.qty}
          WHERE id = ${e.itemID};
        `)
      })
    }

    data.setDataValue('Orders', await data.getOrders().map(async e => {
      e.setDataValue('Items', await models.ItemList.findOne({ where: { id: e.get().itemID } }))
      return e;
    }))
    data.setDataValue('SupCust', await models.SupCust.findOne({ where: { id: data.get().supCustID } }))
    data.setDataValue('Payments', await models.Payment.findAll({ where: { transaction_id: data.get().id } }))

    res.send(data)
  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

router.put('/',  async (req, res) => {
  try{
    const { orders } = req.body
    const data = await upsert(models.Transaction, req.body)

    orders.forEach(async e => {
      const itemCost = (e.itemCost * 2) + e.itemCost
      await models.sequelize.query(`
        UPDATE item_list 
        SET qtyIn = qtyIn + ${e.qty}, 
        unit_price = 
        CASE 
          WHEN (unit_price < ${itemCost} AND qtyIn - qtyOut != 0) OR (qtyIn - qtyOut = 0)  THEN
            ${itemCost}
          ELSE
            unit_price 
        END
        WHERE id = ${e.itemID};
        SELECT * FROM item_list WHERE id = ${e.itemID}
      `)
    })

    data.setDataValue('Orders', await data.getOrders().map(async e => {
      e.setDataValue('Items', await models.ItemList.findOne({ where: { id: e.get().itemID } }))
      return e;
    }))
    data.setDataValue('SupCust', await models.SupCust.findOne({ where: { id: data.get().supCustID } }))

    res.send(data)
  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

function validate (receiptNumber, type) {
  return new Promise(async (resolve, reject) => {

    /* Receipt Number Validation */
    async function validateReceiptNumber () {
      try {
        if(receiptNumber) {
          if (await models.Transaction.findOne({ where: { receiptNumber }}) !== null){
            if (type.name === 'update')
              if (type.receiptNumber === receiptNumber)
                return true;
            
            throw('Receipt Number already in use!');
          }
    
          return true;
        }
        throw('Receipt Number is undefined');
      } catch (error) {
        throw(error)
      }
    }

    /* Run both validation in parallel */
    try {
      resolve(await Promise.all([validateReceiptNumber()]))
    } catch (error) {
      reject(error)
    }
  })   
}


module.exports = router