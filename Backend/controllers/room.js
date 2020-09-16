const bcrypt = require('bcrypt');
const Room = require('../models/room');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
exports.validate_admin_pass = (req, res) => {
    //console.log(req.params.url);
    Room.findOne({ url: req.params.url }).then((result) => {
        if (!result) {
            res.status(404).send('Room not found');
        } else {
            console.log(req.body.password, result.adminPassword);
            bcrypt.compare(req.body.password, result.adminPassword, (err, result) => {
                //console.log(result)
                result ? res.status(200).send(true) : res.status(401).send(false);
            });
        }
    });
}

//send true if password for room is correct
//TODO: if they are already authenticated then just let em in
exports.login = (req, res) => {
    if (req.isAuthenticated) {
        return res.json(true)
    } else {
        Room.findOne({ url: req.params.url }).then(room => {
            if (room) { //so long as room is found
                if (room.requirePassword) {
                    bcrypt.compare(req.body.password, room.password, (err, result) => {
                        //TODO:Send back token

                        //create user - 
                        let user = new User({
                            name: req.body.name,
                            room: room._id,
                            //TODO: token
                        })

                        user.save((err, result) => {
                            if (!err) {

                                //define our payload
                                let payload = {
                                    uid: result._id,
                                    room: room.url
                                }

                                //sign token
                                token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
                                res.cookie("token", token, { httpOnly: true, maxAge: 3000000 });
                                return res.json({ token: token });
                                //send back token on success
                                // return result ? res.status(200).send(token) : res.status(401).send(false);
                            }
                        });
                    });
                } else {
                    return res.status(200).send(true); //no password required so log in normally
                }
            } else {
                return res.status(404).send(false)
            }
        }).catch(err => console.log(err));
    }
}

//check if room exists and send back if password is required
exports.validate_url = (req, res) => {
    //console.log(req.params.url);
    Room.findOne({ url: req.params.url }).then(room => {
        if (room) {
            console.log("AUTH:", req.isAuthenticated)

            //only return this data to avoid sending hashed passwords and stuff to an unauthenticated user
            let returndata = {
                url: room.url,
                title: room.title,
                requirePassword: room.requirePassword,
                authenticated: req.isAuthenticated //currently unused, bool showing the auth middleware returned true or false
            }

            res.status(200).json(returndata)
        } else {
            res.status(404).send("Room not found");
        }
    })
}