import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Webサーバーのセットアップ
const app = express();
const server = http.createServer(app);
const PORT = 3000;

// webpageフォルダのファイルを配信する設定
app.use(express.static(path.join(__dirname, '..', 'webpage')));
// POSTリクエストで送られてくるJSONデータを解釈するための設定
app.use(express.json());


// チャットメッセージを保存する場所
let messages: { name: string, message: string }[] = [];


// APIエンドポイントの作成
// 新しいメッセージを取得するためのAPI
// ブラウザが定期的にアクセスしてくる
app.get('/messages', (req, res) => {
  // 保存されている全てのメッセージをJSON形式で返す
  res.json(messages);
});


// 新しいメッセージを投稿するためのAPI
// ブラウザが「送信」ボタンを押したときにアクセスしてくる
app.post('/messages', (req, res) => {
  const newMessage = req.body;
  console.log('新しいメッセージを受信:', newMessage);

  // 新しいメッセージを配列に追加
  messages.push(newMessage);

  // 成功したことを示すステータスコード201を返す
  res.status(201).send();
});


// サーバーの起動
server.listen(PORT, () => {
  console.log(`HTTPチャットサーバーが http://localhost:${PORT}/index-http.html で起動しました`);
});