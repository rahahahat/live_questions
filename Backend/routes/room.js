const router = require('express').Router()
const RoomController = require('../controllers/room');
const CreateRoomController = require('../controllers/createRoom')

/* all these routes begin with /room */

// location /room
router.post('/', CreateRoomController.createRoom)

//location /room/:url
router.post('/:url', RoomController.validate_url)

//location /room/:url/login
router.post('/:url/login', RoomController.login)

//location /room/:url/admin
router.post('/:url/admin', RoomController.validate_admin_pass)

module.exports = router