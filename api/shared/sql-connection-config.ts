export const sqlConnectionConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
    lowerCaseGuids: true,
  },
  connectionTimeout: 60000,
  requestTimeout: 60000
};
