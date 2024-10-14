const express = require("express");

const path = require("path");

const app = express();

app.use(express.static('public'));

const HTTP_PORT = process.env.PORT || 4545;

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    var htmlPath = path.join(__dirname, '/views/about.html');
  
    res.sendFile(htmlPath);
});

app.get('/articles', (req, res) => {
    res.send('Articles');
});

app.get('/categories', (req, res) => {
    res.send('Categories');
});

app.listen(HTTP_PORT, () => 
    console.log("Express http server listening on port: " + HTTP_PORT));