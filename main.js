var express = require("express");
var app = express();
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
    io.emit(data.to.socketId, data);
  });
});

function disconnect(id) {
  if (!usersOnline.length) return;
  usersOnline = usersOnline.filter((p) => p.socketId != id);
}
app.use("/", express.static("client/public"));

http.listen(8000, () => {
  console.log("listening on port ");
});
