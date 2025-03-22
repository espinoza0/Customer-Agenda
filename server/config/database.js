const mysql = require("mysql2/promise");
const config = require('./config');

let pool;

async function connectToDatabase() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        ...config.database,
        waitForConnections: true,
        connectionLimit: 2,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });
      console.log("Pool de conexiones a la base de datos establecido");
    }
    return pool;
  } catch (error) {
    console.error("Error al crear el pool de conexiones:", error);
    throw error;
  }
}

async function getDb() {
  if (!pool) {
    await connectToDatabase();
  }
  return pool;
}

// Inicializar el pool inmediatamente
// connectToDatabase().catch(console.error);

module.exports = {
  connectToDatabase, 
  getDb
};
