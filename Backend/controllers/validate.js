const bcrypt = require('bcrypt');
const Room = require('../models/room');


exports.validate_admin_pass = (req, res) => {
    console.log(req.body);
    Room.findById(req.body.id).then((result) => {
        if (!result) {
            res.send('Room not found');
        } else {
            bcrypt.compare(req.body.password, result.adminPassword).then((result) => {
                res.send(result);
            });
        }
    });
}

exports.validate_admin_url = (req, res) => {
    Room.findOne({ url: req.body.roomUrl }).then((result) => {
        if (!result) {
            res.send({ validate: false });
        } else {
            res.send({ validate: true, id: result._id });
        }
    });
}

exports.validate_join = (req, res) => {
    Room.findOne({ url: req.body.room })
        .then((room) => {
            if (!room) res.send(false);
            return room;
        })
        .then((room) => {
            if (room.requirePassword) {
                console.log(room);
                bcrypt.compare(req.body.password, room.password, (err, result) => {
                    console.log(result);
                    res.send(result);
                });
            } else {
                res.send(true);
            }
        });
}

exports.validate_password = (req, res) => {
    Room.findById(req.body.id).then((room) => {
        bcrypt.compare(req.body.password, room.password, (err, result) => {
            console.log(result);
            res.send(result);
        });
    });
}

exports.validate_url = (req, res) => {
    console.log(req.body.room);
    Room.find({ url: req.body.room }).then((room) => {
        if (!room) {
            res.send(false);
        } else {
            res.send({ needPassword: room[0].requirePassword, roomID: room[0]._id });
        }
    });
}