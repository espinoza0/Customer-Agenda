const { getDb } = require("../config/database");

exports.getNotices = async (req, res) => {
  try {
    const db = await getDb();
    const { client_id, pending, start_date, end_date } = req.query;

    let filters = [];

    if (client_id) {
      filters.push(`client_id = ${client_id}`);
    }

    if (pending) {
      filters.push(`pending = ${pending}`);
    }

    if (start_date && end_date) {
      // filters.push(`date BETWEEN '${start_date}' AND DATE_ADD('${end_date}', INTERVAL 1 DAY)`)
      filters.push(`date BETWEEN '${start_date}' AND '${end_date}'`);
    }

    const optParams =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const [result] = await db.query(
      `SELECT visits.*, CONCAT(clients.name, ' ', clients.surname) AS client_name FROM visits JOIN clients ON visits.client_id = clients.id ${optParams} ORDER BY visits.date DESC`
    );

    res.json(result);
  } catch (error) {
    console.error("Error al obtener las visitas:", error);
    res.status(400).json({ error: "Error al obtener los visitas" });
  }
};

exports.addNotice = async (req, res) => {
  try {
    const db = await getDb();
    const { date, observations, address, client_id } = req.body;

    // por defecto, se insertara el aviso con pending = 1, se cambiara de forma manual en la app
    const query =
      "INSERT INTO visits(date, observations, address, client_id) VALUES(?, ?, ?, ?)";
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

exports.editNotice = async (req, res) => {
  try {
    const db = await getDb();

    const { date, observations, address, visit_id} = req.body;

    const result = await db.query(
      "UPDATE visits SET date = ?, observations = ?, address = ? WHERE id = ?",
      [date, observations, address, visit_id]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Visita no encontrada" });
    }

    return res.status(200).json({message: "Visita modificada correctamente"})
  } catch (error) {
    console.error("Error al editar la visita", error);
    res.status(400).json({ error: "Error al editar la visita" });
  }
};

exports.removeNotice = async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  const parsedId = parseInt(id);

  let connection;
  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    // Primero se eliminan las fotos asociadas a la visita
    await await connection.query("DELETE FROM photos WHERE visit_id = ?", [parsedId]);

    const [result] = await connection.query("DELETE FROM visits WHERE id = ?", [parsedId]);
    

    await connection.commit();
    connection.release()

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Visita eliminada exitosamente" });
    } else {
      res.status(404).json({ error: "Visita no encontrada" });
    }
  } catch (error) {
    // Si hay un error, revertir la transacción
    await connection.rollback();
    connection.release()
    console.error("Error al eliminar la visita: ", error);
    res.status(500).json({ error: "Error al eliminar la visita." });
  }
}
