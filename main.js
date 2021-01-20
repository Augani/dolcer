var express = require("express");
var app = express();
var path = require("path");
var http = require("http").Server(app);
const io = require("socket.io")(http);
var usersOnline = [];




io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    disconnect(socket.id);
  });
  socket.on("user", (f) => {
    usersOnline.push(f);
    io.emit("online", usersOnline);
  });
  socket.on("message", (data) => {
    data.createdAt = new Date();
    io.emit(data.to.socketId, data);
  });
});


io.on("message", (data) => {
  console.log(data);
});
function disconnect(id) {
  console.log(id, "dis");
}
app.use("/", express.static("client/public"));


http.listen(8000, () => {
  console.log("listening on port ");
});
