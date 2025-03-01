const express = require('express')
const router = express.Router()
const noticesController = require('../controllers/noticesController')


router.get('/getNotices', noticesController.getNotices)


module.exports = router
