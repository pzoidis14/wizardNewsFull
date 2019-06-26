const pg = require('pg');
const postgresURL = 'postgres://localhost/wizNewsFull';
const client = new pg.Client(postgresURL);

client.connect();

module.exports = client;
