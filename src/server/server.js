'use strict'
const models = require('./config/database')
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 8081
const app = express()
require('dotenv').config()

// Test database connection
models.sequelize.authenticate()
.then( _ => console.log('Database Connected'))
.catch( errors => console.log(`Errors: ${errors}`))

// Cors
app.use(cors())
// BodyparserMiddleware
app.use(express.json())
app.get('/', (req, res) => {
res.send('Database is alive')
})
app.use(express.urlencoded({extended:true}))
// app.use(formidable())

// Set up routes
app.use('/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/users'))
app.use('/api/item', require('./routes/items'))
app.use('/api/category', require('./routes/category'))
app.use('/api/unitmeasure', require('./routes/unit_measure'))
app.use('/api/supcust', require('./routes/sup_cust'))
app.use('/api/transaction', require('./routes/transactions'))
// app.use('/api/subcontracts', require('./routes/subcontracts'))
// app.use('/api/offerpositions', require('./routes/offerpositions'))
// app.use('/api/expenses', require('./routes/expenses'))


// Assign port
app.listen(port, () => console.log(`Running on port ${port} in ${process.env.NODE_ENV} mode`))