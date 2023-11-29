const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
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
  e.target.elements.msg.focus() = "";
});

//DOM message update dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Chat Bot <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>
</div>`;
  document.querySelector(".chat-messages").appendChild(div);
}
