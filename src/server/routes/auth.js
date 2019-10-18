'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Op = require('Sequelize').Op

// const privateKey = fs.readFileSync(path.resolve(__dirname, '../src/server/keys/private.key'), 'utf8') // ON PRODUCTION
const privateKey = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'), 'utf8') // ON DEVELOPMENT

// Database
const models = require('../config/database')

/**
 * @route api/auth
 * @desc Authorize users
 * @access Private
 */
router.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body

  models.User.findOne({ where: { [Op.or]: [{ username: username }, { email: username }] }}).then(user => {
    if(!user) {
      return res.status(400).json({msg: "Username/email does not exist.", type: 1})
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, match) => {
      if(!match) {
        return res.status(400).json({msg: 'Password is incorrect', type: 2})
      }

      const issuer  = 'AD Trading'
      const subject  = 'axlcuyugan05@gmail.com'
      const audience  = 'http://localhost:8080'
      const userPayload = {
          id: user.id,
          email: user.email
      }

      const signOptions = {
          issuer,
          subject,
          audience,
          expiresIn:  "8h",
          algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
      };

      // Sign in JWT
      try {
          const token = jwt.sign(userPayload, privateKey, signOptions)

          res.send({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                userType: user.userType
            }
          })
      } catch (error) {
        console.log(error)

        return res.status(500).json({msg: "Server Error"})
      }
    })
  })
  .catch( errors => console.log(errors) )
})

router.get('/user', auth, (req, res) => {

    models.User.findOne({ 
      where: { id: req.user.id},
      attributes: {
         exclude: ['password']
     }
   })
   .then((user) => {
      
      res.send(user)
    
   })
   .catch(err => {
      console.log(err)
      res.status(500).json({msg: "Server Error"})
   })
})
   

module.exports = router