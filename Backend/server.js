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
const { createSign } = require("crypto");
const { rejects } = require("assert");
const { resolve } = require("path");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongose"));

//renders homepage
app.get("/", (req, res) => {
  res.send("hello");
});
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

//global entry point for socket.io connections
io.on("connection", (socket) => {
  //Triggered when joinform is submitted
  console.log(`Socket connected id ${socket.id}`);

  socket.on("join-room", (user) => {
    //find room in db to check it exists before creating
    Room.findOne({
      url: user.roomName,
    })
      .populate("questions") //turns list of question ids into list of question objects
      .exec((err, result) => {
        if (err || !result) {
          err ? console.log(err) : console.log("Room not found", user.roomName);
          socket.emit("room-not-found");
        } else {
          //result = result.populate("questions");
          socket.join(user.roomName);
          socket.emit("acknowledge-join", result);
          console.log(`${Date.now()}: ${user.userName} joined room ${user.roomName}`);
        }
      });
  });

  //when someone submits a new question
  socket.on("add-question", (newQuestion) => {
    console.log(`${Date.now()}: ${newQuestion.author} asks ${newQuestion.text} in room ${newQuestion.room}`);

    //Find the room in the db
    Room.findOne({
      url: newQuestion.room,
    })
      .then((record) => {
        //create question object
        let question = new Question({
          author: newQuestion.author,
          text: record.profanityFilter
            ? new Filter().clean(newQuestion.text) //filter profanity if setting is true for this room
            : newQuestion.text,
          score: 0,
        });
        console.log(question);

        createQuestion(record._id, question);

        //emit question to room
        io.to(record.url).emit("add-question", question);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("vote-up", ({ id, roomName }) => {
    //increment question score in DB
    incrementQuestionScoreById(id);

    Question.findById(id).then((record) => {
      if (record == null) {
        console.error("Could not update score");
      } else {
        //update the question on clientside
        socket.to(roomName).broadcast.emit("vote-up", id);
      }
    });
  });

  socket.on("delete-question", ({ id, roomName }) => {
    console.log(`Deleting question ${id} from ${roomName}`);
    //remove reference from room
    Room.findOneAndUpdate({ url: roomName }, { $pull: { questions: id } }, { new: true }, (err, doc) => {
      if (err) {
        console.error(err);
      }
    });

    //then delete question from db
    Question.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        console.error(err);
      }
    });
    socket.to(roomName).emit("delete-question", id);
  });

  socket.on("disconnect", () => {
    console.log("Someone disconnected");
  });
});

const createQuestion = function (roomId, question) {
  return Question.create(question).then((docQuestion) => {
    return Room.findByIdAndUpdate(
      roomId,
      {
        $push: {
          questions: docQuestion._id,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
};

function incrementQuestionScoreById(questionId) {
  console.log("Incrementing score");

  Question.findByIdAndUpdate(
    questionId,
    {
      $inc: {
        score: 1,
      },
    },
    {
      new: true,
    },
    function (err, response) {
      if (err) {
        console.log(err);
      }
    }
  );
}

function isValid(body) {
  return true;
}

async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

http.listen(process.env.PORT || 3000, function () {
  console.log("Hello World, lisening on 3000");
});
