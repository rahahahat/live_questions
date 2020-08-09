const express = require("express");
const http = require("http");
const path = require("path");
// -------------------------------------------
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
//  ------------------------------------------
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    io.emit("new_message", "{permission : true}");
  });
  socket.on("update-to-questions", (data) => {
    io.emit("to-update", data);
  });
});
// -----------s--------------------------------
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
