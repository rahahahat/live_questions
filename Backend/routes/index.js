const router = require('express').Router()

const IndexController = require('../controllers/index');

router.get('/', IndexController.index)

module.exports = router