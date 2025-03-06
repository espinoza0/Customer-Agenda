const { getDb } = require("../config/database");

exports.getNotices = async (req, res) => {
  try {
    const db = getDb();
    const { client_id, pending } = req.query;

    let filters = [];

    if (client_id) {
      filters.push(`client_id = ${client_id}`);
    }

    if (pending) {
      filters.push(`pending = ${pending}`);
    }

    const optParams =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const [result] = await db.query(
      `SELECT visits.*, CONCAT(clients.name, ' ', clients.surname) AS client_name FROM visits JOIN clients ON visits.client_id = clients.id ${optParams} ORDER BY visits.date DESC`
    );

    // console.log("visitas: ", result);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener las visitas:", error);
    res.status(400).json({ error: "Error al obtener los visitas" });
  }
};

exports.addNotice = async (req, res) => {
  try {
    const db = getDb();
    const { date, observations, address, client_id } = req.body;

    // por defecto, se insertara el aviso con pending = 1, se cambiara de forma manual en la app
    const query = "INSERT INTO visits(date, observations, address, client_id) VALUES(?, ?, ?, ?)";
    const values = [date, observations, address, client_id];

    const result = await db.query(query, values);

    if (result[0].affectedRows > 0) {
      res.status(201).json({
        message: "Visita añadida exitosamente",
      });
    } else {
      throw new Error("La inserción no afectó ninguna fila");
    }

  } catch (error) {
    console.error("Error al insertar la visita", error);
    res.status(400).json({ error: "Error al insertar la visita" });
  }
};
