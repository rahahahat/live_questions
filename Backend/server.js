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

//inserts a new room into db
app.post("/room", (req, res, next) => {
  console.log(req.body);
  if (isValid(req.body)) {
    const room = new Room({
      url: req.body.url.toString().trim(),
      owner: req.body.owner.toString().trim(),
      created: new Date(),
    });

    console.log("creating new room: ", room.url);

    room.save(function (err) {
      if (err) return console.error(err);
    });

    res.json(JSON.stringify(room));
  } else {
    res.json({
      message: "Something went wrong! ",
    });
  }
});

//global entry point for io connections
io.on("connection", (socket) => {
  //Triggered when joinform is submitted
  console.log(`Socket connected id ${socket.id}`);

  socket.on("join-room", (user) => {
    //find room in db to check it exists before creating
    Room.findOne({
      url: user.roomName,
    })
      .populate("questions")
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
    //console.log(newQuestion);
    console.log(`${Date.now()}: ${newQuestion.author} asks ${newQuestion.text} in room ${newQuestion.room}`);

    Room.findOne({
      url: newQuestion.room,
    })
      .then((record) => {
        let question = new Question({
          author: newQuestion.author,
          text: record.profanityFilter
            ? new Filter().clean(newQuestion.text) //filter profanity if condition is set in room
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
    incrementQuestionScore(id);

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

function incrementQuestionScore(questionId) {
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

http.listen(process.env.PORT || 3000, function () {
  console.log("Hello World, lisening on 3000");
});
