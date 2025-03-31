const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getDb } = require("../config/database");


router.post("/upload", async (req, res) => {
  try {
    const { visit_id, client_id , url} = req.body;

    if (!visit_id || !client_id || !url) {
      return res.status(400).json({ error: "Faltan datos necesarios." });
    }

    const db = await getDb();
    const [result] = await db.query(
      "INSERT INTO photos (client_id, visit_id, url) VALUES (?, ?, ?)",
      [client_id, visit_id, url]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "Imagen subida exitosamente.",
        imageId: result.insertId,
        url: url,
      });
    } else {
      throw new Error("La inserción no afectó ninguna fila");
    }
  } catch (error) {
    console.error("Error al subir la imagen: ", error);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});


router.get("/getImages/:visit_id", async (req, res) => {
  try {
    const db = await getDb();
    const { visit_id } = req.params;

    const [result] = await db.query("SELECT * from photos WHERE visit_id = ?", [
      parseInt(visit_id),
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});

module.exports = router;
