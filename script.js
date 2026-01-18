const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  addMessage("typing...", "ai");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  chat.lastChild.remove();
  addMessage(data.reply, "ai");
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});


const micBtn = document.getElementById("micBtn");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  micBtn.disabled = true;
  micBtn.innerText = "❌";
  console.error("SpeechRecognition not supported - script.js:45");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";//english

  recognition.lang = "ta-IN"; // Tamil
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.onclick = () => {
    recognition.start();
    micBtn.innerText = "🎙️";
  };

  recognition.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    micBtn.innerText = "🎤";
  };

  recognition.onerror = (e) => {
    console.error("Mic error: - script.js:65", e);
    micBtn.innerText = "🎤";
  };

  recognition.onend = () => {
    micBtn.innerText = "🎤";
  };
}
