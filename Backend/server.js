if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Question = require("./models/question.js");
app.use(cors({ credentials: true, origin: "http://localhost:1234" }));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//MONGODB/MONGOOSE
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongose"));

//AUTH MIDDLEWARE
var auth = require("./middleware/auth");

//ROUTING
var indexRoute = require("./routes/index");
var roomRoutes = require("./routes/room");
const { resolve } = require("path");

app.use("/", indexRoute);
app.use("/room", auth.isAuthenticated, roomRoutes);
var result;
//SOCKETIO
require("./sockets/sockets.js")(io);

const testQ = new Question({
  text: "TEST QUESTION",
  author: "TEST AUTHOR",
  score: 0,
});
testQ.save((err, result) => {
  console.log(result);
});
http.listen(process.env.PORT || 3000, function () {
  console.log("Hello World, lisening on 3000");
});
