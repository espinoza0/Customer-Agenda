const express = require("express");
const config = require("./config/config.js");
const {connectToDatabase} = require('./config/database.js') 


//Import Rutas
const customersRoutes = require('./routes/customers.js')
const noticesRoutes = require('./routes/notices.js')


const app = express();
// Middleware para parsear body a JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Reemplaza con la URL de tu frontend
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


app.use('/clients', customersRoutes)
app.use('/notices', noticesRoutes)

const startSever = async () => {
  try {
    await connectToDatabase()
    app.listen(config.serverPort, () => {
      console.log(`Server running on port ${config.serverPort}`);
    });
    
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
} 

startSever()