module.exports = () => {
  socket.on("test1", () => {
    setTimeout(() => {
      io.emit("test1", { data: "RAHAT" });
    }, 1000);
  });
};
