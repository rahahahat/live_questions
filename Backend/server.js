if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);
var cors = require("cors");
const bodyParser = require("body-parser");
var Filter = require("bad-words");
const bcrypt = require("bcrypt");

const Room = require("./models/room");
const Question = require("./models/question");

app.use(cors());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongose"));

app.get("/", (req, res) => {
  res.send("hello");
});

//mostly for debugging api
app.get("/info", (req, res) => {
  let info = {
    rooms: io.sockets.adapter.rooms,
  };
  res.json(info);
});

//inserts a new room into db - accessed by CreateRoom.js
app.post("/room", (req, res, next) => {
  //reasonably complicated!
  //create a promise as bcrypt.hash is async
  let processTheNewRoom = new Promise((resolve, reject) => {
    if (!req.body.requirePassword) {
      //if no password is required for the room just return ""
      resolve("");
    } else {
      bcrypt.hash(req.body.password, 8, (err, hash) => {
        //otherwise make a hash
        if (err) reject(err);
        resolve(hash);
      });
    }
  })
    .then((hash) => {
      //take the hash (or just "") and use it in creating the mongodb document with the other params
      const room = new Room({
        url: req.body.url.toString().trim(),
        owner: req.body.owner.toString().trim(),
        created: new Date(),
        profanityFilter: req.body.profanityFilter,
        requirePassword: req.body.requirePassword,
        password: hash,
      });

      console.log("creating new room: ", room.url);

      room.save(function (err) {
        //save to the db
        if (err) return console.error(err);
      });

      res.json(JSON.stringify(room)); //send bach a response
    })
    .catch((err) => console.error(err));
});

//include all the socket.io code
require("./src/sockets.js")(io);

http.listen(process.env.PORT || 3000, function () {
  console.log("Hello World, lisening on 3000");
});
