const router = require('express').Router()

const RoomController = require('../controllers/room')
const TitleController = require('../controllers/title');
const IndexController = require('../controllers/index');

router.get('/', IndexController.index)

router.post('/room', RoomController.room)

router.post('/title', TitleController.get_room_title)

module.exports = router