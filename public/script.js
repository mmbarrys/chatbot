console.log('script.js loaded');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('Submit event fired');

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Tampilkan pesan loading / menunggu respon AI
  appendMessage('bot', 'Gemini is thinking...');

  try {
    // Kirim pesan user ke backend
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });

    // Ambil teks dari respons backend
    const resultText = await response.text();

    // Hapus pesan loading terakhir
    removeLastBotMessage();

    // Tampilkan jawaban dari AI
    appendMessage('bot', resultText);

  } catch (error) {
    console.error('Error fetching AI response:', error);
    removeLastBotMessage();
    appendMessage('bot', 'Terjadi kesalahan saat menghubungi server.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastBotMessage() {
  const messages = document.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].remove();
  }
}
