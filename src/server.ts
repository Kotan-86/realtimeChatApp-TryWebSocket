// ライブラリなど各種設定
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WebSocketServer, WebSocket } from 'ws';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Webサーバーのセットアップ
const app = express();
// webpageフォルダの中にあるHTMLやJSファイルをブラウザからアクセスできるようにする
app.use(express.static(join(__dirname, '..', 'webpage')));

const server = http.createServer(app);
const PORT = 3000;

// WebSocketサーバーのセットアップ
// 作成したWebサーバーにWebSocketサーバーを同居させる
const wss = new WebSocketServer({ server });

console.log('サーバーが起動しました。ポート:', PORT);
console.log('クライアントからの接続を待っています...');

// 誰かがチャットに接続してきたときの処理
wss.on('connection', (ws: WebSocket) => {
  console.log('新しいクライアントが接続しました。');

  // 接続してきたクライアントからメッセージが送られてきたときの処理
  ws.on('message', (message: string) => {
    console.log('受信したメッセージ:', message.toString());

    // 全員にメッセージを送信（ブロードキャスト）
    // 接続しているクライアント全員をループで処理
    wss.clients.forEach((client) => {
      // メッセージを送ってきた本人も含め、全員にメッセージを転送する
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // 誰かがブラウザを閉じたり、ページを移動したりしたときの処理
  ws.on('close', () => {
    console.log('クライアントとの接続が切れました。');
  });

  // エラーが発生したときの処理
  ws.on('error', (error) => {
    console.error('エラーが発生しました:', error);
  });
});


// サーバーの起動
server.listen(PORT, () => {
  console.log(`チャットサーバーが http://localhost:${PORT} で起動しました`);
});