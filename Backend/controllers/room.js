const bcrypt = require('bcrypt');
const Room = require('../models/room');

exports.room = (req, res) => {
    console.log(req.body);

    //reasonably complicated!
    //create a promise as bcrypt.hash is async
    let processTheNewRoom = new Promise((resolve, reject) => {
        if (!req.body.requirePassword) {
            //if no password is required for the room just return ""
            resolve('');
        } else {
            bcrypt.hash(req.body.password, 8, (err, hash) => {
                //otherwise make a hash
                if (err) reject(err);
                resolve(hash);
            });
        }
    })
        .then((hash) => {
            const passHash = (hashedPass) => {
                return new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.adminPassword, 8, (err, adminHash) => {
                        if (err) reject(err);
                        resolve({ password: hashedPass, adminPassword: adminHash });
                    });
                });
            };
            return passHash(hash);
        })
        .then((passwords) => {
            //take the hash (or just "") and use it in creating the mongodb document with the other params
            let generatedUrl = generateUrl();

            const room = new Room({
                url: generatedUrl,
                title: req.body.title.toString().trim(),
                owner: req.body.owner.toString().trim(),
                created: new Date(),
                profanityFilter: req.body.profanityFilter,
                requirePassword: req.body.requirePassword,
                password: passwords.password,
                adminPassword: passwords.adminPassword
            });
            console.log('creating new room: ', room);
            room.save(function (err) {
                //save to the db
                if (err) return console.error(err);
            });

            res.json(room); //send back a response -- client will use this to redirect
        })
        .catch((err) => console.error(err));
}