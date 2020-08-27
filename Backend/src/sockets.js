const Room = require("../models/room");
const Question = require("../models/question");
var Filter = require("bad-words");

//global entry point for socket.io connections
module.exports = (io) => {
  io.on("connection", (socket) => {
    //Triggered when joinform is submitted
    console.log(`Socket connected id ${socket.id}`);

    socket.on("join-room", (user) => {
      //find room in db to check it exists before creating
      console.log(user);
      Room.findOne({
        url: user.roomUrl,
      })
        .populate("questions") //turns list of question ids into list of question objects
        .exec((err, result) => {
          if (err || !result) {
            err ? console.log(err) : console.log("Room not found", user.roomUrl);
            socket.emit("room-not-found");
          } else {
            //result = result.populate("questions");
            socket.join(user.roomUrl);
            socket.emit("acknowledge-join", result);
            console.log(`${Date.now()}: ${user.userName} joined room ${user.roomUrl}`);
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

    socket.on("vote-up", ({ id, roomUrl }) => {
      //increment question score in DB
      incrementQuestionScoreById(id);

      Question.findById(id).then((record) => {
        if (record == null) {
          console.error("Could not update score");
        } else {
          //update the question on clientside
          socket.to(roomUrl).broadcast.emit("vote-up", id);
        }
      });
    });

    socket.on("delete-question", ({ id, roomUrl }) => {
      console.log(`Deleting question ${id} from ${roomUrl}`);
      //remove reference from room
      Room.findOneAndUpdate({ url: roomUrl }, { $pull: { questions: id } }, { new: true }, (err, doc) => {
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
      socket.to(roomUrl).emit("delete-question", id);
    });

    socket.on("disconnect", () => {
      console.log("Someone disconnected");
    });
  });
};

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
