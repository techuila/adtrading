const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  // storage: path.resolve(__dirname, '../src/server/config/db.sqlite') // ON PRODUCTION
  storage: path.resolve(__dirname, '../config/db.sqlite'), // ON DEVELOPMENT
  // storage: `file:${__dirname, '../config/db.sqlite'}?node=primary&bind=tcp://0.0.0.0:1234` // ON CLOUD
  logging: false
});

const models = {
  Category: require('../models/categories')(sequelize, Sequelize),
  Company: require('../models/company')(sequelize, Sequelize),
  ItemList: require('../models/item_list')(sequelize, Sequelize),
  Log: require('../models/logs')(sequelize, Sequelize),
  Order: require('../models/orders')(sequelize, Sequelize),
  Payment: require('../models/payments')(sequelize, Sequelize),
  SupCust: require('../models/sup_cust')(sequelize, Sequelize),
  Transaction: require('../models/transactions')(sequelize, Sequelize),
  UnitMeasure: require('../models/unit_measure')(sequelize, Sequelize),
  User: require('../models/users')(sequelize, Sequelize),
};

/* Create association (relations) */
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;