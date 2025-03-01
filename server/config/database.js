const mysql = require("mysql2/promise");
const config = require('./config');

let connection;

async function connectToDatabase() {
  try {
    if (!connection) {
      connection = await mysql.createConnection(config.database);
      console.log("Conexión a la base de datos establecida");
    }
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
}

function getDb() {
  if (!connection) {
    throw new Error('La conexión a la base de datos no ha sido establecida');
  }
  return connection;
}

module.exports = {
  connectToDatabase,
  getDb
};
