const { getDb } = require("../config/database");

exports.getNotices = async (req, res) => {
  try {
    const db = getDb();
    const {client_id} = req.query
    const optParams = client_id ? `WHERE client_id = ${client_id}` : ''
   
    const [result] = await db.query(`SELECT visits.*, CONCAT(clients.name, ' ', clients.surname) AS client_name FROM visits JOIN clients ON visits.client_id = clients.id ${optParams}`);
    
    console.log('visitas: ', result);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(400).json({ error: "Error al obtener los datos" });
  }
};
