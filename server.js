// include the module
const express = require("express");

// the root folder
const path = require("path");

// instantiate the express lib
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Harrison Nguyen - 167096239');
});

// listen for connections
app.listen(HTTP_PORT, () => 
    console.log("Server listening on: http://localhost:" + HTTP_PORT));