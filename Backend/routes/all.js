const router = require('express').Router()
const ValidateController = require('../controllers/validate');
const RoomController = require('../controllers/room')
const TitleController = require('../controllers/title');
const IndexController = require('../controllers/index');

router.get('/', IndexController.index)

router.post('/room', RoomController.room)

router.post('/title', TitleController.get_room_title)

router.post('/validate-join', ValidateController.validate_join)

router.post('/validate-url', ValidateController.validate_url)

router.post('/validate-password', ValidateController.validate_password)

router.post('/validate-admin-url', ValidateController.validate_admin_url)

router.post('/validate-admin-pass', ValidateController.validate_admin_pass)

module.exports = router