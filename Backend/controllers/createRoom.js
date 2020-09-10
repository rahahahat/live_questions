const bcrypt = require('bcrypt');
const Room = require('../models/room');
var randomWords = require('random-words');

exports.createRoom = (req, res) => {
    let settings = req.body; //use settings as alias for req.body to improve readability

    //If room password is required then return a promise, otherwise resolve ''
    new Promise((resolve, reject) => {
        if (settings.requirePassword) {
            resolve(genHash(settings.password))
        } else {
            resolve('')
        }
    }).then(hashedRoomPassword => { //hashed room password will either be a hash or ''

        //admin password is mandatory so hash it, then take the hash and the hash of the room password and make a room
        genHash(settings.adminPassword).then(hashedAdminPassword => {

            //generate a human-readable unique url for the room
            let generatedUrl = generateUrl();

            //create room and apply settings
            const room = new Room({
                url: generatedUrl,
                title: settings.title.toString().trim(),
                owner: settings.owner.toString().trim(),
                created: new Date(),
                profanityFilter: settings.profanityFilter,
                requirePassword: settings.requirePassword,
                password: hashedRoomPassword,
                adminPassword: hashedAdminPassword
            });
            console.log('creating new room: ', room);

            //save room to the db
            room.save(function (err) { if (err) return console.error(err); });

            //send back a response -- client will use this to redirect

            //SECURITY: hashed passwords should not be sent back here
            res.json(room);

        }).catch(err => console.log(err)) //catch any promise errors
    })
}

//generate a random, human-readable, 3 word url for the room
const generateUrl = () => {
    //TODO: do some error handling here to prevent duplicate url
    return randomWords({ exactly: 3, join: '-' });
};

//bcrypt.hash wrapped as a promise 
const genHash = (plaintext) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintext, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
            if (err) reject(err);
            resolve(hash)
        })
    })
}
