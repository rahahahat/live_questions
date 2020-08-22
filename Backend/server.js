// const express = require('express');
// const http = require('http');
// const path = require('path');
// // -------------------------------------------
// const app = express();
// const server = http.createServer(app);
// const io = require('socket.io')(server);
// //  ------------------------------------------
// io.on('connection', (socket) => {
// 	console.log('user connected');
// 	socket.on('disconnect', () => {
// 		console.log('disconnect');
// 	});
// 	// --Exclusive client sockets for handling the question object--
// 	socket.on('add-question', (data) => {
// 		socket.to(data.roomName).broadcast.emit('add-this-question', data.obj);
// 	});
// 	socket.on('queue-vote-up', (data) => {
// 		socket.to(data.roomName).broadcast.emit('vote-up-onIndex', data.index);
// 	});
// 	socket.on('queue-delete', (data) => {
// 		socket.to(data.roomName).broadcast.emit('delete-question-onIndex', data.index);
// 	});
// 	socket.on('join-room', (roomName) => {
// 		socket.join(roomName);
// 	});
// 	// --------------------------------------------------------------
// });
// // -----------s--------------------------------
// server.listen(3000, () => {
// 	console.log('The server is running on port 3000');
// });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);
var cors = require("cors");
const bodyParser = require("body-parser");

const Instance = require("./models/instance");
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
  res.render("index");
});

//if :roomcode is a valid instance redirects and connects
app.get("/:roomcode", (req, res) => {
  //find room in db
  Instance.findOne({
    url: req.params.roomcode,
  }).then((result) => {
    if (result != null) {
      //if rooms exist
      res.locals.roomcode = req.params.roomcode;
      //   res.render("instance");
      res.send(true);
    } else {
      //otherwise redirect to home
      res.redirect("/");
    }
  });
});

//inserts a new instance into db
app.post("/instance", (req, res, next) => {
  console.log(req.body);
  if (isValid(req.body)) {
    const instance = new Instance({
      url: req.body.url.toString().trim(),
      owner: req.body.owner.toString().trim(),
      created: new Date(),
    });

    console.log("creating new instance: ", instance.url);

    instance.save(function (err) {
      if (err) return console.error(err);
    });

    res.json(JSON.stringify(instance));
  } else {
    res.json({
      message: "Something went wrong! ",
    });
  }
});

//---------REACT SOCKET START HERE-------------
//global entry point for io connections
io.on("connection", (socket) => {
  console.log(`${Date.now()}: someone connected`);

  //Triggered when joinform is submitted
  socket.on("join-room", (user) => {
    socket.join(user.roomName);

    console.log(`${Date.now()}: ${user.userName} joined room ${user.roomName}`);

    //fetch and send the messages so far, also providing a response from server to confirm success
    fetchInstanceFromUrl(user.roomName)
      .then((foundInstance) => {
        socket.emit("acknowledgeJoin", foundInstance);
      })
      .catch((err) => console.error(err));
  });

  //when someone submits a new question
  socket.on("add-question", (newQuestion) => {
    //console.log(newQuestion);
    console.log(
      `${Date.now()}: ${newQuestion.author} asks ${newQuestion.text} in room ${
        newQuestion.room
      }`
    );

    let question = new Question({
      author: newQuestion.author,
      text: newQuestion.text,
      score: 0,
    });

    Instance.findOne({
      url: newQuestion.room,
    })
      .then((record) => {
        createQuestion(record._id, question);
      })
      .catch((err) => {
        console.error(err);
      });
    io.to(newQuestion.room).emit("add-this-question", question);
  });

  socket.on("queue-vote-up", ({ index, roomName, id }) => {
    //increment question score in DB
    incrementQuestionScore(id);

    Question.findById(id).then((record) => {
      if (record == null) {
        console.error("Could not update score");
      } else {
        //update the question on clientside
        socket.to(roomName).broadcast.emit("vote-up-onIndex", index);
      }
    });
  });
});

const createQuestion = function (instanceId, question) {
  return Question.create(question).then((docQuestion) => {
    //console.log("\n>> Created Question:\n", docQuestion);

    return Instance.findByIdAndUpdate(
      instanceId,
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

function fetchInstanceFromUrl(instanceUrl) {
  //returns a promise
  return Instance.findOne({
    url: instanceUrl,
  }).populate("questions");
}

function isValid(body) {
  return true;
}

http.listen(process.env.PORT || 3000, function () {
  console.log("Hello World, lisening on 3000");
});
