var express = require('express');
var app = express();
var path  = require('path')
var http = require('http').Server(app);
const io = require('socket.io')(http);
var usersOnline =[];

io.on('connection', (socket)=>{
  socket.on('disconnect', ()=>{
    disconnect(socket.id)
  })
  socket.on('user', (f)=>{
    usersOnline.push(f);
    io.emit('online', usersOnline)
  })
  socket.on("message", (data)=>{
    data.createdAt = new Date()
    io.emit(data.to.socketId, data)
  })
})




io.on('message', (data)=>{
  console.log(data);
})
function disconnect(id){
  console.log(id, "dis")
}
app.use("/simple",express.static('client/public'))
app.use(express.static(path.join(__dirname, 'client-react/build')))

// Handle React routing, return all requests to React app
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client-react/build', 'index.html'))
})




http.listen(8000, ()=>{
  console.log("listening on port ")
})