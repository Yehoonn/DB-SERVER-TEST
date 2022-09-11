// const express = require("express");
// const mysql = require("mysql");
// const dbconfig = require("./public/js/database.js");
// const connection = mysql.createConnection(dbconfig);

import express from "express";
import mysql from "mysql";
import dbconfig from "./database.js";
import path from "path";

const connection = mysql.createConnection(dbconfig);
const __dirname = path.resolve();

const app = express();

let dataArray = [];

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/people/", (request, response) => {
  connection.query(
    "SELECT no,person_name,age,CONCAT_WS('-',SUBSTR(birthday,1,4),SUBSTR(birthday,6,2),SUBSTR(birthday,9,2)) AS birthday FROM people",
    (error, rows, fields) => {
      if (error) {
        throw error;
      }
      for (let value of rows) {
        dataArray.push(value);
      }
      response.send(rows);
    }
  );
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port" + app.get("port"));
});

app.post("/post", (req, res) => {
  let value = req.body;
  if (
    dataArray.findIndex((index) => index.person_name === value.username) !== -1
  ) {
    res.send(`<h1>데이터 전송 완료</h1>
    <h1>${value.username} ${value.age} ${value.birthday}</h1>
    <button onclick="location.href='http://localhost:3000/'">돌아가기</button>`);
    console.log("데이터 추가 완료");
    connection.query(
      `INSERT INTO people(no,person_name,age,birthday) VALUES(null,"${value.username}",${value.age},"${value.birthday}")`
    );
  } else {
    res.send(`<h1>데이터 추가 불가</h1>
    <h1>${value.username}은 이미 있는 데이터입니다</h1>
    <button onclick="location.href='http://localhost:3000/'">돌아가기</button>`);
  }
});

app.post("/delete", (req, res) => {
  let value = req.body;

  if (
    dataArray.findIndex((index) => index.person_name === value.delName) !== -1
  ) {
    res.send(`<h1>데이터 삭제 완료</h1>
  <h1>${value.delName}</h1>
  <button onclick="location.href='http://localhost:3000/'">돌아가기</button>`);
    console.log(value.delName + "님이 데이터에서 삭제되었습니다");
    connection.query(
      `DELETE FROM people WHERE person_name = "${value.delName}"`
    );
  } else {
    res.send(`<h1>데이터 삭제 불가</h1>
    <h1>${value.delName}은 없는 데이터입니다</h1>
    <button onclick="location.href='http://localhost:3000/'">돌아가기</button>`);
  }
});
