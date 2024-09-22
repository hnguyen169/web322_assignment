const express = require("express");

const path = require("path");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {

  var htmlPath = path.join(__dirname, '/views/index.html');

  res.sendFile(htmlPath);
});

app.listen(HTTP_PORT, () => 
    console.log("Server listening on: http://localhost:" + HTTP_PORT));