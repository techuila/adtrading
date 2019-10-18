var express = require('express')
var app = express()
var PouchDB = require('pouchdb')
app.use('/', require('express-pouchdb')(PouchDB))
var db = new PouchDB('mydb')
db.changes({live: true}).on('change', console.log)

app.listen(3002, () => console.log(`🚀 Server ready at http://localhost:${3002}`));