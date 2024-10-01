const express = require("express");

const path = require("path");

const app = express();

app.use(express.static('public'));

const HTTP_PORT = process.env.PORT || 4545;

app.get('/', (req, res) => { // (see "Response Objects on Web322.ca")

  var htmlPath = path.join(__dirname, '/views/about.html');

  res.sendFile(htmlPath);
});

app.listen(HTTP_PORT, () => 
    console.log("Express http server listening on port: " + HTTP_PORT));