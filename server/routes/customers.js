const express = require('express')
const router = express.Router()
const customersController = require('../controllers/customersController')


router.get('/getClients', customersController.getClients)
router.post('/addClient', customersController.addClient)
router.delete('/removeClient/:id', customersController.removeClient)
router.put('/editClient/:id', customersController.editClient)

module.exports = router
