const router = require('express').Router()
const ValidateController = require('../controllers/validate');

/* all these routes begin with /validate */
// eg: app.com/validate/join
router.post('/join', ValidateController.validate_join)

router.post('/url', ValidateController.validate_url)

router.post('/password', ValidateController.validate_password)

router.post('/admin-url', ValidateController.validate_admin_url)

router.post('/admin-pass', ValidateController.validate_admin_pass)

module.exports = router