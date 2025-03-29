const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getDb } = require("../config/database");

// Subida imagenes con multer /prueba en local
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// // 3. Configuramos Multer con opciones de almacenamiento y filtro de archivos
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     // Validar extensión del archivo
//     const allowedExtensions = /(.jpg|.jpeg|.png|.heic)$/i;
//     if (!allowedExtensions.test(file.originalname)) {
//       return cb(new Error("Extensión de archivo no permitida."), false);
//     }
//     cb(null, true);
//   },
// });

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No se subió ningún archivo." });
//     }

//     const { visit_id, client_id } = req.body;
//     if (!visit_id || !client_id) {
//       return res.status(400).json({ error: "Faltan datos necesarios." });
//     }

//     const filePath = `/uploads/${req.file.filename}`;

//     const db = await getDb();
//     const [result] = await db.query(
//       "INSERT INTO photos (client_id, visit_id, url) VALUES (?, ?, ?)",
//       [client_id, visit_id, filePath]
//     );

//     if (result.affectedRows > 0) {
//       res.status(200).json({
//         message: "Imagen subida exitosamente.",
//         imageId: result.insertId,
//         filePath: filePath,
//       });
//     } else {
//       throw new Error("La inserción no afectó ninguna fila");
//     }
//   } catch (error) {
//     console.error("Error al subir la imagen: ", error);
//     res.status(500).json({ error: "Error al procesar la imagen" });
//   }
// });
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
