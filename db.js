const { query } = require('express');
const { Pool, Client } = require('pg');

require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


async function createDatabase(dbname) {
  const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DEFAULT_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  }
  
  const client = new Client(config);
  
  try
  {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_database WHERE datname = '${dbname}'`);
    if(res.rowCount == 0)
    {
      await client.query(`CREATE DATABASE ${dbname}`);
      console.log("Base de données créée avec succès");
    }
    else console.log("La base de données existe déjà");
  } catch (err)
  {
    console.error("Erreur pendant le processus : " + err)
  } finally {
    await client.end();
  }

  const dbClient = new Client({ ...config, database: dbname });
  try
  {
    await dbClient.connect();
    const res = await dbClient.query(`SELECT 1
      FROM pg_extension
      WHERE extname = 'postgis'`);

    if(res.rowCount == 0)
    {
      await dbClient.query(`CREATE EXTENSION postgis`);
      console.log("Extension postgis activee avec succes");
    }
    else console.log("L'extension postgis est deja activee");
  } catch (err)
  {
    console.error("Erreur pendant le processus : " + err)
  } finally {
    await dbClient.end();
  }
}

/*const query = (text, params) => pool.query(text, params);
const createDb = (dbname) => createDatabase(dbname);
export default {
  query,
  createDb
}*/

module.exports = {
  query: (text, params) => pool.query(text, params),
  createDb: (dbname) => createDatabase(dbname)
};