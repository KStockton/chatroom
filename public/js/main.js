const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join Chatroom

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from server to DOM
socket.on("message", (msg) => {

  outputMessage(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to the server
  socket.emit("chat-message", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//DOM message update dom

function outputMessage(message) {
  const { username } = message;

  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>
</div>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM

function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
 `;
}
