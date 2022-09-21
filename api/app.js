const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "karaoke",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});
const app = express();
const port = 8080;

const file = fs.readFileSync("./sample.js")
let utf8decoder = new TextDecoder();
const str = utf8decoder.decode(new Uint8Array(file));
console.log("str: ", str);
// console.log(fs.readFileSync("./sample.js"));

export const sample = () => {
  return "success!!"
}

const corsOptions = {
  origin: "http://localhost:3000", // 許可したいオリジンを指定
  credentials: true, // レスポンスヘッダーにAccess-Control-Allow-Credentialsを追加。ユーザー認証等を行う場合は、これがないとブラウザがレスポンスを捨ててしまうそう。
  optionsSuccessStatus: 200, // レスポンスのHTTPステータスコードを「200(成功)」に設定
};

app.use(cors(corsOptions));

app.get("/api/v1/songs", (req, res) => {
  connection.query("SELECT * FROM `songs`", function (err, results, fields) {
    if (err) {
      console.log("接続終了(異常)");
      throw err;
    }
    res.json(results);
  });
  console.log("接続終了(正常)");
  // res.send("Hello World!");
});

app.get("/api/v1/curations", async (req, res) => {
  const url = "https://api.nordot.jp/v1.0/curator/curations.list";
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjI4MTk4NjAsImlzcyI6ImFwaS5ub3Jkb3QuanAiLCJqdGkiOiI5NDEzMzg4MDY4MzE4NTc2NjQiLCJzdWIiOiI5NDA5MDU5ODkzMjA5NDk3NjAiLCJ0dHkiOiJjdV91bml0X2lkIn0.pwdZgeE1GkbKu-EvoMriazXLqJaVqvA3BNB4eR-MW2w",
    },
  });
  console.log("response: ", response);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port} 🚀`);
});
