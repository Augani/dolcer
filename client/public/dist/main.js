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
  addMessage(messageObject);
}
function emitMessage(messageObject) {
  socket.emit("message", messageObject);
}
function SendMessage(e) {
  let message = e.getElementsByTagName("textarea")[0].value;
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
  addMessage(messageObject);
  emitMessage(messageObject);
  e.getElementsByTagName("textarea")[0].value = "";
}

function getSocketId(name) {
  let usersList = JSON.parse(sessionStorage.getItem("users"));
  return usersList.filter((user) => user.userId == name)[0] || null;
}

function sessionSave(key, value) {
  sessionStorage.setItem(key, value);
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
  let image = isAnImage(message.message);
  return `
    <div class="w-4/5 flex flex-row mb-1 px-10">
        <span class="w-1/5 flex flex-col chat-them p-1 ">
        ${
          image
            ? `<img onerror="this.onerror=null; this.src='https://picsum.photos/200'" src="' + message.message + '"/>`
            : "<p>" + message.message + "</p>"
        }
            <small>${message.createdAt}</small>
        </span>
    </div>
    `;
}

function getMyMessage(message) {
  let image = isAnImage(message.message);
  return `
    <div class="w-4/5 flex flex-row-reverse px-10 mb-1">
        <span class="w-1/5 flex flex-col chat-me p-1">
            ${
              image
                ? `<img onerror="this.onerror=null; this.src='https://picsum.photos/200'" src="' + message.message + '"/>`
                : "<p>" + message.message + "</p>"
            }
            <small>${message.createdAt}</small>
        </span>
    </div>
    `;
}

function appendChat(message) {
  debugger;
  var el = document.getElementById("chatArea");
  if (message.from == sessionStorage.getItem("username")) {
    message.createdAt = message.createdAt
      ? timeSetter(message.createdAt)
      : timeSetter(newTime());
    var mes = getMyMessage(message);
    el.insertAdjacentHTML("beforeend", mes);
  } else {
    message.createdAt = timeSetter(message.createdAt);
    var mes = getUserMessage(message);
    el.insertAdjacentHTML("beforeend", mes);
  }
}

function timeSetter(dt) {
  let time = sessionStorage.getItem("time") || 12;
  if (time == 12) {
    return get12Hour(dt);
  } else {
    return get24Hour(dt);
  }
}

function Settings() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function timeChanged(e) {
  if(e.value == 12){
        sessionSave('time', 12)
  }else {
    sessionSave('time', 24)
  }
  reloadMessages()
}

function addMessage(message) {
  let messages = sessionStorage.getItem("messages") || JSON.stringify([]);
  messages = JSON.parse(messages);
  messages.push(message);
  messages = JSON.stringify(messages);
  sessionSave("messages", messages);
}

function reloadMessages() {
  var el = document.getElementById("chatArea");
  let messages = sessionStorage.getItem("messages");
  if(!messages)return;
  messages = JSON.parse(messages);
  el.innerHTML = "";
  for (var t = 0; t < messages.length; t++) {
    appendChat(messages[t]);
  }
}

function get24Hour(datetime) {
    let t = new Date();
    let y = new Date(`${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()} ${datetime}`)
    return y.getHours() + ":" + y.getMinutes();
}

function get12Hour(datetime) {
    let t = new Date();
    let y = new Date(`${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()} ${datetime}`)
  var suffix = y.getHours() >= 12 ? "PM" : "AM";
  let hour =
    y.getHours() > 12
      ? y.getHours() - 12
      : y.getHours();
  let minutes = y.getMinutes();
  return hour + ":" + minutes + " " + suffix;
}

function isAnImage(message) {
  let url;

  try {
    url = new URL(message);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function handler(e){
    if(e.keyCode===13 && e.ctrlKey){
        document.getElementById("sendBtn").click();
    }
}

function ctrlChanged(e){
    if(e.value == "on"){
        document.addEventListener('keydown',handler);
    
    }else {
        document.removeEventListener('keydown',handler);
    }
}

function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  function newTime(){
    let time = sessionStorage.getItem("time") || 12;
    if (time == 12) {
        var date = new Date();
        return date.toLocaleString('en-US');
    } else {
        var date = new Date();
        return date.toLocaleString('en-GB');
    }
  }

  function Reset(){
      let hour = document.getElementById('12hour');
      if(!hour.checked)hour.click();
      let ctrl = document.getElementById('Off')
      if(!ctrl.checked)ctrl.click();
      closeModal();
  }
