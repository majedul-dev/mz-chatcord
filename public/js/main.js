const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const outputMessage = (message) => {
  const { username, text, time } = message;
  const div = document.createElement("dev");
  div.classList.add("message");

  div.innerHTML = `
  <p class="meta">${username} <span>${time}</span></p>
  <p class="text">
    ${text}
  </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
};

const outputRoomName = (room) => {
  roomName.innerText = room;
};

const outputUsers = (users) => {
  usersList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
};
