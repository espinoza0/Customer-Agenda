const { getDb } = require("../config/database");

exports.getClients = async (req, res) => {
  try {
    const db = getDb();
    const {client_id} = req.query
    
    let query = "SELECT * FROM clients "

    if (client_id) {
      query += `WHERE id = ${client_id}`
    }
    const [result] = await db.query(query);

    res.json(result);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(400).json({ error: "Error al obtener los datos" });
  }
};

exports.addClient = async (req, res) => {
  try {
    const db = getDb();
    const { name, surname, email, address, phone } = req.body;

    const query =
      "INSERT INTO clients(name, surname, email, address, phone) VALUES(?, ?, ?, ?, ?)";
    const values = [name, surname, email, address, phone];

    const result = await db.query(query, values);

    if (result[0].affectedRows > 0) {
      res.status(201).json({
        message: "Cliente añadido exitosamente",
      });
    } else {
      throw new Error("La inserción no afectó ninguna fila");
    }
  } catch (error) {
    console.error("Error al insertar cliente:", error);
    res.status(500).json({ error: "Error al insertar el nuevo cliente" });
  }
};

exports.removeClient = async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  const idModified = parseInt(id)
  try {
    await db.beginTransaction();

    // 1. Eliminar las invoices asociadas al cliente
    await db.query('DELETE FROM invoices WHERE client_id = ?', [idModified]);

    // 2. Eliminar los budgets asociados al cliente
    await db.query('DELETE FROM budget WHERE client_id = ?', [idModified]);

    // 3. Eliminar las visits asociadas al cliente
    await db.query('DELETE FROM visits WHERE client_id = ?', [idModified]);

    // 4. Finalmente, eliminar el cliente
    const result = await db.query('DELETE FROM clients WHERE id = ?', [idModified]);

    await db.commit();

    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: "Cliente y todos sus datos eliminados exitosamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    await db.rollback();
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar el cliente y sus datos asociados" });
  }
};

// para evitar el error de clave foranea, elimino el cliente junto con sus datos