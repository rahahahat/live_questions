const bcrypt = require('bcrypt');
const Room = require('../models/room');

exports.get_room_title = (req, res) => {
    Room.findOne({ url: req.body.roomUrl }).then((result) => {
        if (!result) {
            console.log('Room not found in app.post(/title)');
        } else {
            res.send(JSON.stringify({ title: result.title }));
        }
    });
}