const express = require("express");
const config = require("./config/config.js");

const app = express();

let db;

// Middleware para parsear body a JSON
app.use(express.json());

// Función para inicializar la base de datos
async function initializeDatabase() {
  db = await config.connectToDatabase();
}

// Rutas
app.get("/clients", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM clients");
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(400).json({ error: "Error al obtener los datos" });
  }
});

// Inicializa la base de datos y luego inicia el servidor
initializeDatabase().then(() => {
  app.listen(config.serverPort, () => {
    console.log(`Server running on port ${config.serverPort}`);
  });
}).catch(error => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
