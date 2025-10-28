// HTML要素の取得
const messagesArea = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');

// WebSocketサーバーへの接続
// "ws://" から始まるURLで接続を開始する
const ws = new WebSocket(`ws://${window.location.host}`);

// 接続が成功したときの処理
ws.onopen = () => {
  console.log('サーバーに接続しました。');
  displayMessage({ name: 'システム', message: 'チャットへようこそ！' });
};

// サーバーからメッセージを受信したときの処理
ws.onmessage = (event) => {
  console.log('サーバーからメッセージを受信:', event.data);
  // 受信したデータは文字列なので、JSONオブジェクトに変換する
  const chatMessage = JSON.parse(event.data);
  displayMessage(chatMessage);
};

// 接続が閉じたときの処理
ws.onclose = () => {
  console.log('サーバーとの接続が切れました。');
  displayMessage({ name: 'システム', message: 'サーバーから切断されました。' });
};

// エラーが発生したときの処理
ws.onerror = (error) => {
  console.error('WebSocketエラー:', error);
  displayMessage({ name: 'システム', message: 'エラーが発生しました。' });
};

// メッセージ送信の処理
// 送信ボタンが押された（フォームが送信された）ときの処理
chatForm.addEventListener('submit', (event) => {
  // ページの再読み込みを防ぐ
  event.preventDefault();

  // 入力された名前とメッセージを取得
  const name = nameInput.value;
  const message = messageInput.value;

  // どちらかが空なら何もしない
  if (!name || !message) {
    return;
  }
  
  // 送信するデータを作成
  const chatMessage = {
    name: name,
    message: message,
  };

  // JSON形式の文字列に変換してサーバーに送信
  ws.send(JSON.stringify(chatMessage));

  // メッセージ入力欄を空にする
  messageInput.value = '';
});

// メッセージを画面に表示する関数
function displayMessage(chatMessage) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `[${chatMessage.name}]: ${chatMessage.message}`;
  messagesArea.appendChild(messageElement);

  // 自動で一番下までスクロールする
  messagesArea.scrollTop = messagesArea.scrollHeight;
}