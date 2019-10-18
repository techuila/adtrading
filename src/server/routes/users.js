"use strict"
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const auth = require('../middleware/auth')
const upsert = require('./UpdateInsert')
const models = require('../config/database')

router.get('/',  async (req, res) => {
  try {
    res.send(await models.User.findAll({ 
      attributes: ['id', 'username', 'firstName', 'lastName', 'userType', 'email'],
      order: [['createdAt', 'DESC']] 
    }))
  } catch (error) {
    res.status(400).json({ msg: error })
  }
})

router.post('/',  async (req, res) => {
  try{
    const { id, email, username, old_username, old_email } = req.body
    
    if (id !== -1)
      await validate(email, username, { name: 'update',  username: old_username, email: old_email  });
    else
      await validate(email, username, { name: 'create' });

    const data = await upsert(models.User, req.body)
    // const data = await models.User.update(req.fields, { where: { id: req.fields.id }})
    const {password, ...user} = data
    res.send(userN)

  } catch (error) {
    res.status(400).json({ msg: error })
  }
});

function validate (email, username, type) {
  return new Promise(async (resolve, reject) => {

    /* Email Validation */
    async function validateEmail() {
      try {
        if(email) {
          if (email.split('@').length - 1 === 1 && email.split('.').length - 1 === 1){
            if (await models.User.findOne({ where: { email }}) !== null){
              if (type.name === 'update')
                if (type.email === email)
                  return true;
                
              throw('Email already in use!');
            }
    
            return true;
          } else {
            throw('Email is not valid!');
          }
        }
        throw('Email is undefined');
      } catch (error) {
        throw(error)
      }
    }

    /* Username Validation */
    async function validateUsername () {
      try {
        if(username) {
          if (await models.User.findOne({ where: { username }}) !== null){
            if (type.name === 'update')
              if (type.username === username)
                return true;
            
            throw('Username already in use!');
          }
    
          return true;
        }
        throw('Username is undefined');
      } catch (error) {
        throw(error)
      }
    }


    /* Run both validation in parallel */
    try {
      resolve(await Promise.all([validateEmail(), validateUsername()]))
    } catch (error) {
      reject(error)
    }
  })   
}

module.exports = router