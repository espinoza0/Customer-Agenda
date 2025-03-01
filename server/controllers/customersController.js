const { getDb } = require("../config/database");

exports.getClients = async (req, res) => {
  try {
    const db = getDb();
    const [result] = await db.query("SELECT * FROM clients");
    
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(400).json({ error: "Error al obtener los datos" });
  }
};
