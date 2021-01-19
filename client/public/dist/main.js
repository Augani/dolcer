const socket = io();
let socketId;

socket.on("connect", () => {
  socketId = socket.id;
  sock = socket;
  socket.on("online", userOnline);
  socket.on(socketId, (data) => {
    messageReceived(data);
  });
});

function userOnline(user) {
  sessionSave("users", JSON.stringify(user));
}

function messageReceived(messageObject) {
  appendChat(messageObject);
}
function emitMessage(messageObject) {
  socket.emit("message", messageObject);
}
function SendMessage(e) {
  let message = e.getElementsByTagName("input")[0].value;
  if (!message) return;
  let myName = sessionStorage.getItem("username");
  let user = sessionStorage.getItem("currentChat");
  let userData = getSocketId(user);
  if (!userData) return;
  messageObject = {
    socket: userData.socketId,
    message,
    to: userData,
    from: myName,
  };
  appendChat(messageObject);
  emitMessage(messageObject);
  e.getElementsByTagName("input")[0].value = "";
}

function getSocketId(name) {
  let usersList = JSON.parse(sessionStorage.getItem("users"));
  return usersList.filter((user) => user.userId == name)[0] || null;
}

function sessionSave(key, value){
    sessionStorage.setItem(key, value)
}

function startChat(e) {
  let elements = e.getElementsByTagName("input");
  document.getElementById("opener").classList.add("close");
  document.getElementById("chat").classList.add("start");
  let username = elements[0].value;
  let chatter = elements[1].value;
  sessionSave("currentChat", chatter);
  sessionSave("username", username);
  var userData = {
    userId: username,
    socketId: socketId,
  };
  socket.emit("user", userData);
}

function getUserMessage(message) {
  return `
    <div class="w-4/5 flex flex-row mb-1 px-10">
        <span class="w-1/5 flex flex-col chat-them p-1 ">
            <p>${message.message}</p>
            <small>${message.createdAt}</small>
        </span>
    </div>
    `;
}

function getMyMessage(message) {
  return `
    <div class="w-4/5 flex flex-row-reverse px-10 mb-1">
        <span class="w-1/5 flex flex-col chat-me p-1">
            <p>${message.message}</p>
            <small>${message.createdAt}</small>
        </span>
    </div>
    `;
}

function appendChat(message) {
  var el = document.getElementById("chatArea");
  if (message.from == sessionStorage.getItem("username")) {
    message.createdAt = new Date().toLocaleTimeString();
    var mes = getMyMessage(message);
    el.insertAdjacentHTML("beforeend", mes);
  } else {
    var mes = getUserMessage(message);
    el.insertAdjacentHTML("beforeend", mes);
  }
}

function Settings() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}


