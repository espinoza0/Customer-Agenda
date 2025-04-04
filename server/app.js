const express = require("express");
const config = require("./config/config.js");
const cors = require("cors");
const { connectToDatabase } = require("./config/database.js");
const path = require("path");

//Import Rutas
const customersRoutes = require("./routes/customers.js");
const noticesRoutes = require("./routes/notices.js");
const photosRoutes = require("./routes/photos.js");

const app = express();

// Middleware para parsear body a JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: [process.env.FRONT, "http://localhost:5173", "http://192.168.1.128:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};

app.use(cors(corsOptions));

// Manejar preflight requests
app.options("*", cors(corsOptions));

app.use("/clients", customersRoutes);
app.use("/notices", noticesRoutes);
app.use("/photos", photosRoutes)

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const startServer = async () => { 
  try {
    await connectToDatabase();
    app.listen(config.serverPort, () => {
      console.log(`Server running on port ${config.serverPort}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();
