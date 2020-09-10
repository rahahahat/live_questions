const bcrypt = require('bcrypt');
const Room = require('../models/room');


exports.validate_admin_pass = (req, res) => {
    console.log(req.params.url);
    Room.findOne({ url: req.params.url }).then((result) => {
        if (!result) {
            res.status(404).send('Room not found');
        } else {
            console.log(req.body.password, result.adminPassword);
            bcrypt.compare(req.body.password, result.adminPassword, (err, result) => {
                console.log(result)
                result ? res.status(200).send(true) : res.status(401).send(false);
            });
        }
    });
}

//send true if password for room is correct
exports.login = (req, res) => {
    Room.findOne({ url: req.params.url }).then(room => {
        if (room) { //so long as room is found
            if (room.requirePassword) {
                bcrypt.compare(req.body.password, room.password, (err, result) => {
                    result ? res.status(200).send(true) : res.status(401).send(false);
                });
            } else {
                res.status(200).send(true); //no password required so log in normally
            }
        } else {
            res.status(404).send(false)
        }
    }).catch(err => console.log(err));
}

//check if room exists and send back if password is required
exports.validate_url = (req, res) => {
    console.log(req.params.url);
    Room.findOne({ url: req.params.url }).then(room => {
        if (room) {
            console.log("AUTH:", req.isAuthenticated)

            //only return this data to avoid sending hashed passwords and stuff to an unauthenticated user
            let returndata = {
                url: room.url,
                title: room.title,
                requirePassword: room.requirePassword,
                userAuthenticated: req.isAuthenticated //currently unused, bool showing the auth middleware returned true or false
            }

            res.status(200).json(returndata)
        } else {
            res.status(404).send("Room not found");
        }
    })
}