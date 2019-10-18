module.exports = {
  // devServer: {
  //   before: configureAPI
    // proxy: {
    //   '/api' : {
    //     changeOrigin: true,
    //     // secure: false,
    //     ws: true,
    //     target: 'http://localhost:8001'
    //   }
    // }
  // },
  configureWebpack: config => {
    // if (process.env.NODE_ENV === 'development') {
      // config.output.publicPath = `${process.cwd()}/dist/`
    // }
    // config.target = 'electron-renderer',
    config.externals = ["pg", "sqlite3", "tedious", "pg-hstore", 'sequelize', 'Sequelize']
  }
  // configureWebpack: {
  //   externals: {
  //     sequelize: "require('sequelize')",
  //     sqlite3: "require('sqlite3')",
  //     express: "require('express')"
  //   },
  // },
  // pluginOptions: {
  //   electronBuilder: {
  //     externals: ['sequelize'],
  //     builderOptions: {
  //       extraResources: ['src/server/config/db.sqlite'],
  //     },
  //   }
  // },
}
