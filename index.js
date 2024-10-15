const express = require("express");
const path = require("path");
const contentService = require("./content-service")

const app = express();

app.use(express.static('public'));

const HTTP_PORT = process.env.PORT || 4545;

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    const htmlPath = path.join(__dirname, '/views/about.html');
  
    res.sendFile(htmlPath);
});

app.get('/articles', (req, res) => {
    contentService.getAllArticles()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });
});

app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });
});

contentService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () =>
            console.log("Express http server listening on port: " + HTTP_PORT));
    })
    .catch(err => {
        console.error(err);
    });