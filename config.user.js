/* global module */
module.exports = {
  client: {
    signup: {invite: {on: false, code: 'welcome'}}
  },
  server: {
    static: {
      host: '0.0.0.0',
      port: 3000,
      secure: {
        enabled: false,
        key: 'path/to/key.pem',
        cert: 'path/to/cert.pem'
      },
      logFormat: 'dev'
    },
    database: {
      protocol: 'http',
      host: 'localhost',
      port: 5984,
      auth: {on: false, name: 'admin', password: 'admin'},
      dev: {start: true}
    }
  }
};
