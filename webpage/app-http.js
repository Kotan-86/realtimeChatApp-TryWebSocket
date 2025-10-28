// HTML要素の取得
const messagesArea = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');


// メッセージ送信の処理 (HTTP POST)
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const message = messageInput.value;
  if (!name || !message) return;

  const chatMessage = { name: name, message: message };

  // 'fetch' を使ってサーバーの '/messages' (POST) にデータを送信
  try {
    await fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatMessage),
    });
    messageInput.value = '';
    // 送信後すぐにメッセージを取得しにいく
    fetchMessages();
  } catch (error) {
    console.error('メッセージの送信に失敗しました:', error);
  }
});


// メッセージ受信の処理 (HTTP GET ポーリング)
// サーバーからメッセージを取得して画面を更新する関数
async function fetchMessages() {
  try {
    // 'fetch' を使ってサーバーの '/messages' (GET) からデータを取得
    const response = await fetch('/messages');
    const messages = await response.json();

    // 画面を一度クリア
    messagesArea.innerHTML = '';
    // 受け取った全てのメッセージを画面に表示
    messages.forEach(displayMessage);
  } catch (error) {
    console.error('メッセージの取得に失敗しました:', error);
  }
}

// 1秒ごと (1000ミリ秒) に fetchMessages 関数を繰り返し実行する
setInterval(fetchMessages, 1000);


// メッセージを画面に表示する関数
function displayMessage(chatMessage) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `[${chatMessage.name}]: ${chatMessage.message}`;
  messagesArea.appendChild(messageElement);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// 最初にページを読み込んだときにもメッセージを取得
fetchMessages();