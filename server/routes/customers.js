const express = require('express')
const router = express.Router()
const customersController = require('../controllers/customersController')


router.get('/getClients', customersController.getClients)


module.exports = router
